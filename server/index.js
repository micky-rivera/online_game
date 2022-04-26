const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/', async (req, res) => {
  const client = path.join(__dirname, '..', 'client');
  const public = path.join(__dirname, '..', 'client', 'public');
  app.use(express.static(client));
  app.use(express.static(public));
  res.sendFile(path.join(__dirname, '..', 'client', 'public' , 'index.html'));
});

module.exports.app = app;
app.listen(process.env.PORT || 8080);