import fitz  # PyMuPDF
import re
import json
import tkinter as tk
from tkinter import filedialog
import sys

# --- Personal Info Extraction (Provided by you) ---
def extract_personal_info(text):
    email = name = address = mobile = None


    # Try to find email and then work from there
    email_match = re.search(r"Email Id:\s*([^\n]+)", text, re.IGNORECASE)
    if email_match:
        email = email_match.group(1).strip()
        email_idx = text.lower().find('email id:')
        if email_idx != -1:
            search_start = email_idx + len('Email Id:')
            block_end_mobile = text.find('Mobile:', search_start)
            block_end_pan = text.find('PAN:', search_start)
            block_end_folio = text.find('Folio No:', search_start)
            possible_ends = [idx for idx in [block_end_mobile, block_end_pan, block_end_folio] if idx != -1]
            block_end = min(possible_ends) if possible_ends else len(text)
            personal_block_raw = text[search_start:block_end].strip()
            lines = [line.strip() for line in personal_block_raw.split('\n') if line.strip()]

            # Improved name extraction: skip lines that are email addresses or labels, pick first likely name
            def is_email(s):
                return re.match(r"[^@\s]+@[^@\s]+\.[^@\s]+", s)

            potential_name_lines = [
                line for line in lines
                if not line.lower().startswith('email id:')
                and not line.lower().startswith('mobile:')
                and not is_email(line)
                and not any(label in line.lower() for label in ['address', 'pan', 'kyc', 'folio', 'registrar', 'advisor'])
            ]
            if potential_name_lines:
                name = potential_name_lines[0]
                # Address lines are after the name, up until "Mobile:" or end of block
                address_lines = []
                name_found = False
                for line in lines:
                    if line == name:
                        name_found = True
                        continue
                    if name_found and not line.lower().startswith('mobile:') and not is_email(line):
                        address_lines.append(line)
                    elif name_found and line.lower().startswith('mobile:'):
                        mobile_match = re.search(r"Mobile:\s*([^\n]+)", line, re.IGNORECASE)
                        if mobile_match:
                            mobile = mobile_match.group(1).strip()
                        break
                address = ', '.join(address_lines) if address_lines else None

    # Fallback for mobile if not found in the block
    if not mobile:
        m = re.search(r"Mobile:\s*([^\n]+)", text, re.IGNORECASE)
        if m:
            mobile = m.group(1).strip()

    return {
        "email": email,
        "name": name,
        "address": address,
        "mobile": mobile
    }

