import re
import json

def parse_statement(text):
    # Extract document type and version
    doc_type_match = re.search(r'Consolidated Account Statement', text)
    version_match = re.search(r'Version:([^\n]+)', text)
    
    # Extract statement period
    period_match = re.search(r'(\d{2}-[A-Za-z]{3}-\d{4}) To (\d{2}-[A-Za-z]{3}-\d{4})', text)
    
    # Extract personal info with improved regex
    email_match = re.search(r'Email Id:\s*([^\n]+)', text)
    
    # Extract name (first line after email that's not empty)
    name_match = None
    if email_match:
        email_end = email_match.end()
        lines_after_email = text[email_end:].split('\n')
        for line in lines_after_email:
            line = line.strip()
            if line and not line.startswith(('Mobile:', 'This Consolidated')):
                name_match = line
                break
    
    # Extract mobile number
    mobile_match = re.search(r'Mobile:\s*([^\n]+)', text)
    
    # Extract address (lines between name and mobile)
    address_match = None
    if name_match and mobile_match:
        name_pos = text.find(name_match)
        mobile_pos = text.find('Mobile:')
        if name_pos != -1 and mobile_pos != -1 and name_pos < mobile_pos:
            address_section = text[name_pos + len(name_match):mobile_pos]
            address_lines = [line.strip() for line in address_section.split('\n') if line.strip()]
            address_match = ', '.join(address_lines) if address_lines else None
    
    # Extract portfolio summary with improved regex
    portfolio_section = re.search(r'PORTFOLIO SUMMARY\n(.*?)\nTotal\s+([\d,]+\.?\d*)\s+([\d,]+\.?\d*)', text, re.DOTALL)
    portfolio_funds = {}
    total_cost = None
    total_market = None
    
    if portfolio_section:
        # Extract total values
        total_cost = float(portfolio_section.group(2).replace(',', ''))
        total_market = float(portfolio_section.group(3).replace(',', ''))
        
        # Extract individual fund data
        fund_lines = portfolio_section.group(1).strip().split('\n')
        i = 0
        while i < len(fund_lines):
            if fund_lines[i].strip() and not fund_lines[i].strip().replace('.', '').replace(',', '').isdigit():
                fund_name = fund_lines[i].strip()
                if i + 2 < len(fund_lines):
                    try:
                        cost_val = float(fund_lines[i + 1].replace(',', ''))
                        market_val = float(fund_lines[i + 2].replace(',', ''))
                        portfolio_funds[fund_name] = {
                            "cost_value": cost_val,
                            "market_value": market_val
                        }
                        i += 3
                    except ValueError:
                        i += 1
                else:
                    i += 1
            else:
                i += 1
    
    # Extract first transaction details (most recent)
    transaction_match = re.search(r'(\d{2}-[A-Za-z]{3}-\d{4})\s+([\d,]+\.?\d*)\s+([\d.]+)\s+([\d.]+)\s*\n([^\n]+)\s*\n([\d.]+)', text)
    
    # Extract NAV and market value
    nav_mv_match = re.search(r'NAV on (\d{2}-[A-Za-z]{3}-\d{4}):\s*INR\s*([\d.]+)\s*\n.*?Market Value on \d{2}-[A-Za-z]{3}-\d{4}:\s*INR\s*([\d,]+\.?\d*)', text, re.DOTALL)
    
    # Extract mutual fund details - improved to handle the actual format
    mf_details_match = re.search(r'([A-Z0-9-]+)-([^(]+)\([^)]*\)\s*-\s*ISIN:\s*([A-Z0-9]+)\s*\(Advisor:\s*([^)]+)\)', text)
    
    # Extract registrar
    registrar_match = re.search(r'Registrar\s*:\s*([A-Z]+)', text)
    
    # Extract folio number
    folio_match = re.search(r'Folio No:\s*([^\s/]+)', text)
    
    # Extract PAN, KYC, PAN status
    pan_match = re.search(r'PAN:\s*([A-Z0-9]+)\s+KYC:\s*([A-Z]+)\s+PAN:\s*([A-Z]+)', text)
    
    # Extract opening and closing balances
    opening_match = re.search(r'Opening Unit Balance:\s*([\d.]+)', text)
    closing_match = re.search(r'Closing Unit Balance:\s*([\d.]+)', text)
    total_cost_match = re.search(r'Total Cost Value:\s*([\d,]+\.?\d*)', text)
    
    # Extract nominee details
    nominee1_match = re.search(r'Nominee 1:\s*([^\n]*?)(?:\s+Nominee 2:|$)', text)
    nominee2_match = re.search(r'Nominee 2:\s*([^\n]*?)(?:\s+Nominee 3:|$)', text)
    nominee3_match = re.search(r'Nominee 3:\s*([^\n]*?)(?:\n|$)', text)
    
    # Build JSON
    result = {
        "document_type": "Consolidated Account Statement" if doc_type_match else None,
        "version": version_match.group(1).strip() if version_match else None,
        "dates": {
            "statement_period": {
                "start_date": period_match.group(1) if period_match else None,
                "end_date": period_match.group(2) if period_match else None
            },
            "transaction_date": transaction_match.group(1) if transaction_match else None,
            "nav_date": nav_mv_match.group(1) if nav_mv_match else None
        },
        "personal_information": {
            "name": name_match if name_match else None,
            "email": email_match.group(1).strip() if email_match else None,
            "address": address_match if address_match else None,
            "mobile": mobile_match.group(1).strip() if mobile_match else None
        },
        "entities": {
            "cams": "CAMS",
            "kfintech": "KFintech",
            "mutual_fund": list(portfolio_funds.keys())[0] if portfolio_funds else None
        },
        "portfolio_summary": {
            **portfolio_funds,
            "total": {
                "cost_value": total_cost,
                "market_value": total_market
            }
        },
        "mutual_fund_details": {
            "fund_name": mf_details_match.group(2).strip() if mf_details_match else None,
            "isin": mf_details_match.group(3) if mf_details_match else None,
            "advisor": mf_details_match.group(4) if mf_details_match else None,
            "registrar": registrar_match.group(1) if registrar_match else None,
            "folio_number": folio_match.group(1) if folio_match else None,
            "pan": pan_match.group(1) if pan_match else None,
            "kyc": pan_match.group(2) if pan_match else None,
            "pan_status": pan_match.group(3) if pan_match else None
        },
        "transaction_details": {
            "date": transaction_match.group(1) if transaction_match else None,
            "amount": float(transaction_match.group(2).replace(',', '')) if transaction_match else None,
            "nav": float(transaction_match.group(3)) if transaction_match else None,
            "units": float(transaction_match.group(4)) if transaction_match else None,
            "transaction_type": transaction_match.group(5).strip() if transaction_match else None,
            "unit_balance": float(transaction_match.group(6)) if transaction_match else None
        },
        "financial_data": {
            "nav_on_date": float(nav_mv_match.group(2)) if nav_mv_match else None,
            "market_value_on_date": float(nav_mv_match.group(3).replace(',', '')) if nav_mv_match else None,
            "entry_load": "Nil",
            "exit_load": "Nil",  # This should be extracted from the actual text
            "total_cost_value": float(total_cost_match.group(1).replace(',', '')) if total_cost_match else None,
            "opening_unit_balance": float(opening_match.group(1)) if opening_match else None,
            "closing_unit_balance": float(closing_match.group(1)) if closing_match else None
        },
        "nominee_details": {
            "nominee_1": nominee1_match.group(1).strip() if nominee1_match and nominee1_match.group(1).strip() else None,
            "nominee_2": nominee2_match.group(1).strip() if nominee2_match and nominee2_match.group(1).strip() else None,
            "nominee_3": nominee3_match.group(1).strip() if nominee3_match and nominee3_match.group(1).strip() else None
        }
    }
    return result


