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
	// "github.com/ledongthuc/pdf" // No longer needed, using UniPDF
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

	// Use UniPDF-based extraction
	text, err := parser.ExtractTextFromPDF(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to extract text from PDF"})
		return
	}

	log.Println("Extracted PDF text:\n" + text)

	report, err := parser.ParseCAMSReportText(text)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse report"})
		return
	}

	// Print parsed data to the console for debugging
	fmt.Printf("Parsed Data: %+v\n", report)

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