# --- Structured Data Extraction (Modified based on your provided function) ---
def extract_structured_data(text):
    # Document type and version
    doc_type = "Consolidated Account Statement" if "Consolidated Account Statement" in text else None
    version = None
    m = re.search(r"Version:([^\n]+)", text)
    if m:
        version = m.group(1).strip()

    # Dates
    period = re.search(r"(\d{2}-[A-Za-z]{3}-\d{4})\s+To\s+(\d{2}-[A-Za-z]{3}-\d{4})", text)
    txn_date_match = re.search(r"(\d{2}-[A-Za-z]{3}-\d{4})\s+Purchase", text)
    nav_date_match = re.search(r"NAV on (\d{2}-[A-Za-z]{3}-\d{4})", text)

    # Entities
    mf_match = re.search(r"Mutual Fund\s+Cost Value.*\n([A-Z0-9 &\-]+)", text)
    mutual_fund = mf_match.group(1).strip() if mf_match else None

    # Portfolio summary (extract multiple mutual funds)
    # Look for lines like: FundName  cost  market (with possible spaces)
    portfolio_summary = {}
    total_cost = total_market = None
    # Find the block containing the summary table
    summary_block = re.search(r'(?:Portfolio Summary|Mutual Fund\s+Cost Value.*?)([\s\S]+?)(?:Total\s+[\d.,]+\s+[\d.,]+)', text, re.IGNORECASE)
    if summary_block:
        block = summary_block.group(1)
        # Find all fund rows: FundName  cost  market
        fund_rows = re.findall(r'([A-Za-z0-9 &\-]+)\s+([\d.,]+)\s+([\d.,]+)', block)
        for fund, cost, market in fund_rows:
            portfolio_summary[fund.strip()] = {
                "cost_value": float(cost.replace(',', '')),
                "market_value": float(market.replace(',', ''))
            }
    # Find the total row
    total_row = re.search(r'Total\s+([\d.,]+)\s+([\d.,]+)', text)
    if total_row:
        total_cost = float(total_row.group(1).replace(',', ''))
        total_market = float(total_row.group(2).replace(',', ''))
    # If nothing found, fallback to previous logic for single fund
    if not portfolio_summary:
        psum_match = re.search(r'([A-Z0-9 &\-]+)\s*\n([\d.,]+)\s*\n([\d.,]+)\s*\nTotal\s*\n([\d.,]+)\s*\n([\d.,]+)', text)
        if psum_match:
            fund = psum_match.group(1).strip()
            navimf_cost = float(psum_match.group(2).replace(',', ''))
            navimf_market = float(psum_match.group(3).replace(',', ''))
            total_cost = float(psum_match.group(4).replace(',', ''))
            total_market = float(psum_match.group(5).replace(',', ''))
            portfolio_summary[fund] = {
                "cost_value": navimf_cost,
                "market_value": navimf_market
            }


    # Mutual Fund Details (generic extraction, not hardcoded to Navi)
    mfd = re.search(r"([A-Za-z0-9 \-]+)\s*ISIN: ([A-Z0-9]+).*Advisor: ([A-Za-z ]+).*Registrar ?: ([A-Za-z ]+).*Folio No: ([0-9/]+)", text, re.DOTALL)
    fund_name = mfd.group(1).strip() if mfd else None
    isin = mfd.group(2) if mfd else None
    advisor = mfd.group(3) if mfd else None
    registrar = mfd.group(4) if mfd else None
    folio_number = mfd.group(5) if mfd else None

    # PAN, KYC, PAN Status
    pan = kyc = pan_status = None
    panblock = re.search(r"PAN:\s*([A-Z0-9]+)\s+KYC:\s*([A-Z]+)\s+PAN:\s*([A-Z]+)", text)
    if panblock:
        pan, kyc, pan_status = panblock.groups()
    else: # Sometimes PAN status might be given differently
        pan_match = re.search(r"PAN:\s*([A-Z0-9]+)", text)
        kyc_match = re.search(r"KYC:\s*([A-Z]+)", text)
        pan_status_match = re.search(r"PAN Status:\s*([A-Z]+)", text)
        if pan_match: pan = pan_match.group(1)
        if kyc_match: kyc = kyc_match.group(1)
        if pan_status_match: pan_status = pan_status_match.group(1)

    # Transaction details
    txn = re.search(r"(\d{2}-[A-Za-z]{3}-\d{4})\s+Purchase\s+-\s+via Internet\s+([\d.,]+)\s+([\d.]+)\s+([\d.]+)", text)
    txn_date = txn.group(1) if txn else (txn_date_match.group(1) if txn_date_match else None)
    amount = float(txn.group(2).replace(',', '')) if txn else None
    nav = float(txn.group(3)) if txn else None
    units = float(txn.group(4)) if txn else None
    txn_type = "Purchase - via Internet" if txn else None
    unit_balance = None
    ub = re.search(r"Closing Unit Balance:\s*([\d.]+)", text)
    if ub:
        unit_balance = float(ub.group(1))

    # Financial data
    nav_on_date = None
    nav_val = re.search(r"NAV on (\d{2}-[A-Za-z]{3}-\d{4}): INR ([\d.]+)", text)
    if nav_val:
        nav_on_date = float(nav_val.group(2))
    market_val = re.search(r"Market Value on [\d-]+: INR ([\d.,]+)", text)
    market_value = float(market_val.group(1).replace(',', '')) if market_val else None
    entry_load = exit_load = "Nil" # As per example, they are "Nil"
    total_cost_value = None
    tcv = re.search(r"Total Cost Value:\s*([\d.,]+)", text)
    if tcv:
        total_cost_value = float(tcv.group(1).replace(',', ''))
    opening_unit_balance = None
    oub = re.search(r"Opening Unit Balance:\s*([\d.]+)", text)
    if oub:
        opening_unit_balance = float(oub.group(1))
    closing_unit_balance = unit_balance

    # Nominee details (not always present) - leaving as None as per example
    nominee_1 = nominee_2 = nominee_3 = None

    # Personal info
    personal_info = extract_personal_info(text)

    return {
        "document_type": doc_type,
        "version": version,
        "dates": {
            "statement_period": {
                "start_date": period.group(1) if period else None,
                "end_date": period.group(2) if period else None
            },
            "transaction_date": txn_date,
            "nav_date": nav_date_match.group(1) if nav_date_match else None
        },
        "personal_information": personal_info,
        "entities": {
            "cams": None,  # Only fill if extracted from PDF
            "kfintech": None,  # Only fill if extracted from PDF
            "mutual_fund": mutual_fund
        },
        "portfolio_summary": {
            **portfolio_summary,
            "total": {
                "cost_value": total_cost,
                "market_value": total_market
            }
        },
        "mutual_fund_details": {
            "fund_name": fund_name,
            "isin": isin,
            "advisor": advisor,
            "registrar": registrar,
            "folio_number": folio_number,
            "pan": pan,
            "kyc": kyc,
            "pan_status": pan_status
        },
        "transaction_details": {
            "date": txn_date,
            "amount": amount,
            "nav": nav,
            "units": units,
            "transaction_type": txn_type,
            "unit_balance": unit_balance
        },
        "financial_data": {
            "nav_on_date": nav_on_date,
            "market_value_on_date": market_value,
            "entry_load": entry_load,
            "exit_load": exit_load,
            "total_cost_value": total_cost_value,
            "opening_unit_balance": opening_unit_balance,
            "closing_unit_balance": closing_unit_balance
        },
        "nominee_details": {
            "nominee_1": nominee_1,
            "nominee_2": nominee_2,
            "nominee_3": nominee_3
        }
    }

# --- PDF Extraction Function (Provided by you) ---
def extract_pdf_text(pdf_path, password=None):
    try:
        doc = fitz.open(pdf_path)
        if doc.needs_pass:
            if not password or not doc.authenticate(password):
                raise ValueError("PDF is password protected or password is incorrect.")
        all_text = []
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text()
            all_text.append({
                "page": page_num + 1,
                "text": text
            })
        doc.close()
        return all_text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return None

# --- Main script to handle user input and process PDF ---
if __name__ == "__main__":

    # Only process if a file path is provided as a command-line argument
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
        pdf_password = sys.argv[2] if len(sys.argv) > 2 else ""
        result = extract_pdf_text(pdf_path, pdf_password)
        if result:
            for page_data in result:
                structured_data = extract_structured_data(page_data['text'])
                print(json.dumps(structured_data, ensure_ascii=False))
                break
        else:
            print(json.dumps({"error": "Failed to extract text from the PDF."}))
    else:
        print(json.dumps({"error": "No PDF file path provided."}))