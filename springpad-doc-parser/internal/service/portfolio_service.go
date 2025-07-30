package service

import (
	"fmt"
	"os"
	"springpad-doc-parser/internal/parser"
)

// ProcessPortfolioFromPDF processes a portfolio PDF using LangChain + LLM
func ProcessPortfolioFromPDF(filePath string) (*parser.ParsedReport, error) {
	// Get API key from environment
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("API key not configured")
	}

	// Create document parser service (default to Gemini)
	service := NewDocumentParserService(ProviderGemini, apiKey, GetDefaultModel(ProviderGemini))
	
	// Parse the document
	report, err := service.ParseDocument(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to process portfolio PDF: %w", err)
	}

	// Additional business logic can be added here
	// e.g., validation, enrichment, calculations, etc.
	
	return report, nil
}

// ProcessPortfolioWithProvider processes a portfolio PDF using a specific LLM provider
func ProcessPortfolioWithProvider(filePath string, provider LLMProvider, apiKey string) (*parser.ParsedReport, error) {
	service := NewDocumentParserService(provider, apiKey, GetDefaultModel(provider))
	return service.ParseDocument(filePath)
}

// ValidatePortfolioData validates extracted portfolio data
func ValidatePortfolioData(report *parser.ParsedReport) error {
	if report == nil {
		return fmt.Errorf("report is nil")
	}
	
	if report.InvestorName == "" {
		return fmt.Errorf("investor name is required")
	}
	
	if report.PAN == "" || len(report.PAN) != 10 {
		return fmt.Errorf("valid PAN is required")
	}
	
	if report.TotalPortfolio < 0 {
		return fmt.Errorf("total portfolio value cannot be negative")
	}
	
	return nil
}

// EnrichPortfolioData adds additional calculated fields
func EnrichPortfolioData(report *parser.ParsedReport) {
	if report == nil {
		return
	}
	
	// Calculate additional metrics if needed
	if report.CurrentCost > 0 && report.TotalPortfolio > 0 {
		// Ensure absolute return is calculated correctly
		if report.AbsReturn == 0 {
			report.AbsReturn = ((report.TotalPortfolio - report.CurrentCost) / report.CurrentCost) * 100
		}
	}
	
	// Add any other business logic for data enrichment
}
