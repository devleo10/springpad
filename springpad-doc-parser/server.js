const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const morgan = require('morgan');
const Joi = require('joi');
// Parse URL-encoded form fields (for password)
app.use(express.urlencoded({ extended: true }));
// Security headers
app.use(helmet());
// Logging middleware for requests
app.use(morgan('combined'));
// Rate limiting: 20 requests per minute per IP
app.use(rateLimit({ windowMs: 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false }));
// Accept single file under field name 'pdf' with type and size validation
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF files are allowed'));
    }
    cb(null, true);
  }
});



/**
 * @api {post} /upload Upload a CAMS/KFintech PDF and get parsed portfolio data
 * @apiDescription Accepts a PDF file and optional password, returns parsed mutual fund/portfolio data as JSON.
 * @apiParam {File} pdf The PDF file (multipart/form-data, field name: pdf, type: application/pdf, max 5MB)
 * @apiParam {String} [password] Optional password for password-protected PDFs (form field)
 * @apiSuccess {Object} data Parsed portfolio data
 * @apiSuccess {Number} durationMs Time taken to process the request (ms)
 * @apiError {String} error Error message
 * @apiError {String} [raw] Raw output from the parser (only on parse errors)
 * @apiExample {curl} Example usage:
 *     curl -F "pdf=@/path/to/statement.pdf" -F "password=123456" http://localhost:3001/upload
 */
app.post('/upload', (req, res) => {
  const startTime = Date.now();
  upload.single('pdf')(req, res, err => {
    if (err) {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err.message);
        return res.status(400).json({ success: false, error: err.message });
      }
      console.error('File upload error:', err);
      return res.status(500).json({ success: false, error: 'File upload error.' });
    }
    // Input validation
    const schema = Joi.object({
      password: Joi.string().allow('').max(128),
    });
    const { error: validationError } = schema.validate(req.body);
    if (validationError) {
      console.warn('Validation error:', validationError.details[0].message);
      return res.status(400).json({ success: false, error: validationError.details[0].message });
    }
    if (!req.file) {
      console.warn('No file uploaded');
      return res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
    }
    const pdfPath = req.file.path;
    const password = req.body.password || '';
    const pythonScript = path.join(__dirname, '../springpad-doc-parser/pdf_loader_with_password.py');
    // Spawn Python script with password arg
    const python = spawn('python', [pythonScript, pdfPath, password]);

    let data = '';
    python.stdout.on('data', chunk => { data += chunk; });
    python.stderr.on('data', err => { console.error('Python stderr:', err.toString()); });

    python.on('close', () => {
      fs.unlink(pdfPath, err => {
        if (err) console.error('File cleanup error:', err);
      });
      console.log('PYTHON OUTPUT:', data); // Log the raw output for debugging
      try {
        let parsed = JSON.parse(data);
        // Sanitize output: remove any fields that could leak sensitive info (e.g., internal errors, stack traces)
        if (parsed && typeof parsed === 'object') {
          delete parsed.stack;
          delete parsed.internalError;
        }
        const duration = Date.now() - startTime;
        console.log(`Request processed in ${duration}ms`);
        res.json({ success: true, data: parsed, durationMs: duration });
      } catch (e) {
        console.error('JSON parse error:', e);
        // Only include raw output in development, not in production
        const isDev = process.env.NODE_ENV !== 'production';
        res.status(500).json({ success: false, error: 'Failed to parse PDF output.', raw: isDev ? data : undefined });
      }
    });
  }); // end upload.single callback
}); // end app.post callback



app.listen(3001, () => console.log('Server running on port 3001'));