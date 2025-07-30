# Springpad Backend - PDF Upload & AI Chat Service

This backend service provides PDF upload functionality with AI-powered analysis using Google's Gemini AI via LangChain.

## Features

- **PDF Upload & Text Extraction**: Upload PDF files and extract text content
- **AI Chat with PDF**: Ask questions about uploaded PDF content
- **Summarization**: Get AI-generated summaries of PDF documents
- **Key Insights**: Extract important insights and actionable information
- **Custom Analysis**: Perform specialized analysis (financial, legal, technical, academic, business)
- **Multiple Q&A**: Ask multiple questions about a single PDF

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
copy .env.example .env
```

Edit `.env` and add your Google API key:

```env
PORT=3001
GOOGLE_API_KEY=your_actual_google_api_key_here
MAX_FILE_SIZE_MB=10
UPLOAD_DIR=uploads
```

### 3. Get Google API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### 4. Run the Server

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
npm start
```

## API Endpoints

### 1. Upload PDF and Chat

**POST** `/api/upload/pdf`

Upload a PDF file and ask a question about it.

**Form Data:**

- `pdf` (file): PDF file to upload
- `query` (text, optional): Question about the PDF (default: "Summarize the main points")

**Response:**

```json
{
  "success": true,
  "filename": "generated-filename.pdf",
  "originalName": "original-file.pdf",
  "extractedText": "First 1000 characters...",
  "fullTextLength": 15000,
  "geminiResponse": "AI response to your query",
  "query": "Your question"
}
```

### 2. Chat with Existing PDF Content

**POST** `/api/upload/chat`

Ask questions about already extracted PDF content.

**JSON Body:**

```json
{
  "pdfContent": "Previously extracted text content",
  "query": "Your question about the content"
}
```

### 3. Summarize PDF

**POST** `/api/upload/summarize`

Get a comprehensive summary of the PDF.

**Form Data:**

- `pdf` (file): PDF file to upload

### 4. Extract Key Insights

**POST** `/api/upload/insights`

Extract important insights and actionable information.

**Form Data:**

- `pdf` (file): PDF file to upload

### 5. Custom Analysis

**POST** `/api/upload/analyze/:type`

Perform specialized analysis based on document type.

**Parameters:**

- `type`: One of `financial`, `legal`, `technical`, `academic`, `business`

**Form Data:**

- `pdf` (file): PDF file to upload

### 6. Answer Multiple Questions

**POST** `/api/upload/questions`

Ask multiple questions about a PDF in one request.

**Form Data:**

- `pdf` (file): PDF file to upload

**JSON Body:**

```json
{
  "questions": [
    "What is the main topic?",
    "What are the key findings?",
    "What are the recommendations?"
  ]
}
```

## Usage Examples

### Using curl

```bash
# Upload PDF and ask a question
curl -X POST http://localhost:3001/api/upload/pdf \
  -F "pdf=@document.pdf" \
  -F "query=What are the main conclusions?"

# Summarize PDF
curl -X POST http://localhost:3001/api/upload/summarize \
  -F "pdf=@document.pdf"

# Financial analysis
curl -X POST http://localhost:3001/api/upload/analyze/financial \
  -F "pdf=@financial-report.pdf"
```

### Using JavaScript/TypeScript

```typescript
// Upload and chat with PDF
const formData = new FormData();
formData.append("pdf", pdfFile);
formData.append("query", "What are the key points?");

const response = await fetch("/api/upload/pdf", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log(result.geminiResponse);
```

## File Limitations

- **File Type**: Only PDF files are supported
- **File Size**: Maximum 10MB per file
- **Text Length**: Long documents are automatically truncated for AI processing

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

- `400`: Bad request (invalid file, missing parameters)
- `500`: Server error (processing failure, AI service error)

## Security Notes

1. Uploaded files are automatically deleted after text extraction
2. Keep your Google API key secure and never commit it to version control
3. The service processes files server-side - no client-side exposure of API keys

## Dependencies

- **Express**: Web framework
- **Multer**: File upload handling
- **LangChain**: AI framework for Google Gemini integration
- **pdf-parse**: PDF text extraction
- **TypeScript**: Type safety
