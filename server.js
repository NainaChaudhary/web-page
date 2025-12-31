const fs = require('fs').promises;
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, 'pages')));
app.use('/feedback', express.static(path.join(__dirname, 'feedback')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'feedback.html'));
});

app.get('/exists', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'exists.html'));
});

app.post('/create', async (req, res) => {
  try {
    const title = req.body.title.trim();
    const content = req.body.text;

    const adjTitle = title.toLowerCase();
    const feedbackDir = path.join(__dirname, 'feedback');
    const filePath = path.join(feedbackDir, `${adjTitle}.txt`);

    // Ensure feedback directory exists
    await fs.mkdir(feedbackDir, { recursive: true });

    // Check if file already exists
    try {
      await fs.access(filePath);
      return res.redirect('/exists');
    } catch {
      // File does NOT exist → safe to write
      await fs.writeFile(filePath, content);
      return res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
