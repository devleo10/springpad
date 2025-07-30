package handler

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"springpad-doc-parser/internal/parser"
	"sync"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.POST("/upload", UploadHandler)
	r.GET("/portfolio-data", PortfolioDataHandler)
}

var (
	parsedReport   *parser.ParsedReport
	parsedReportMu sync.RWMutex
)

// UploadHandler handles PDF upload, parses it, and stores result in memory
func UploadHandler(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	tmpDir := os.TempDir()
	filePath := filepath.Join(tmpDir, file.Filename)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Get Gemini API key from environment
	geminiAPIKey := os.Getenv("GEMINI_API_KEY")
	if geminiAPIKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gemini API key not configured"})
		return
	}

	// Use LangChain-based parser with Gemini
	langchainParser, err := parser.NewLangchainParser(geminiAPIKey)
	if err != nil {
		log.Printf("Failed to initialize LangChain parser: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize AI parser"})
		return
	}

	// Try multimodal parsing first (better for complex PDFs)
	report, err := langchainParser.ParsePDFWithMultimodal(filePath)
	if err != nil {
		log.Printf("Multimodal parsing failed, trying text-based: %v", err)
		// Fallback to text-based parsing
		report, err = langchainParser.ParsePDFWithLangchain(filePath)
		if err != nil {
			log.Printf("Text-based parsing failed, trying chunked approach: %v", err)
			// Final fallback to chunked parsing for large documents
			report, err = langchainParser.ParsePDFWithChunking(filePath)
			if err != nil {
				log.Printf("All parsing methods failed: %v", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse PDF with AI"})
				return
			}
		}
	}

	// Clean up temporary file
	os.Remove(filePath)

	// Print parsed data to the console for debugging
	fmt.Printf("Parsed Data with LangChain + Gemini: %+v\n", report)

	parsedReportMu.Lock()
	parsedReport = report
	parsedReportMu.Unlock()

	c.JSON(http.StatusOK, report)
}

// PortfolioDataHandler returns the last parsed report (in-memory)
func PortfolioDataHandler(c *gin.Context) {
	parsedReportMu.RLock()
	report := parsedReport
	parsedReportMu.RUnlock()
	if report == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No report parsed yet"})
		return
	}
	c.JSON(http.StatusOK, report)
}

func TransactionsHandler(c *gin.Context) {
	// TODO: Return transactions data
	c.JSON(http.StatusOK, gin.H{"message": "Transactions endpoint stub"})
}

func AssetAllocationHandler(c *gin.Context) {
	// TODO: Return asset allocation data
	c.JSON(http.StatusOK, gin.H{"message": "Asset allocation endpoint stub"})
}
