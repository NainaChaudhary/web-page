const fs = require('fs').promises;
const exists = require('fs').exists;
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

  // ✅ ensure folders exist
  await fs.mkdir(tempDir, { recursive: true });
  await fs.mkdir(feedbackDir, { recursive: true });

  const tempFilePath = path.join(tempDir, adjTitle + '.txt');
  const finalFilePath = path.join(feedbackDir, adjTitle + '.txt');

  await fs.writeFile(tempFilePath, content);

  exists(finalFilePath, async (exists) => {
    if (exists) {
      res.redirect('/exists');
    } else {
      await fs.rename(tempFilePath, finalFilePath);
      res.redirect('/');
    }
  });
});

app.listen(80);
