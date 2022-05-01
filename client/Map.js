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
    }

    startGameLoop() {
        const step = () => {
            new Promise((resolve, reject) => {
                setTimeout(()=>{
                    resolve();
                }, 17); // FRAMERATE HERE 34MS FOR 30FPS 17MS FOR 60FPS
            }).then(res => step());

            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

            this.player.draw(this.ctx);
        };
        step();
    }

    init () {
        this.startGameLoop();
    }
}
