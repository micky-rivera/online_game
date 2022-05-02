class Foreign {

    constructor (config) {
        this.id = config.id || 'fuck';
        this.position = config.position || { x: 150, y: 75 };
        this.image = new Image();
        this.image.src = require('../assets/leftidle0.png');
        this.image.onload = () => {
            this.isLoaded = true;
        }
    }

    draw(ctx) {
        this.isLoaded && ctx.drawImage(
            this.image,
            0, //left cut
            0, //right cut
            32, //size of cut
            32, //size of cut, i like ya cut g
            this.position.x, //x position
            this.position.y, //y position
            32,
            32
        );
    }
}

export default Foreign;
