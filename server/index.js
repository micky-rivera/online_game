const express = require('express');
const {io} = require('socket.io-client');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const socket = io('http://localhost:8000');

app.post('/update', (req, res)=>{
    socket.emit('update-position', req.body);
    res.end();
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