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
        this.player = new Player({
            socket: socket,
            position: {
                x: 100,
                y: 50,
            }
        });
        this.renderList = [this.player];
        this.players = [];
    }

    startGameLoop() {
        let truePositionTimer = 0;
        const step = () => {
            new Promise((resolve, reject) => {
                setTimeout(()=>{
                    if (truePositionTimer >= 30) {
                        truePositionTimer = 0;
                    } else {
                        truePositionTimer++;
                    }
                    resolve();
                }, 17); // FRAMERATE HERE 34MS FOR 30FPS 17MS FOR 60FPS
            }).then(res => step());

            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

            socket.emit('get-players');
            
            if (this.players.length > 0) {
                this.players.forEach(player => {
                    if (this.renderList.filter(item => item.id === player.id).length === 0) { // if instance isnt already in the renderlist
                        const newForeign = new Foreign({
                            id: player.id,
                            position: {
                                x: player.x,
                                y: player.y
                            }
                        });
                        this.renderList.push(newForeign);
                    } else { //if it already exists in there
                        const element = this.renderList.filter(item => item.id === player.id)[0];
                        element.updateInputs(player.inputs);
                        if (truePositionTimer === 0) {
                            element.updatePosition({
                                x: player.x,
                                y: player.y
                            })
                        }
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
