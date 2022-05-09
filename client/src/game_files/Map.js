import Player from "./player";
import Foreign from "./foreign";
import {io} from 'socket.io-client';

const url = process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://micky-game-socket.herokuapp.com/";

const socket = io(url);

class Map {

    constructor (config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = new Image();
        this.image.onload = () => {
            this.isLoaded = true;
        }
        this.image.src = require('../assets/background.png');
        this.player = new Player({
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

            socket.emit('get-players');
            
            if (this.players.length > 0) { // going through playerlist and adding them to renderlist
                this.players.forEach(player => {
                    if (this.renderList.filter(item => item.id === player.id).length === 0) { // if instance isnt already in the renderlist
                        const newForeign = new Foreign({
                            id: player.id,
                            position: {
                                x: player.x,
                                y: player.y,
                                animation: player.animation,
                                facing: player.facing
                            }
                        });
                        this.renderList.push(newForeign);
                    } else { //if it already exists in there
                        const element = this.renderList.filter(item => item.id === player.id)[0];
                        element.updateInputs(player.inputs);
                        element.updatePosition({
                            x: player.x,
                            y: player.y,
                            animation: player.animation,
                            facing: player.facing,
                        });
                    }
                });
            }
            // check if renderlist has an entity that isn't in playerlist
            let oneToRemove = false;
            this.renderList.forEach(item=>{
                if (!this.players.filter(player => player.id === item.id).length > 0) {
                    if(item.id !== undefined) {
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
        this.startGameLoop();
    }
}

export default Map;
