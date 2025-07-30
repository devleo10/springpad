package parser

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

package parser

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/googleai"
	"github.com/tmc/langchaingo/documentloaders"
	"github.com/tmc/langchaingo/textsplitter"
	"github.com/tmc/langchaingo/schema"
)

// LangchainParser handles PDF parsing using LangChain and various LLMs
type LangchainParser struct {
	llm        llms.Model
	apiKey     string
	modelName  string
	ctx        context.Context
}

// NewLangchainParser creates a new instance of LangchainParser
func NewLangchainParser(apiKey string, modelName ...string) (*LangchainParser, error) {
	model := "gemini-1.5-flash" // default
	if len(modelName) > 0 {
		model = modelName[0]
	}

	// Initialize Gemini LLM through LangChain
	llm, err := googleai.New(
		context.Background(),
		googleai.WithAPIKey(apiKey),
		googleai.WithDefaultModel(model),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize LLM: %w", err)
	}

	return &LangchainParser{
		llm:       llm,
		apiKey:    apiKey,
		modelName: model,
		ctx:       context.Background(),
	}, nil
}

// ParsePDFWithLangchain parses a PDF file using LangChain and LLM
func (p *LangchainParser) ParsePDFWithLangchain(filePath string) (*ParsedReport, error) {
	// Load PDF document using LangChain document loader
	loader := documentloaders.NewPDF(filePath)
	docs, err := loader.Load(p.ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to load PDF with LangChain: %w", err)
	}

	if len(docs) == 0 {
		return nil, fmt.Errorf("no content extracted from PDF")
	}

	// Combine all document content
	var fullContent strings.Builder
	for _, doc := range docs {
		fullContent.WriteString(doc.PageContent)
		fullContent.WriteString("\n")
	}

	// Create structured prompt for CAMS portfolio extraction
	prompt := p.createCAMSExtractionPrompt()
	
	// Prepare the full prompt with document content
	fullPrompt := fmt.Sprintf("%s\n\nDocument Content:\n%s", prompt, fullContent.String())

	// Generate content using LangChain LLM
	response, err := llms.GenerateFromSinglePrompt(p.ctx, p.llm, fullPrompt)
	if err != nil {
		return nil, fmt.Errorf("failed to generate content with LLM: %w", err)
	}

	// Parse the JSON response
	report, err := p.parseResponse(response)
	if err != nil {
		return nil, fmt.Errorf("failed to parse LLM response: %w", err)
	}

	return report, nil
}

