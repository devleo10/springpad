import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MutualFundValidator } from "../utils/mutualFundValidator";
import { MutualFundData } from "../types/mutualFund";

export class GeminiChatService {
  private model: ChatGoogleGenerativeAI;

  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY environment variable is required");
    }

    this.model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "gemini-pro",
    });
  }

  /**
   * Chat with PDF content using Gemini
   * @param pdfContent - Extracted text from PDF
   * @param query - User's question or query
   * @returns Promise<string> - AI response
   */
  async chatWithPDF(pdfContent: string, query: string): Promise<string> {
    try {
      // Create a prompt template for PDF chat
      const promptTemplate = ChatPromptTemplate.fromTemplate(`
        You are an AI assistant that analyzes PDF documents and answers questions about their content.
        
        PDF Content:
        {pdfContent}
        
        User Question: {query}
        
        Instructions:
        - Analyze the PDF content carefully
        - Provide accurate and relevant answers based only on the content provided
        - If the answer cannot be found in the PDF content, clearly state that
        - Be concise but comprehensive in your response
        - Use bullet points or numbered lists when appropriate for better readability
        
        Answer:
      `);

      // Create the chain
      const chain = promptTemplate
        .pipe(this.model)
        .pipe(new StringOutputParser());

      // Execute the chain
      const response = await chain.invoke({
        pdfContent: this.truncateContent(pdfContent),
        query: query,
      });

      return response;
    } catch (error) {
      console.error("Error in Gemini chat:", error);
      throw new Error("Failed to process chat with Gemini");
    }
  }

  /**
   * Summarize PDF content
   * @param pdfContent - Extracted text from PDF
   * @returns Promise<string> - Summary
   */
  async summarizePDF(pdfContent: string): Promise<string> {
    return this.chatWithPDF(
      pdfContent,
      "Please provide a comprehensive summary of this document, highlighting the key points, main topics, and important information."
    );
  }

  /**
   * Extract key insights from PDF
   * @param pdfContent - Extracted text from PDF
   * @returns Promise<string> - Key insights
   */
  async extractKeyInsights(pdfContent: string): Promise<string> {
    return this.chatWithPDF(
      pdfContent,
      "Extract the most important insights, conclusions, and actionable information from this document. Present them as bullet points."
    );
  }

  /**
   * Answer specific questions about PDF content
   * @param pdfContent - Extracted text from PDF
   * @param questions - Array of questions
   * @returns Promise<string[]> - Array of answers
   */
  async answerQuestions(
    pdfContent: string,
    questions: string[]
  ): Promise<string[]> {
    const answers: string[] = [];

    for (const question of questions) {
      try {
        const answer = await this.chatWithPDF(pdfContent, question);
        answers.push(answer);
      } catch (error) {
        console.error(`Error answering question: ${question}`, error);
        answers.push(
          "Sorry, I could not answer this question due to an error."
        );
      }
    }

    return answers;
  }

  /**
   * Truncate content to fit within token limits
   * @param content - Content to truncate
   * @param maxLength - Maximum length (default: 30000 characters)
   * @returns string - Truncated content
   */
  private truncateContent(content: string, maxLength: number = 30000): string {
    if (content.length <= maxLength) {
      return content;
    }

    return (
      content.substring(0, maxLength) +
      "\n\n[Content truncated due to length...]"
    );
  }

  /**
   * Generate a custom analysis of the PDF based on type
   * @param pdfContent - Extracted text from PDF
   * @param analysisType - Type of analysis ('financial', 'legal', 'technical', 'academic', etc.)
   * @returns Promise<string> - Custom analysis
   */
  async customAnalysis(
    pdfContent: string,
    analysisType: string
  ): Promise<string> {
    const analysisPrompts = {
      financial:
        "Analyze this document from a financial perspective. Identify key financial metrics, trends, risks, and opportunities.",
      legal:
        "Analyze this document from a legal perspective. Identify important legal terms, obligations, rights, and potential issues.",
      technical:
        "Analyze this document from a technical perspective. Identify technical specifications, requirements, and implementation details.",
      academic:
        "Analyze this document from an academic perspective. Identify research findings, methodologies, and theoretical contributions.",
      business:
        "Analyze this document from a business perspective. Identify strategic insights, market analysis, and business implications.",
    };

    const prompt =
      analysisPrompts[analysisType as keyof typeof analysisPrompts] ||
      `Analyze this document from a ${analysisType} perspective and provide relevant insights.`;

    return this.chatWithPDF(pdfContent, prompt);
  }

  /**
   * Parse mutual fund statement and extract structured data
   * @param pdfContent - Extracted text from PDF
   * @returns Promise<any> - Structured mutual fund data
   */
  async parseMutualFundStatement(pdfContent: string): Promise<any> {
    try {
      const promptTemplate = ChatPromptTemplate.fromTemplate(`
        You are an expert at parsing mutual fund statements and financial documents. 
        Extract the following information from this mutual fund statement and return it as a valid JSON object.

        PDF Content:
        {pdfContent}

        Please extract and structure the data in the following JSON format:
        {{
          "investor": {{
            "name": "Investor Name",
            "pan": "PAN Number"
          }},
          "summary": {{
            "total_value": 0.0,
            "current_cost": 0.0,
            "unrealised_gain": 0.0,
            "realised_gain": 0.0,
            "absolute_return": 0.0,
            "xirr": 0.0,
            "change_in_a_day": 0.0
          }},
          "transactions": [
            {{
              "scheme": "Scheme Name",
              "folio_no": "Folio Number",
              "tran_date": "YYYY-MM-DD",
              "tran_type": "Purchase/Redemption/Switch/etc",
              "nav": 0.0,
              "units": 0.0,
              "amount": 0.0
            }}
          ],
          "asset_allocation": [
            {{
              "category": "Equity/Debt/Hybrid/etc",
              "percent": 0.0
            }}
          ]
        }}

        Instructions:
        - Extract investor name and PAN number from the header/top section
        - Look for portfolio summary/overview sections for financial totals
        - Extract all transaction details from transaction tables
        - Find asset allocation percentages by category
        - Convert all dates to YYYY-MM-DD format
        - Ensure all numerical values are proper numbers (not strings)
        - If any field is not found, use appropriate default values (0.0 for numbers, empty string for text)
        - Return ONLY the JSON object, no additional text or explanation

        JSON Response:
      `);

      const chain = promptTemplate
        .pipe(this.model)
        .pipe(new StringOutputParser());

      const response = await chain.invoke({
        pdfContent: this.truncateContent(pdfContent),
      });

      // Try to parse the JSON response
      try {
        const parsedData = JSON.parse(response.trim());
        return parsedData;
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        // Return a fallback structure if JSON parsing fails
        return {
          investor: { name: "", pan: "" },
          summary: {
            total_value: 0.0,
            current_cost: 0.0,
            unrealised_gain: 0.0,
            realised_gain: 0.0,
            absolute_return: 0.0,
            xirr: 0.0,
            change_in_a_day: 0.0,
          },
          transactions: [],
          asset_allocation: [],
          raw_response: response, // Include raw response for debugging
        };
      }
    } catch (error) {
      console.error("Error parsing mutual fund statement:", error);
      throw new Error("Failed to parse mutual fund statement");
    }
  }

  /**
   * Extract specific mutual fund data field
   * @param pdfContent - Extracted text from PDF
   * @param dataType - Type of data to extract ('investor', 'summary', 'transactions', 'allocation')
   * @returns Promise<any> - Specific data section
   */
  async extractMutualFundData(
    pdfContent: string,
    dataType: string
  ): Promise<any> {
    const prompts = {
      investor: `Extract investor information (name and PAN) from this mutual fund statement. Return as JSON: {"name": "...", "pan": "..."}`,
      summary: `Extract portfolio summary/totals from this mutual fund statement. Return as JSON with fields: total_value, current_cost, unrealised_gain, realised_gain, absolute_return, xirr, change_in_a_day`,
      transactions: `Extract all transaction details from this mutual fund statement. Return as JSON array with fields: scheme, folio_no, tran_date (YYYY-MM-DD), tran_type, nav, units, amount`,
      allocation: `Extract asset allocation percentages from this mutual fund statement. Return as JSON array with fields: category, percent`,
    };

    const prompt =
      prompts[dataType as keyof typeof prompts] ||
      `Extract ${dataType} information from this mutual fund statement`;

    try {
      const response = await this.chatWithPDF(pdfContent, prompt);
      // Try to parse as JSON if it looks like JSON
      if (response.trim().startsWith("{") || response.trim().startsWith("[")) {
        try {
          return JSON.parse(response.trim());
        } catch {
          return response;
        }
      }
      return response;
    } catch (error) {
      console.error(`Error extracting ${dataType}:`, error);
      throw new Error(`Failed to extract ${dataType} data`);
    }
  }

  /**
   * Validate and format mutual fund data
   * @param rawData - Raw extracted data
   * @returns MutualFundData - Validated and formatted data
   */
  validateMutualFundData(rawData: any): MutualFundData {
    const formatted = MutualFundValidator.format(rawData);
    const validation = MutualFundValidator.validate(formatted);

    // Log validation results
    if (validation.warnings.length > 0) {
      console.warn("Validation warnings:", validation.warnings);
    }
    if (validation.errors.length > 0) {
      console.error("Validation errors:", validation.errors);
    }

    return {
      ...formatted,
      _validation: validation, // Include validation results in response
    } as any;
  }
}
