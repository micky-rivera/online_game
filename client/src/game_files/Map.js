import Player from "./player";

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
        const step = () => {
            new Promise((resolve, reject) => {
                setTimeout(()=>{
                    resolve();
                }, 17); // FRAMERATE HERE 34MS FOR 30FPS 17MS FOR 60FPS
            }).then(res => step());

            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

            /* fetch('http://localhost:8080/allplayers')
            .then(res => res.json())
            .then(data => {
                this.players = data;
            }); */
            
            if (this.players.length > 0) {
                this.players.forEach(player => {
                    const image = new Image();
                    image.src = '../assets/leftidle0.png';
                    this.ctx.drawImage(
                        image,
                        0, //left cut
                        0, //right cut
                        32, //size of cut
                        32, //size of cut, i like ya cut g
                        player.x, //x position
                        player.y, //y position
                        32,
                        32
                    );
                    /* const newForeign = new Foreign({
                        id: player.id,
                        position: {
                            x: player.x,
                            y: player.y
                        }
                    });
                    if (!this.renderList.includes(newForeign)) {
                        this.renderList.push(newForeign);
                    } */
                });
            }

            this.renderList.forEach(item => {
                item.draw(this.ctx);
            });
        };
        step();
    }

    init () {
        this.startGameLoop();
    }
}

export default Map;
