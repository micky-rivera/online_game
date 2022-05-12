import Player from "./player";
import Foreign from "./foreign";
import {io} from 'socket.io-client';
import { v4 as uuid } from 'uuid';

const url = process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://micky-game-socket.herokuapp.com/";

const socket = io(url);

class Map {

    constructor (config) {
        this.id = uuid();
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = new Image();
        this.image.onload = () => {
            this.isLoaded = true;
        }
        this.image.src = require('../assets/background.png');
        this.player = new Player({
            id: this.id,
            socket: socket,
            position: {
                x: 10,
                y: 4
            }
        });
        this.renderList = [this.player];
        this.players = [];
    }

    startGameLoop() {
        const step = () => {
            new Promise((resolve, reject) => { // frame buffer to control framerate
                setTimeout(()=>{
                    resolve();
                }, 17); // FRAMERATE HERE 34MS FOR 30FPS 17MS FOR 60FPS
            }).then(res => step());

            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

            // check if socket has changed for whatever reason
            if (this.player.socket.id !== socket.id) {
                this.player.socket = socket;
            }

            // draw background
            this.isLoaded && this.ctx.drawImage(
                this.image,
                0, //horizontal cut
                0, //vertical cut (rows)
                352, //size of cut x
                224, //size of cut y, i like ya cut g
                0, //x position
                0, //y position
                352,
                224
            );

            socket.emit('get-players', this.id);
            
            if (this.players.length > 0) { // going through playerlist and adding them to renderlist
                this.players.forEach(player => {
                    if (this.renderList.filter(item => item.id === player.id).length === 0) { // if instance isnt already in the renderlist
                        const newForeign = new Foreign({
                            id: player.id,
                            position: {
                                x: player.x,
                                y: player.y,
                                action: player.action
                            }
                        });
                        this.renderList.push(newForeign);
                    }
                });
            }
            // check if renderlist has an entity that isn't in playerlist
            let oneToRemove = false;
            this.renderList.forEach(item=>{
                if (!this.players.filter(player => player.id === item.id).length > 0) {
                    if(item.id !== this.player.id) {
                        oneToRemove = item;
                    }
                }
            });
            if (oneToRemove) {
                this.renderList = [...this.renderList].filter(item=>item.id !== oneToRemove.id);
            }

            this.renderList.forEach(item => {
                item.draw(this.ctx);
            });
        };
        step();
    }

    init () {
        socket.on('return-players', data => {
            this.players = data;
        });
        socket.on('return-new-action', data => {
            const element = this.renderList.filter(player => player.id === data.id)[0];
            if (element.id !== this.player.id) {
                element.updatePosition(data.action);
            }
        });
        socket.on('disconnect', () => {
            console.log('youve been disconnected');
        })

        socket.on('return-handshake', ()=> {
            this.startGameLoop();
        });
    }
}

export default Map;
