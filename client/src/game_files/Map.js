import Player from "./player";
import Foreign from "./foreign";
import {io} from 'socket.io-client';

const socket = io('http://localhost:8000');
class Map {

    constructor (config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player({
            position: {
                x: 100,
                y: 50,
            }
        });
        this.renderList = [this.player];
        this.players = [];
    }

    startGameLoop() {
        let log = true;
        const step = () => {
            new Promise((resolve, reject) => {
                setTimeout(()=>{
                    resolve();
                }, 17); // FRAMERATE HERE 34MS FOR 30FPS 17MS FOR 60FPS
            }).then(res => step());

            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

            socket.emit('get-players');
            
            if (this.players.length > 0) {
                this.players.forEach(player => {
                    if (this.renderList.filter(item => item.id === player.id).length === 0) {
                        const newForeign = new Foreign({
                            id: player.id,
                            position: {
                                x: player.x,
                                y: player.y
                            }
                        });
                        this.renderList.push(newForeign);
                    }
                });
            }

            this.renderList.forEach(item => {
                item.draw(this.ctx);
            });

            if (log && this.renderList.length > 1) {
                console.log(this.renderList);
                log = false
            }
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
