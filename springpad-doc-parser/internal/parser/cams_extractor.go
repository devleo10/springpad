package parser

// ParsedReport holds all extracted data from the CAMS PDF
// (Add more fields as needed for your dashboard)
type ParsedReport struct {
	InvestorName     string                 `json:"investorName"`
	PAN              string                 `json:"pan"`
	TotalPortfolio   float64                `json:"totalPortfolio"`
	MutualFundsValue float64                `json:"mutualFundsValue"`
	CurrentCost      float64                `json:"currentCost"`
	UnrealisedGain   float64                `json:"unrealisedGain"`
	RealisedGain     float64                `json:"realisedGain"`
	AbsReturn        float64                `json:"absReturn"`
	XIRR             float64                `json:"xirr"`
	ChangeInADay     float64                `json:"changeInADay"`
	RecentActivities []RecentActivity       `json:"recentActivities"`
	DebtFundRatings  map[string]float64     `json:"debtFundRatings"`
}

type RecentActivity struct {
	Scheme   string  `json:"scheme"`
	FolioNo  string  `json:"folioNo"`
	TranDate string  `json:"tranDate"`
	TranType string  `json:"tranType"`
	NAV      float64 `json:"nav"`
	Units    float64 `json:"units"`
	Amount   float64 `json:"amount"`
}

// ParseCAMSReportText is now deprecated in favor of LangChain + Gemini parsing
// This function is kept for backward compatibility but should not be used
// Use LangchainParser.ParsePDFWithGemini() instead
func ParseCAMSReportText(text string) (*ParsedReport, error) {
	// This function is deprecated - use LangChain + Gemini instead
	// For now, return a basic response to maintain compatibility
	return &ParsedReport{
		InvestorName:     "Please use LangChain parser",
		PAN:              "",
		TotalPortfolio:   0,
		MutualFundsValue: 0,
		CurrentCost:      0,
		UnrealisedGain:   0,
		RealisedGain:     0,
		AbsReturn:        0,
		XIRR:             0,
		ChangeInADay:     0,
		RecentActivities: []RecentActivity{},
		DebtFundRatings:  map[string]float64{},
	}, nil
}
