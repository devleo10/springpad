from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
import fitz  # PyMuPDF
import json
import os

load_dotenv()


def load_password_protected_pdf(pdf_path, password=None):
    try:
        doc = fitz.open(pdf_path)

        if doc.needs_pass:
            if password is None:
                raise ValueError(
                    "PDF is password protected. Please provide a password.")

            # Authenticate with password
            if not doc.authenticate(password):
                raise ValueError("Invalid password provided.")

        # Extract text from all pages
        full_text = ""
        pages_data = []

        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_text = page.get_text()
            full_text += page_text
            pages_data.append({
                "page_number": page_num + 1,
                "text": page_text,
                "char_count": len(page_text)
            })

        doc.close()
        return full_text, pages_data

    except Exception as e:
        print(f"Error loading PDF: {str(e)}")
        return None, None


def format_data_to_json(text_content, model, custom_instructions=""):

    base_instructions = """
    Please analyze the following text and extract structured information in JSON format.
    
    Text: {text}
    
    Please format the extracted information as a well-structured JSON object. 
    Include relevant fields like:
    - document_type
    - key_information
    - dates
    - amounts
    - entities
    - any other relevant structured data you can identify
    """

    if custom_instructions:
        base_instructions += f"\n\nAdditional instructions: {custom_instructions}"

    base_instructions += "\n\nReturn only valid JSON format."

    prompt = PromptTemplate(
        template=base_instructions,
        input_variables=['text']
    )

    try:
        # Create the prompt
        formatted_prompt = prompt.format(text=text_content)

        # Get response from LLM
        response = model.invoke(formatted_prompt)

        return response.content
    except Exception as e:
        print(f"Error formatting data: {str(e)}")
        return None


# Configuration
PDF_PATH = 'A:/Documents/springpad/springpad-doc-parser/1.pdf'
# Replace with your actual password or set to None
PDF_PASSWORD = "123456"

# Custom instructions for JSON formatting (optional)
CUSTOM_INSTRUCTIONS = """
Focus on extracting:
- Financial data (amounts, percentages, rates)
- Dates and time periods
- Personal/company information
- Account numbers or IDs
- Any structured tables or lists
"""

# Main execution
if __name__ == "__main__":
    # Initialize the LLM model
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

    print("Loading password-protected PDF...")

    # Load the PDF
    text_content, pages_data = load_password_protected_pdf(
        PDF_PATH, PDF_PASSWORD)

    if text_content:
        print("PDF loaded successfully!")
        print(f"Total pages: {len(pages_data)}")
        print(f"Total text length: {len(text_content)} characters")

        # Show page-wise summary
        print("\nPage-wise summary:")
        for page_data in pages_data:
            print(
                f"Page {page_data['page_number']}: {page_data['char_count']} characters")

        # Format data to JSON using LLM
        print("\nFormatting data to JSON using LLM...")
        json_result = format_data_to_json(
            text_content, model, CUSTOM_INSTRUCTIONS)

        if json_result:
            print("\nFormatted JSON Result:")
            print(json_result)

            # Save to file
            output_file = 'formatted_data.json'
            try:
                # Try to parse and pretty-print the JSON
                parsed_json = json.loads(json_result)
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(parsed_json, f, indent=2, ensure_ascii=False)
                print(f"\nJSON data saved to: {output_file}")
            except json.JSONDecodeError:
                # If it's not valid JSON, save as text
                with open('formatted_data.txt', 'w', encoding='utf-8') as f:
                    f.write(json_result)
                print(
                    f"\nResponse saved to: formatted_data.txt (Note: May not be valid JSON)")

            # Also save raw text for reference
            with open('extracted_text.txt', 'w', encoding='utf-8') as f:
                f.write(text_content)
            print("Raw extracted text saved to: extracted_text.txt")

        else:
            print("Failed to format data to JSON")
    else:
        print("Failed to load PDF")
