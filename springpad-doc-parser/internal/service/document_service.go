package service

import (
	"context"
	"fmt"
	"springpad-doc-parser/internal/parser"

	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/googleai"
	"github.com/tmc/langchaingo/llms/openai"
	"github.com/tmc/langchaingo/llms/anthropic"
)

// LLMProvider represents different LLM providers
type LLMProvider string

const (
	ProviderGemini    LLMProvider = "gemini"
	ProviderOpenAI    LLMProvider = "openai"
	ProviderClaude    LLMProvider = "claude"
)

// DocumentParserService provides document parsing with multiple LLM support
type DocumentParserService struct {
	provider LLMProvider
	apiKey   string
	model    string
}

// NewDocumentParserService creates a new document parser service
func NewDocumentParserService(provider LLMProvider, apiKey, model string) *DocumentParserService {
	return &DocumentParserService{
		provider: provider,
		apiKey:   apiKey,
		model:    model,
	}
}

// ParseDocument parses a document using the configured LLM provider
func (s *DocumentParserService) ParseDocument(filePath string) (*parser.ParsedReport, error) {
	switch s.provider {
	case ProviderGemini:
		return s.parseWithGemini(filePath)
	case ProviderOpenAI:
		return s.parseWithOpenAI(filePath)
	case ProviderClaude:
		return s.parseWithClaude(filePath)
	default:
		return nil, fmt.Errorf("unsupported LLM provider: %s", s.provider)
	}
}

// parseWithGemini uses Google's Gemini for document parsing
func (s *DocumentParserService) parseWithGemini(filePath string) (*parser.ParsedReport, error) {
	langchainParser, err := parser.NewLangchainParser(s.apiKey, s.model)
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini parser: %w", err)
	}

	// Try multimodal first, then fallback to text-based
	report, err := langchainParser.ParsePDFWithMultimodal(filePath)
	if err != nil {
		report, err = langchainParser.ParsePDFWithLangchain(filePath)
		if err != nil {
			return nil, fmt.Errorf("Gemini parsing failed: %w", err)
		}
	}

	return report, nil
}

// parseWithOpenAI uses OpenAI's GPT for document parsing
func (s *DocumentParserService) parseWithOpenAI(filePath string) (*parser.ParsedReport, error) {
	ctx := context.Background()
	
	// Initialize OpenAI LLM
	llm, err := openai.New(
		openai.WithToken(s.apiKey),
		openai.WithModel(s.model), // e.g., "gpt-4", "gpt-3.5-turbo"
	)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize OpenAI: %w", err)
	}

	// Extract text first (OpenAI doesn't support PDF directly)
	text, err := parser.ExtractTextWithLangchain(filePath, s.apiKey)
	if err != nil {
		return nil, fmt.Errorf("failed to extract text: %w", err)
	}

	// Create prompt
	prompt := createOpenAIPrompt(text)

	// Generate response
	response, err := llms.GenerateFromSinglePrompt(ctx, llm, prompt)
	if err != nil {
		return nil, fmt.Errorf("OpenAI generation failed: %w", err)
	}

	// Parse response (you'll need to implement this based on your needs)
	report, err := parseOpenAIResponse(response)
	if err != nil {
		return nil, fmt.Errorf("failed to parse OpenAI response: %w", err)
	}

	return report, nil
}

// parseWithClaude uses Anthropic's Claude for document parsing
func (s *DocumentParserService) parseWithClaude(filePath string) (*parser.ParsedReport, error) {
	ctx := context.Background()

	// Initialize Claude LLM
	llm, err := anthropic.New(
		anthropic.WithToken(s.apiKey),
		anthropic.WithModel(s.model), // e.g., "claude-3-opus", "claude-3-sonnet"
	)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Claude: %w", err)
	}

	// Extract text first
	text, err := parser.ExtractTextWithLangchain(filePath, s.apiKey)
	if err != nil {
		return nil, fmt.Errorf("failed to extract text: %w", err)
	}

	// Create prompt
	prompt := createClaudePrompt(text)

	// Generate response
	response, err := llms.GenerateFromSinglePrompt(ctx, llm, prompt)
	if err != nil {
		return nil, fmt.Errorf("Claude generation failed: %w", err)
	}

	// Parse response
	report, err := parseClaudeResponse(response)
	if err != nil {
		return nil, fmt.Errorf("failed to parse Claude response: %w", err)
	}

	return report, nil
}

// Helper functions for different LLM prompts and response parsing

func createOpenAIPrompt(text string) string {
	return fmt.Sprintf(`
You are an expert financial document parser. Analyze the following CAMS portfolio statement text and extract structured data.

Extract the following information and return as JSON:
{
  "investorName": "string",
  "pan": "string",
  "totalPortfolio": number,
  "mutualFundsValue": number,
  "currentCost": number,
  "unrealisedGain": number,
  "realisedGain": number,
  "absReturn": number,
  "xirr": number,
  "changeInADay": number,
  "recentActivities": [],
  "debtFundRatings": {}
}

Document text:
%s

Return only valid JSON, no additional text.
`, text)
}

func createClaudePrompt(text string) string {
	return fmt.Sprintf(`
I need you to parse a CAMS portfolio statement and extract key financial data.

Please analyze this document text and return structured JSON with:
- Investor name and PAN
- Portfolio values and costs  
- Returns (absolute and XIRR)
- Recent transactions
- Risk ratings

Document:
%s

Respond with clean JSON only.
`, text)
}

func parseOpenAIResponse(response string) (*parser.ParsedReport, error) {
	// Implement JSON parsing logic similar to LangChain parser
	// This is a placeholder - you'd implement the actual parsing
	return &parser.ParsedReport{}, nil
}

func parseClaudeResponse(response string) (*parser.ParsedReport, error) {
	// Implement JSON parsing logic similar to LangChain parser
	// This is a placeholder - you'd implement the actual parsing
	return &parser.ParsedReport{}, nil
}

// GetSupportedProviders returns list of supported LLM providers
func GetSupportedProviders() []LLMProvider {
	return []LLMProvider{
		ProviderGemini,
		ProviderOpenAI, 
		ProviderClaude,
	}
}

// GetDefaultModel returns the default model for each provider
func GetDefaultModel(provider LLMProvider) string {
	switch provider {
	case ProviderGemini:
		return "gemini-1.5-flash"
	case ProviderOpenAI:
		return "gpt-4"
	case ProviderClaude:
		return "claude-3-sonnet-20240229"
	default:
		return ""
	}
}
