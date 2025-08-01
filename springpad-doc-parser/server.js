const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
// Parse URL-encoded form fields (for password)
app.use(express.urlencoded({ extended: true }));
// Accept single file under field name 'pdf'
const upload = multer({ dest: 'uploads/' });

let lastJson = null;

app.post('/upload', (req, res) => {
  // Handle file upload errors
  upload.single('pdf')(req, res, err => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, error: err.message });
      }
      return res.status(500).json({ success: false, error: 'File upload error.' });
    }
    // Proceed if upload succeeded
    const pdfPath = req.file.path;
    const password = req.body.password || '';
    const pythonScript = path.join(__dirname, '../springpad-doc-parser/pdf_loader_with_password.py');
    // Spawn Python script with password arg
    const python = spawn('python', [pythonScript, pdfPath, password]);

  let data = '';
  python.stdout.on('data', chunk => { data += chunk; });
  python.stderr.on('data', err => { console.error(err.toString()); });

  python.on('close', () => {
    fs.unlinkSync(pdfPath); // Clean up
    console.log('PYTHON OUTPUT:', data); // Log the raw output for debugging
    try {
      lastJson = JSON.parse(data);
      res.json({ success: true, data: lastJson });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to parse PDF output.', raw: data });
    }
  });
  }); // end upload.single callback
}); // end app.post callback

app.get('/data', (req, res) => {
  if (lastJson) {
    res.json(lastJson);
  } else {
    res.status(404).json({ error: 'No data available.' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));