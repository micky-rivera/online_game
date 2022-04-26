class Overworld {
    constructor (config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    init () {
        const x = 0;
        const y = 0;
        const image = new Image();
        image.onload = () => {
            this.ctx.drawImage(
                image,
                0, //left cut
                0, //right cut
                32, //size of cut
                32, //size of cut
                x, //x position
                y, //y position
                32,
                32
                );
        }
        image.src = './assets/leftidle0.png';
    }
}
