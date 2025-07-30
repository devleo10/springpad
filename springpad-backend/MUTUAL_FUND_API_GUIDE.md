# Mutual Fund PDF Parser - API Usage Examples

This document shows how to use the mutual fund parsing endpoints.

## Setup Instructions

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
# Edit .env and add your Google API key
```

3. **Start the server:**

```bash
npm run dev
```

## API Endpoints for Mutual Fund Processing

### 1. Parse Complete Mutual Fund Statement

**Endpoint:** `POST /api/upload/mutual-fund/parse`

This endpoint extracts all structured data from a mutual fund statement PDF.

**Request:**

```bash
curl -X POST http://localhost:3001/api/upload/mutual-fund/parse \
  -F "pdf=@mutual-fund-statement.pdf"
```

**Response:**

```json
{
  "success": true,
  "filename": "pdf-1642234567890-123456789.pdf",
  "originalName": "mutual-fund-statement.pdf",
  "data": {
    "investor": {
      "name": "John Doe",
      "pan": "ABCDE1234F"
    },
    "summary": {
      "total_value": 150000.5,
      "current_cost": 120000.0,
      "unrealised_gain": 30000.5,
      "realised_gain": 5000.0,
      "absolute_return": 29.17,
      "xirr": 15.25,
      "change_in_a_day": 1250.75
    },
    "transactions": [
      {
        "scheme": "HDFC Equity Fund - Direct Plan",
        "folio_no": "12345678",
        "tran_date": "2024-01-15",
        "tran_type": "Purchase",
        "nav": 245.67,
        "units": 40.61,
        "amount": 10000.0
      }
    ],
    "asset_allocation": [
      {
        "category": "Equity",
        "percent": 75.5
      },
      {
        "category": "Debt",
        "percent": 20.3
      },
      {
        "category": "Cash",
        "percent": 4.2
      }
    ],
    "_validation": {
      "isValid": true,
      "errors": [],
      "warnings": []
    }
  },
  "textLength": 15420
}
```

### 2. Extract Specific Data Types

**Base URL:** `POST /api/upload/mutual-fund/extract/:dataType`

Where `:dataType` can be:

- `investor` - Extract investor information
- `summary` - Extract portfolio summary
- `transactions` - Extract transaction history
- `allocation` - Extract asset allocation

**Example - Extract Investor Info:**

```bash
curl -X POST http://localhost:3001/api/upload/mutual-fund/extract/investor \
  -F "pdf=@statement.pdf"
```

**Response:**

```json
{
  "success": true,
  "filename": "pdf-1642234567890-123456789.pdf",
  "originalName": "statement.pdf",
  "dataType": "investor",
  "data": {
    "name": "John Doe",
    "pan": "ABCDE1234F"
  },
  "textLength": 15420
}
```

**Example - Extract Transactions:**

```bash
curl -X POST http://localhost:3001/api/upload/mutual-fund/extract/transactions \
  -F "pdf=@statement.pdf"
```

**Response:**

```json
{
  "success": true,
  "dataType": "transactions",
  "data": [
    {
      "scheme": "HDFC Equity Fund - Direct Plan",
      "folio_no": "12345678",
      "tran_date": "2024-01-15",
      "tran_type": "Purchase",
      "nav": 245.67,
      "units": 40.61,
      "amount": 10000.0
    },
    {
      "scheme": "ICICI Debt Fund - Growth",
      "folio_no": "87654321",
      "tran_date": "2024-02-01",
      "tran_type": "SIP",
      "nav": 152.34,
      "units": 65.78,
      "amount": 10000.0
    }
  ]
}
```

## JavaScript/TypeScript Usage

### Using fetch API

```typescript
interface MutualFundData {
  investor: { name: string; pan: string };
  summary: {
    total_value: number;
    current_cost: number;
    unrealised_gain: number;
    realised_gain: number;
    absolute_return: number;
    xirr: number;
    change_in_a_day: number;
  };
  transactions: Array<{
    scheme: string;
    folio_no: string;
    tran_date: string;
    tran_type: string;
    nav: number;
    units: number;
    amount: number;
  }>;
  asset_allocation: Array<{
    category: string;
    percent: number;
  }>;
}

// Parse complete statement
async function parseMutualFundStatement(
  pdfFile: File
): Promise<MutualFundData> {
  const formData = new FormData();
  formData.append("pdf", pdfFile);

  const response = await fetch("/api/upload/mutual-fund/parse", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to parse statement");
  }

  return result.data;
}

// Extract specific data type
async function extractMutualFundData(
  pdfFile: File,
  dataType: "investor" | "summary" | "transactions" | "allocation"
) {
  const formData = new FormData();
  formData.append("pdf", pdfFile);

  const response = await fetch(`/api/upload/mutual-fund/extract/${dataType}`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  return result.data;
}
```

### React Component Example

```tsx
import React, { useState } from "react";

const MutualFundParser: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<MutualFundData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleParse = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const result = await parseMutualFundStatement(file);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleParse} disabled={!file || loading}>
        {loading ? "Parsing..." : "Parse Statement"}
      </button>

      {error && <div className="error">{error}</div>}

      {data && (
        <div>
          <h3>Investor: {data.investor.name}</h3>
          <p>PAN: {data.investor.pan}</p>
          <p>Total Value: ₹{data.summary.total_value.toLocaleString()}</p>
          <p>
            Unrealised Gain: ₹{data.summary.unrealised_gain.toLocaleString()}
          </p>

          <h4>Transactions ({data.transactions.length})</h4>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Scheme</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn.tran_date}</td>
                  <td>{txn.scheme}</td>
                  <td>{txn.tran_type}</td>
                  <td>₹{txn.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
```

## Data Validation

The API automatically validates and formats the extracted data:

- **PAN Validation**: Checks PAN format (ABCDE1234F)
- **Date Formatting**: Converts dates to YYYY-MM-DD format
- **Number Parsing**: Handles currency symbols and commas
- **Completeness Check**: Warns about missing fields
- **Consistency Check**: Validates asset allocation percentages sum to ~100%

## Error Handling

All endpoints return structured error responses:

```json
{
  "success": false,
  "error": "Failed to parse mutual fund statement",
  "details": "Invalid PDF format or unreadable content"
}
```

Common error scenarios:

- Invalid or corrupted PDF files
- PDFs without readable text (scanned images)
- Missing Google API key
- AI service failures
- Network timeouts

## Tips for Better Results

1. **PDF Quality**: Use high-quality, text-based PDFs
2. **Standard Formats**: Works best with standard AMC statement formats
3. **Complete Statements**: Full statements give better results than partial ones
4. **Clear Scans**: If using scanned PDFs, ensure good clarity

## Rate Limits

- File size limit: 10MB per PDF
- Processing time: Usually 10-30 seconds depending on PDF complexity
- Google API limits apply based on your API key tier
