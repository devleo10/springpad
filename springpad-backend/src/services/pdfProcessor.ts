import fs from "fs";
import pdf from "pdf-parse";

export class PDFProcessor {
  /**
   * Extract text content from a PDF file
   * @param filePath - Path to the PDF file
   * @returns Promise<string> - Extracted text content
   */
  async extractText(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);

      // Clean up the extracted text
      const cleanedText = this.cleanText(data.text);

      // Optional: Delete the uploaded file after processing
      this.deleteFile(filePath);

      return cleanedText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      throw new Error("Failed to extract text from PDF");
    }
  }

  private cleanText(text: string): string {
    return text
      .replace(/\n\s*\n/g, "\n") // Remove multiple newlines
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();
  }

  /**
   * Delete uploaded file
   * @param filePath - Path to the file to delete
   */
  private deleteFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  /**
   * Split text into chunks for better processing
   * @param text - Text to split
   * @param maxChunkSize - Maximum size of each chunk
   * @returns string[] - Array of text chunks
   */
  splitTextIntoChunks(text: string, maxChunkSize: number = 4000): string[] {
    const words = text.split(" ");
    const chunks: string[] = [];
    let currentChunk = "";

    for (const word of words) {
      if ((currentChunk + " " + word).length > maxChunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = word;
        } else {
          // If a single word is longer than maxChunkSize, include it anyway
          chunks.push(word);
        }
      } else {
        currentChunk += (currentChunk ? " " : "") + word;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}
