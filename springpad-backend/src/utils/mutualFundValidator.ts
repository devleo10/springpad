import {
  MutualFundData,
  Transaction,
  AssetAllocation,
  ValidationResult,
  ParseError,
} from "../types/mutualFund";

export class MutualFundValidator {
  /**
   * Validate parsed mutual fund data
   * @param data - Raw parsed data
   * @returns ValidationResult with errors and warnings
   */
  static validate(data: any): ValidationResult {
    const errors: ParseError[] = [];
    const warnings: ParseError[] = [];

    // Validate investor data
    if (!data.investor) {
      errors.push({
        field: "investor",
        message: "Investor information is required",
      });
    } else {
      if (!data.investor.name || data.investor.name.trim() === "") {
        warnings.push({
          field: "investor.name",
          message: "Investor name is empty",
        });
      }
      if (!data.investor.pan || !this.isValidPAN(data.investor.pan)) {
        warnings.push({
          field: "investor.pan",
          message: "Invalid or missing PAN number",
        });
      }
    }

    // Validate summary data
    if (!data.summary) {
      errors.push({
        field: "summary",
        message: "Summary information is required",
      });
    } else {
      const summaryFields = [
        "total_value",
        "current_cost",
        "unrealised_gain",
        "realised_gain",
        "absolute_return",
        "xirr",
        "change_in_a_day",
      ];
      summaryFields.forEach((field) => {
        if (typeof data.summary[field] !== "number") {
          warnings.push({
            field: `summary.${field}`,
            message: `${field} should be a number`,
            value: data.summary[field],
          });
        }
      });
    }

    // Validate transactions
    if (!Array.isArray(data.transactions)) {
      warnings.push({
        field: "transactions",
        message: "Transactions should be an array",
      });
    } else {
      data.transactions.forEach((txn: any, index: number) => {
        if (!txn.scheme) {
          warnings.push({
            field: `transactions[${index}].scheme`,
            message: "Transaction scheme is missing",
          });
        }
        if (!txn.tran_date || !this.isValidDate(txn.tran_date)) {
          warnings.push({
            field: `transactions[${index}].tran_date`,
            message: "Invalid transaction date format (should be YYYY-MM-DD)",
          });
        }
        if (typeof txn.nav !== "number" || txn.nav <= 0) {
          warnings.push({
            field: `transactions[${index}].nav`,
            message: "NAV should be a positive number",
          });
        }
        if (typeof txn.amount !== "number") {
          warnings.push({
            field: `transactions[${index}].amount`,
            message: "Amount should be a number",
          });
        }
      });
    }

    // Validate asset allocation
    if (!Array.isArray(data.asset_allocation)) {
      warnings.push({
        field: "asset_allocation",
        message: "Asset allocation should be an array",
      });
    } else {
      let totalPercent = 0;
      data.asset_allocation.forEach((allocation: any, index: number) => {
        if (!allocation.category) {
          warnings.push({
            field: `asset_allocation[${index}].category`,
            message: "Asset category is missing",
          });
        }
        if (typeof allocation.percent !== "number") {
          warnings.push({
            field: `asset_allocation[${index}].percent`,
            message: "Percentage should be a number",
          });
        } else {
          totalPercent += allocation.percent;
        }
      });

      if (Math.abs(totalPercent - 100) > 1) {
        // Allow 1% tolerance
        warnings.push({
          field: "asset_allocation",
          message: `Total allocation percentage is ${totalPercent}%, should be close to 100%`,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Clean and format mutual fund data
   * @param rawData - Raw data from AI parsing
   * @returns Formatted MutualFundData
   */
  static format(rawData: any): MutualFundData {
    return {
      investor: {
        name: String(rawData.investor?.name || "").trim(),
        pan: String(rawData.investor?.pan || "")
          .trim()
          .toUpperCase(),
      },
      summary: {
        total_value: this.parseNumber(rawData.summary?.total_value),
        current_cost: this.parseNumber(rawData.summary?.current_cost),
        unrealised_gain: this.parseNumber(rawData.summary?.unrealised_gain),
        realised_gain: this.parseNumber(rawData.summary?.realised_gain),
        absolute_return: this.parseNumber(rawData.summary?.absolute_return),
        xirr: this.parseNumber(rawData.summary?.xirr),
        change_in_a_day: this.parseNumber(rawData.summary?.change_in_a_day),
      },
      transactions: this.formatTransactions(rawData.transactions || []),
      asset_allocation: this.formatAssetAllocation(
        rawData.asset_allocation || []
      ),
    };
  }

  /**
   * Format transactions array
   */
  private static formatTransactions(transactions: any[]): Transaction[] {
    return transactions.map((txn) => ({
      scheme: String(txn.scheme || "").trim(),
      folio_no: String(txn.folio_no || "").trim(),
      tran_date: this.formatDate(txn.tran_date),
      tran_type: String(txn.tran_type || "").trim(),
      nav: this.parseNumber(txn.nav),
      units: this.parseNumber(txn.units),
      amount: this.parseNumber(txn.amount),
    }));
  }

  /**
   * Format asset allocation array
   */
  private static formatAssetAllocation(allocations: any[]): AssetAllocation[] {
    return allocations.map((allocation) => ({
      category: String(allocation.category || "").trim(),
      percent: this.parseNumber(allocation.percent),
    }));
  }

  /**
   * Parse number from various formats
   */
  private static parseNumber(value: any): number {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      // Remove commas, currency symbols, and other non-numeric characters except decimal point
      const cleaned = value.replace(/[,₹$\s]/g, "").replace(/[^\d.-]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  /**
   * Format date to YYYY-MM-DD
   */
  private static formatDate(dateStr: string): string {
    if (!dateStr) return "";

    try {
      // Try to parse various date formats
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // Try DD/MM/YYYY or DD-MM-YYYY format
        const parts = dateStr.split(/[\/\-\.]/);
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          if (day <= 31 && month <= 12 && year > 1900) {
            return `${year}-${month.toString().padStart(2, "0")}-${day
              .toString()
              .padStart(2, "0")}`;
          }
        }
        return dateStr; // Return original if can't parse
      }

      return date.toISOString().split("T")[0]; // YYYY-MM-DD format
    } catch {
      return dateStr;
    }
  }

  /**
   * Validate PAN number format
   */
  private static isValidPAN(pan: string): boolean {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  private static isValidDate(dateStr: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) return false;

    const date = new Date(dateStr);
    return date.toISOString().split("T")[0] === dateStr;
  }
}
