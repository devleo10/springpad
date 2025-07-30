// TypeScript interfaces matching the Go structs for mutual fund data

export interface Investor {
  name: string;
  pan: string;
}

export interface MutualFundSummary {
  total_value: number;
  current_cost: number;
  unrealised_gain: number;
  realised_gain: number;
  absolute_return: number;
  xirr: number;
  change_in_a_day: number;
}

export interface Transaction {
  scheme: string;
  folio_no: string;
  tran_date: string;
  tran_type: string;
  nav: number;
  units: number;
  amount: number;
}

export interface AssetAllocation {
  category: string;
  percent: number;
}

export interface MutualFundData {
  investor: Investor;
  summary: MutualFundSummary;
  transactions: Transaction[];
  asset_allocation: AssetAllocation[];
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  filename?: string;
  originalName?: string;
  data?: T;
  error?: string;
  details?: string;
  textLength?: number;
}

export interface MutualFundParseResponse extends ApiResponse<MutualFundData> {}

export interface DataExtractionResponse extends ApiResponse<any> {
  dataType?: string;
}

// Validation utility types
export type TransactionType =
  | "Purchase"
  | "Redemption"
  | "Switch In"
  | "Switch Out"
  | "Dividend"
  | "Bonus"
  | "SIP"
  | "STP"
  | "SWP";

export type AssetCategory =
  | "Equity"
  | "Debt"
  | "Hybrid"
  | "Gold"
  | "International"
  | "Sectoral"
  | "Thematic"
  | "Index"
  | "ELSS"
  | "Liquid"
  | "Ultra Short"
  | "Short Term"
  | "Medium Term"
  | "Long Term";

// Error types
export interface ParseError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ParseError[];
  warnings: ParseError[];
}