// ParsePDFWithMultimodal parses PDF using multimodal capabilities (for Gemini Vision)
func (p *LangchainParser) ParsePDFWithMultimodal(filePath string) (*ParsedReport, error) {
	// Read PDF file as base64
	pdfData, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read PDF file: %w", err)
	}

	pdfBase64 := base64.StdEncoding.EncodeToString(pdfData)

	// Create multimodal content with both text prompt and PDF
	prompt := p.createCAMSExtractionPrompt()
	
	// For multimodal, we'll use the content parts approach
	content := []llms.ContentPart{
		llms.TextPart(prompt),
		llms.BinaryPart("application/pdf", pdfData),
	}

	// Generate content using multimodal LLM
	response, err := p.llm.GenerateContent(p.ctx, []llms.MessageContent{
		{
			Role:  schema.ChatMessageTypeHuman,
			Parts: content,
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to generate multimodal content: %w", err)
	}

	if len(response.Choices) == 0 {
		return nil, fmt.Errorf("no response from LLM")
	}

	// Parse the JSON response
	report, err := p.parseResponse(response.Choices[0].Content)
	if err != nil {
		return nil, fmt.Errorf("failed to parse LLM response: %w", err)
	}

	return report, nil
}

// ParsePDFWithChunking parses large PDFs by chunking the content
func (p *LangchainParser) ParsePDFWithChunking(filePath string) (*ParsedReport, error) {
	// Load PDF document
	loader := documentloaders.NewPDF(filePath)
	docs, err := loader.Load(p.ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to load PDF: %w", err)
	}

	// Split documents into chunks if they're large
	splitter := textsplitter.NewRecursiveCharacter()
	splitter.ChunkSize = 4000
	splitter.ChunkOverlap = 200

	chunks, err := splitter.SplitDocuments(p.ctx, docs)
	if err != nil {
		return nil, fmt.Errorf("failed to split documents: %w", err)
	}

	// Process each chunk and aggregate results
	var allData []map[string]interface{}
	
	for i, chunk := range chunks {
		prompt := fmt.Sprintf(`
Extract CAMS portfolio data from this document chunk (part %d). 
Return JSON with any available fields from this structure:
{
  "investorName": "string",
  "pan": "string", 
  "totalPortfolio": "number",
  "mutualFundsValue": "number",
  "currentCost": "number",
  "unrealisedGain": "number",
  "realisedGain": "number",
  "absReturn": "number",
  "xirr": "number",
  "changeInADay": "number",
  "recentActivities": [],
  "debtFundRatings": {}
}

Only include fields that have actual data in this chunk. Return empty object {} if no relevant data found.

Content: %s`, i+1, chunk.PageContent)

		response, err := llms.GenerateFromSinglePrompt(p.ctx, p.llm, prompt)
		if err != nil {
			continue // Skip failed chunks
		}

		var chunkData map[string]interface{}
		if err := json.Unmarshal([]byte(p.cleanJSONResponse(response)), &chunkData); err == nil {
			allData = append(allData, chunkData)
		}
	}

	// Merge all chunk data into final report
	report := p.mergeChunkData(allData)
	return report, nil
}

// createCAMSExtractionPrompt creates the structured prompt for CAMS data extraction
func (p *LangchainParser) createCAMSExtractionPrompt() string {
	return `
You are an expert financial document parser specializing in CAMS (Computer Age Management Services) portfolio statements. 

Extract the following information from the document and return it as a valid JSON object:

{
  "investorName": "string - investor's full name",
  "pan": "string - PAN number (10 characters)",
  "totalPortfolio": "number - total portfolio value",
  "mutualFundsValue": "number - mutual funds value", 
  "currentCost": "number - current cost of investments",
  "unrealisedGain": "number - unrealised gains/losses",
  "realisedGain": "number - realised gains/losses",
  "absReturn": "number - absolute return percentage", 
  "xirr": "number - XIRR return percentage",
  "changeInADay": "number - change in portfolio value in a day",
  "recentActivities": [
    {
      "scheme": "string - mutual fund scheme name",
      "folioNo": "string - folio number", 
      "tranDate": "string - transaction date",
      "tranType": "string - transaction type",
      "nav": "number - NAV at transaction",
      "units": "number - number of units",
      "amount": "number - transaction amount"
    }
  ],
  "debtFundRatings": {
    "Low": "number - percentage allocation",
    "Low to Moderate": "number - percentage allocation", 
    "Moderate": "number - percentage allocation",
    "Moderately High": "number - percentage allocation",
    "High": "number - percentage allocation",
    "Very High": "number - percentage allocation"
  }
}

Instructions:
1. Look for investor name and PAN at the document header
2. Find portfolio summary section for total values
3. Extract recent transactions from tables
4. Look for risk profile or asset allocation data
5. Find return calculations (absolute and XIRR)
6. If any field is not available, set it to 0 or empty as appropriate
7. Return ONLY the JSON object, no additional text

`
}

// parseResponse parses the LLM response and extracts ParsedReport
func (p *LangchainParser) parseResponse(response string) (*ParsedReport, error) {
	// Clean up the response
	jsonText := p.cleanJSONResponse(response)

	// Parse JSON into ParsedReport
	var report ParsedReport
	if err := json.Unmarshal([]byte(jsonText), &report); err != nil {
		return nil, fmt.Errorf("failed to parse JSON response: %w. Response was: %s", err, jsonText)
	}

	return &report, nil
}

// cleanJSONResponse cleans up the LLM response to extract valid JSON
func (p *LangchainParser) cleanJSONResponse(response string) string {
	jsonText := strings.TrimSpace(response)
	
	// Remove markdown formatting
	if strings.HasPrefix(jsonText, "```json") {
		jsonText = strings.TrimPrefix(jsonText, "```json")
	}
	if strings.HasPrefix(jsonText, "```") {
		jsonText = strings.TrimPrefix(jsonText, "```")
	}
	if strings.HasSuffix(jsonText, "```") {
		jsonText = strings.TrimSuffix(jsonText, "```")
	}
	
	return strings.TrimSpace(jsonText)
}

// mergeChunkData merges data from multiple chunks into a single report
func (p *LangchainParser) mergeChunkData(chunks []map[string]interface{}) *ParsedReport {
	merged := &ParsedReport{
		RecentActivities: []RecentActivity{},
		DebtFundRatings:  map[string]float64{},
	}

	for _, chunk := range chunks {
		// Merge basic fields (take first non-empty value)
		if name, ok := chunk["investorName"].(string); ok && name != "" && merged.InvestorName == "" {
			merged.InvestorName = name
		}
		if pan, ok := chunk["pan"].(string); ok && pan != "" && merged.PAN == "" {
			merged.PAN = pan
		}
		if val, ok := chunk["totalPortfolio"].(float64); ok && val > 0 && merged.TotalPortfolio == 0 {
			merged.TotalPortfolio = val
		}
		if val, ok := chunk["mutualFundsValue"].(float64); ok && val > 0 && merged.MutualFundsValue == 0 {
			merged.MutualFundsValue = val
		}
		if val, ok := chunk["currentCost"].(float64); ok && val > 0 && merged.CurrentCost == 0 {
			merged.CurrentCost = val
		}
		if val, ok := chunk["unrealisedGain"].(float64); ok && merged.UnrealisedGain == 0 {
			merged.UnrealisedGain = val
		}
		if val, ok := chunk["realisedGain"].(float64); ok && merged.RealisedGain == 0 {
			merged.RealisedGain = val
		}
		if val, ok := chunk["absReturn"].(float64); ok && merged.AbsReturn == 0 {
			merged.AbsReturn = val
		}
		if val, ok := chunk["xirr"].(float64); ok && merged.XIRR == 0 {
			merged.XIRR = val
		}
		if val, ok := chunk["changeInADay"].(float64); ok && merged.ChangeInADay == 0 {
			merged.ChangeInADay = val
		}

		// Merge arrays and maps
		if activities, ok := chunk["recentActivities"].([]interface{}); ok {
			for _, activity := range activities {
				if actMap, ok := activity.(map[string]interface{}); ok {
					act := RecentActivity{}
					if scheme, ok := actMap["scheme"].(string); ok {
						act.Scheme = scheme
					}
					if folio, ok := actMap["folioNo"].(string); ok {
						act.FolioNo = folio
					}
					if date, ok := actMap["tranDate"].(string); ok {
						act.TranDate = date
					}
					if tranType, ok := actMap["tranType"].(string); ok {
						act.TranType = tranType
					}
					if nav, ok := actMap["nav"].(float64); ok {
						act.NAV = nav
					}
					if units, ok := actMap["units"].(float64); ok {
						act.Units = units
					}
					if amount, ok := actMap["amount"].(float64); ok {
						act.Amount = amount
					}
					merged.RecentActivities = append(merged.RecentActivities, act)
				}
			}
		}

		if ratings, ok := chunk["debtFundRatings"].(map[string]interface{}); ok {
			for key, val := range ratings {
				if floatVal, ok := val.(float64); ok {
					merged.DebtFundRatings[key] = floatVal
				}
			}
		}
	}

	return merged
}

// ExtractTextWithLangchain extracts text using LangChain (for compatibility)
func ExtractTextWithLangchain(filePath string, apiKey string) (string, error) {
	parser, err := NewLangchainParser(apiKey)
	if err != nil {
		return "", err
	}

	// Load PDF document
	loader := documentloaders.NewPDF(filePath)
	docs, err := loader.Load(parser.ctx)
	if err != nil {
		return "", fmt.Errorf("failed to load PDF: %w", err)
	}

	// Combine all content
	var content strings.Builder
	for _, doc := range docs {
		content.WriteString(doc.PageContent)
		content.WriteString("\n")
	}

	return content.String(), nil
}
