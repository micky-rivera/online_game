class Foreign {

    constructor (config) {
        this.id = config.id || 'fuck';
        this.position = config.position || { x: 150, y: 75 };
        this.image = new Image();
        this.image.src = require('../assets/leftidle0.png');
        this.image.onload = () => {
            this.isLoaded = true;
        }
        this.keysPressed = [];
    }

    updateInputs(input) {
        this.keysPressed = input;
    }

    updatePosition(input) {
        this.position.x = input.x;
        this.position.y = input.y;
    }

    draw(ctx) {
        this.keysPressed.forEach(key=>{
            if (key === 'KeyD') {
                this.position.x += 2;
            }
            if (key === 'KeyA') {
                this.position.x -= 2;
            }
            if (key === 'KeyW') {
                this.position.y -= 2;
            }
            if (key === 'KeyS') {
                this.position.y += 2;
            }
        });

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
