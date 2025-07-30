package parser

import (
	"regexp"
	"strconv"
	"strings"
)

// ParsedReport holds all extracted data from the CAMS PDF
// (Add more fields as needed for your dashboard)
type ParsedReport struct {
	InvestorName     string
	PAN              string
	TotalPortfolio   float64
	MutualFundsValue float64
	CurrentCost      float64
	UnrealisedGain   float64
	RealisedGain     float64
	AbsReturn        float64
	XIRR             float64
	ChangeInADay     float64
	RecentActivities []RecentActivity
	DebtFundRatings  map[string]float64
}

type RecentActivity struct {
	Scheme   string
	FolioNo  string
	TranDate string
	TranType string
	NAV      float64
	Units    float64
	Amount   float64
}

// ParseCAMSReportText parses the extracted text from a CAMS PDF report
func ParseCAMSReportText(text string) (*ParsedReport, error) {
	// Example: extract investor name and PAN
	// Normalize line endings and trim spaces
	text = strings.ReplaceAll(text, "\r\n", "\n")
	text = strings.ReplaceAll(text, "\r", "\n")
	text = strings.TrimSpace(text)

	name, pan := extractInvestor(text)
	if name == "" {
		// Try to extract from lines like: CHOUDHURY ALAM\n...\nPAN: EHPPA8712P
		lines := strings.Split(text, "\n")
		for i, l := range lines {
			l = strings.TrimSpace(l)
			if l != "" && pan == "" && strings.Contains(lines[i], "PAN:") {
				pan = strings.TrimSpace(strings.TrimPrefix(lines[i], "PAN:"))
				if i > 0 {
					name = strings.TrimSpace(lines[i-1])
				}
			}
		}
	}

	// Portfolio summary fallback: look for NAVI MF ...
	portfolio, mfValue := 0.0, 0.0
	reSummary := regexp.MustCompile(`(?m)^\s*([A-Z ]+MF)\s+([\d,.]+)\s+([\d,.]+)$`)
	matches := reSummary.FindStringSubmatch(text)
	if len(matches) == 4 {
		// e.g. NAVI MF 10.00 13.06
		mfValue = parseFloat(matches[2])
		portfolio = parseFloat(matches[3])
	}
	if portfolio == 0 {
		portfolio = extractFloatAfter(text, "Total Portfolio Value", 2)
	}
	if mfValue == 0 {
		mfValue = extractFloatAfter(text, "Mutual Funds", 2)
	}

	currentCost := extractFloatAfter(text, "MF Current Cost", 2)
	unrealised := extractFloatAfter(text, "MF Unrealised", 2)
	realised := extractFloatAfter(text, "MF Realised", 2)
	absReturn := extractFloatAfter(text, "Abs. Return (MFs)", 1)
	if absReturn == 0 {
		absReturn = extractFloatAfter(text, "Abs.\nReturn (MFs)", 1)
	}
	xirr := extractFloatAfter(text, "XIRR Return (MFs)", 1)
	if xirr == 0 {
		xirr = extractFloatAfter(text, "XIRR\nReturn (MFs)", 1)
	}
	changeDay := extractFloatAfter(text, "MF Change in a Day", 2)
	if changeDay == 0 {
		changeDay = extractFloatAfter(text, "MF Change\nin a Day", 2)
	}
	activities := extractRecentActivities(text)
	debtRatings := extractDebtFundRatings(text)

	return &ParsedReport{
		InvestorName:     name,
		PAN:              pan,
		TotalPortfolio:   portfolio,
		MutualFundsValue: mfValue,
		CurrentCost:      currentCost,
		UnrealisedGain:   unrealised,
		RealisedGain:     realised,
		AbsReturn:        absReturn,
		XIRR:             xirr,
		ChangeInADay:     changeDay,
		RecentActivities: activities,
		DebtFundRatings:  debtRatings,
	}, nil
}

func extractInvestor(text string) (string, string) {
	re := regexp.MustCompile(`(?m)^\s*(.+) \[(\w{10})\]$`)
	matches := re.FindStringSubmatch(text)
	if len(matches) == 3 {
		return strings.TrimSpace(matches[1]), matches[2]
	}
	// Try to find on a single line (sometimes PDF text is not split)
	re2 := regexp.MustCompile(`(.+) \[(\w{10})\]`)
	matches2 := re2.FindStringSubmatch(text)
	if len(matches2) == 3 {
		return strings.TrimSpace(matches2[1]), matches2[2]
	}
	return "", ""
}

func extractFloatAfter(text, key string, linesDown int) float64 {
	lines := strings.Split(text, "\n")
	for i, l := range lines {
		l = strings.TrimSpace(l)
		if strings.Contains(l, key) {
			idx := i + linesDown
			if idx < len(lines) {
				return parseFloat(strings.TrimSpace(lines[idx]))
			}
		}
	}
	return 0
}

func parseFloat(s string) float64 {
	s = strings.ReplaceAll(s, ",", "")
	s = strings.TrimSpace(s)
	fields := strings.Fields(s)
	if len(fields) == 0 {
		return 0
	}
	f, _ := strconv.ParseFloat(fields[0], 64)
	return f
}

func extractRecentActivities(text string) []RecentActivity {
	// Find the table header
	start := strings.Index(text, "Scheme\tFolio No\tTran Date\tTran Type\tNAV\tUnits\tAmount")
	if start == -1 {
		return nil
	}
	rows := strings.Split(text[start:], "\n")
	var activities []RecentActivity
	for _, row := range rows[1:] {
		row = strings.TrimSpace(row)
		if row == "" {
			continue
		}
		cols := strings.Split(row, "\t")
		if len(cols) < 7 {
			continue
		}
		activities = append(activities, RecentActivity{
			Scheme:   cols[0],
			FolioNo:  cols[1],
			TranDate: cols[2],
			TranType: cols[3],
			NAV:      parseFloat(cols[4]),
			Units:    parseFloat(cols[5]),
			Amount:   parseFloat(cols[6]),
		})
	}
	return activities
}

func extractDebtFundRatings(text string) map[string]float64 {
	ratings := map[string]float64{}
	labels := []string{"Low", "Low to Moderate", "Moderate", "Moderately High", "High", "Very High"}
	for _, label := range labels {
		val := extractFloatAfter(text, label, 1)
		ratings[label] = val
	}
	return ratings
}
