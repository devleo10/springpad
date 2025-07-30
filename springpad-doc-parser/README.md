
This is a Go backend for uploading and processing CAMS PDF portfolio reports.

## Structure

- `cmd/server/main.go`: App entrypoint
- `internal/handler/`: HTTP handlers
- `internal/service/`: Business logic
- `internal/model/`: Data models
- `internal/parser/`: PDF parsing utilities
- `internal/config/`: Config loading
- `internal/utils/`: Helpers

## Quick Start

1. Install Go 1.21+
2. Run `go mod tidy`
3. Start server:

```sh
go run ./cmd/server/main.go
```

## Endpoints

- `POST /upload-report` — Upload CAMS PDF
- `GET /dashboard/:userID` — Get dashboard summary
- `GET /transactions/:userID` — Get recent activity
- `GET /asset-allocation/:userID` — Pie chart data

---

> PDF parsing logic and business rules to be implemented.
