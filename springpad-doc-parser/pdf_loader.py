from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
import fitz  # PyMuPDF
import json
import os

load_dotenv()


def load_password_protected_pdf(pdf_path, password=None):
    """
    Load a PDF file (with or without password) and extract text content
    """
    try:
        # Open the PDF
        doc = fitz.open(pdf_path)

        # If the PDF is encrypted and password is provided
        if doc.needs_pass:
            if password is None:
                raise ValueError(
                    "PDF is password protected. Please provide a password.")

            # Authenticate with password
            if not doc.authenticate(password):
                raise ValueError("Invalid password provided.")

        # Extract text from all pages
        full_text = ""
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            full_text += page.get_text()

        doc.close()
        return full_text

    except Exception as e:
        print(f"Error loading PDF: {str(e)}")
        return None


def format_data_to_json(text_content, model):
    """
    Use LLM to format extracted text data into structured JSON
    """
    prompt = PromptTemplate(
        template="""
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
        
        Return only valid JSON format.
        """,
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


# Main execution
if __name__ == "__main__":
    # Initialize the LLM model
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

    # PDF file path
    pdf_path = 'a:/Documents/springpad/1.pdf'

    # Ask for password if needed (you can also set this directly)
    password = input(
        "Enter PDF password (press Enter if no password): ").strip()
    if not password:
        password = None

    # Load the PDF
    print("Loading PDF...")
    text_content = load_password_protected_pdf(pdf_path, password)

    if text_content:
        print("PDF loaded successfully!")
        print(f"Extracted text length: {len(text_content)} characters")

        # Format data to JSON using LLM
        print("\nFormatting data to JSON using LLM...")
        json_result = format_data_to_json(text_content, model)

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
        else:
            print("Failed to format data to JSON")
    else:
        print("Failed to load PDF")
