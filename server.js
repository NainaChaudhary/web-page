const fs = require('fs').promises;
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/feedback', express.static('feedback'));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'feedback.html');
  res.sendFile(filePath);
});

app.get('/exists', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'exists.html');
  res.sendFile(filePath);
});

app.post('/create', async (req, res) => {
  const title = req.body.title;
  const content = req.body.text;

  const adjTitle = title.toLowerCase();

  const tempDir = path.join(__dirname, 'temp');
  const feedbackDir = path.join(__dirname, 'feedback');

  await fs.mkdir(tempDir, { recursive: true });
  await fs.mkdir(feedbackDir, { recursive: true });

  const tempFilePath = path.join(tempDir, adjTitle + '.txt');
  const finalFilePath = path.join(feedbackDir, adjTitle + '.txt');

  await fs.writeFile(tempFilePath, content);

  try {
    await fs.access(finalFilePath);
    return res.redirect('/exists');
  } catch {
    await fs.rename(tempFilePath, finalFilePath);
    return res.redirect('/');
  }
});

// ✅ FIXED PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
