const express = require('express');
const {io} = require('socket.io-client');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());

let socket = 69;

app.get('/newsocket', (req, res)=>{
    socket = io('http://localhost:8000');
    res.end('all good');
});

app.get('/', async (req, res) => {
  const client = path.join(__dirname, '..', 'client');
  const public = path.join(__dirname, '..', 'client', 'public');
  app.use(express.static(client));
  app.use(express.static(public));
  res.sendFile(path.join(__dirname, '..', 'client', 'public' , 'index.html'));
});

module.exports.app = app;
app.listen(process.env.PORT || 8080);