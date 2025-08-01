# Springpad Doc Parser API Documentation

## Overview
This API allows you to upload CAMS/KFintech mutual fund PDF statements (including password-protected files) and receive structured portfolio data as JSON. It is designed for stateless, secure, and production-ready operation.

---

## Endpoint

### POST `/upload`

**Description:**
Uploads a PDF statement and returns parsed portfolio data.

#### Request
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `pdf` (required): The PDF file to upload. Must be `application/pdf`, max size 5MB.
  - `password` (optional): Password for password-protected PDFs (string).

#### Example (cURL)
```
curl -F "pdf=@/path/to/statement.pdf" -F "password=123456" http://localhost:3001/upload
```

#### Response
- **Success (200):**
```
{
  "success": true,
  "data": { ...parsed portfolio data... },
  "durationMs": 1234
}
```
- **Error (4xx/5xx):**
```
{
  "success": false,
  "error": "Error message",
  "raw": "Raw output from parser (only in development mode)"
}
```

#### Security
- Rate limited: 20 requests per minute per IP.
- Security headers set via [helmet](https://www.npmjs.com/package/helmet).
- All inputs validated (file type, size, password).
- All outputs sanitized to avoid leaking sensitive info.

#### Notes
- No global state; each request is stateless.
- All errors are logged and monitored.
- Only PDF files are accepted; other file types are rejected.

---

## Contact
For support or questions, contact the API maintainer.
