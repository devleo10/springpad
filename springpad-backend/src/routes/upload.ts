import express from "express";
import multer from "multer";
import path from "path";
import { PDFProcessor } from "../services/pdfProcessor";
import { GeminiChatService } from "../services/geminiChatService";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// PDF upload and processing endpoint
router.post("/pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const pdfProcessor = new PDFProcessor();
    const extractedText = await pdfProcessor.extractText(req.file.path);

    // Optional: Get query from request body for specific questions about the PDF
    const query =
      req.body.query || "Summarize the main points of this document";

    const geminiService = new GeminiChatService();
    const response = await geminiService.chatWithPDF(extractedText, query);

    res.json({
      success: true,
      filename: req.file.filename,
      extractedText: extractedText.substring(0, 1000) + "...", // First 1000 chars for preview
      geminiResponse: response,
      query: query,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({
      error: "Failed to process PDF",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Chat with already processed PDF
router.post("/chat", async (req, res) => {
  try {
    const { pdfContent, query } = req.body;

    if (!pdfContent || !query) {
      return res.status(400).json({
        error: "Both pdfContent and query are required",
      });
    }

    const geminiService = new GeminiChatService();
    const response = await geminiService.chatWithPDF(pdfContent, query);

    res.json({
      success: true,
      response: response,
      query: query,
    });
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({
      error: "Failed to process chat",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Parse mutual fund statement
router.post("/mutual-fund/parse", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const pdfProcessor = new PDFProcessor();
    const extractedText = await pdfProcessor.extractText(req.file.path);

    const geminiService = new GeminiChatService();
    const structuredData = await geminiService.parseMutualFundStatement(
      extractedText
    );
    const validatedData = geminiService.validateMutualFundData(structuredData);

    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      data: validatedData,
      textLength: extractedText.length,
    });
  } catch (error) {
    console.error("Error parsing mutual fund statement:", error);
    res.status(500).json({
      error: "Failed to parse mutual fund statement",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Extract specific mutual fund data
router.post(
  "/mutual-fund/extract/:dataType",
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No PDF file uploaded" });
      }

      const dataType = req.params.dataType;
      const validTypes = ["investor", "summary", "transactions", "allocation"];

      if (!validTypes.includes(dataType)) {
        return res.status(400).json({
          error: "Invalid data type",
          validTypes: validTypes,
        });
      }

      const pdfProcessor = new PDFProcessor();
      const extractedText = await pdfProcessor.extractText(req.file.path);

      const geminiService = new GeminiChatService();
      const extractedData = await geminiService.extractMutualFundData(
        extractedText,
        dataType
      );

      res.json({
        success: true,
        filename: req.file.filename,
        originalName: req.file.originalname,
        dataType: dataType,
        data: extractedData,
        textLength: extractedText.length,
      });
    } catch (error) {
      console.error(`Error extracting ${req.params.dataType}:`, error);
      res.status(500).json({
        error: `Failed to extract ${req.params.dataType}`,
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export default router;
