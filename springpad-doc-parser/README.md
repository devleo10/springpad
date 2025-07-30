# CAMS PDF Parser with LangChain + Gemini

This is a Go backend for uploading and processing CAMS PDF portfolio reports using LangChain and Google's Gemini AI.

## Features

- **LangChain Integration**: Uses LangChain Go for seamless LLM integration
- **Multiple Parsing Strategies**:
  - Multimodal parsing (PDF + text with Gemini Vision)
  - Text-based parsing with document chunking
  - Fallback strategies for robust parsing
- **AI-Powered Extraction**: Leverages Gemini AI for intelligent document understanding
- **Structured Data Output**: Extracts portfolio data into structured JSON format

## Architecture

### Old vs New Approach

**Old Approach (Deprecated):**

- UniPDF for text extraction
- Regex-based parsing
- Manual field extraction
- Limited accuracy

**New Approach (Current):**

- LangChain for document loading and processing
- Gemini AI for intelligent data extraction
- Multiple parsing strategies with fallbacks
- JSON-structured output with high accuracy

## Structure

- `cmd/server/main.go`: App entrypoint
- `internal/handler/`: HTTP handlers
- `internal/service/`: Business logic
- `internal/model/`: Data models
- `internal/parser/`:
  - `langchain_parser.go`: Main LangChain-based parser
  - `cams_extractor.go`: Data structure definitions
  - `legacy_parser.go`: Old regex-based parser (reference only)
- `internal/config/`: Config loading
- `internal/utils/`: Helpers

## Setup

1. **Install Go 1.21+**
2. **Install dependencies:**
   ```sh
   go mod tidy
   ```
3. **Configure environment variables:**
   ```sh
   cp env.example .env
   # Edit .env and add your Gemini API key
   ```
4. **Get Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

## Environment Variables

```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8080
```

## Quick Start

```sh
go run ./cmd/server/main.go
```

## API Endpoints

- `POST /upload-report` — Upload CAMS PDF (now uses LangChain + Gemini)
- `GET /portfolio-data` — Get last parsed portfolio data
- `GET /dashboard/:userID` — Get dashboard summary
- `GET /transactions/:userID` — Get recent activity
- `GET /asset-allocation/:userID` — Pie chart data

## Parsing Strategies

The system uses multiple parsing strategies with automatic fallbacks:

1. **Multimodal Parsing**: Uses Gemini's vision capabilities to process PDF directly
2. **Text-based Parsing**: Extracts text first, then processes with LLM
3. **Chunked Parsing**: For large documents, splits into chunks and processes separately

## Example Response

```json
{
  "investorName": "John Doe",
  "pan": "ABCDE1234F",
  "totalPortfolio": 150000.5,
  "mutualFundsValue": 145000.25,
  "currentCost": 120000.0,
  "unrealisedGain": 25000.25,
  "realisedGain": 5000.0,
  "absReturn": 20.83,
  "xirr": 18.5,
  "changeInADay": 500.75,
  "recentActivities": [
    {
      "scheme": "ABC Large Cap Fund",
      "folioNo": "12345/67",
      "tranDate": "2024-01-15",
      "tranType": "Purchase",
      "nav": 45.67,
      "units": 100.0,
      "amount": 4567.0
    }
  ],
  "debtFundRatings": {
    "Low": 20.0,
    "Moderate": 60.0,
    "High": 20.0
  }
}
```

## Benefits of LangChain + Gemini

- **Higher Accuracy**: AI understands document structure and context
- **Flexibility**: Easy to switch between different LLMs
- **Robustness**: Multiple fallback strategies
- **Maintenance**: Less brittle than regex-based parsing
- **Extensibility**: Easy to add new document types or fields
