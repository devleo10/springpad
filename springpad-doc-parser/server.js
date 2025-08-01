const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

let lastJson = null;

app.post('/upload', upload.single('pdf'), (req, res) => {
  const pdfPath = req.file.path;
  const pythonScript = path.join(__dirname, '../springpad-doc-parser/pdf_loader_with_password.py');
  const python = spawn('python', [pythonScript, pdfPath]);

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
});

app.get('/data', (req, res) => {
  if (lastJson) {
    res.json(lastJson);
  } else {
    res.status(404).json({ error: 'No data available.' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));