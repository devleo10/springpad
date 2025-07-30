package model

type Investor struct {
	Name string `json:"name"`
	PAN  string `json:"pan"`
}

type MutualFundSummary struct {
	TotalValue     float64 `json:"total_value"`
	CurrentCost    float64 `json:"current_cost"`
	UnrealisedGain float64 `json:"unrealised_gain"`
	RealisedGain   float64 `json:"realised_gain"`
	AbsoluteReturn float64 `json:"absolute_return"`
	XIRR           float64 `json:"xirr"`
	ChangeInADay   float64 `json:"change_in_a_day"`
}

type Transaction struct {
	Scheme   string  `json:"scheme"`
	FolioNo  string  `json:"folio_no"`
	TranDate string  `json:"tran_date"`
	TranType string  `json:"tran_type"`
	NAV      float64 `json:"nav"`
	Units    float64 `json:"units"`
	Amount   float64 `json:"amount"`
}

type AssetAllocation struct {
	Category string  `json:"category"`
	Percent  float64 `json:"percent"`
}
