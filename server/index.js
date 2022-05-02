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

app.get('/allplayers', async (req, res)=>{
    socket.emit('get-players');
    const playerList = new Promise((resolve, reject)=>{
        socket.on('return-players', data=>{
            resolve(data);
        });
    });
    res.json(await playerList);
});

app.get('/', async (req, res) => {
    const root = path.join(__dirname, "..", "client", "build");
    app.use(express.static(root));
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

module.exports.app = app;
app.listen(process.env.PORT || 8080);