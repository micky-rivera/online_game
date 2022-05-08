const defaultPosition = {
    x: 150,
    y: 75,
}

class Player {

    constructor (config) {
        this.socket = config.socket;
        this.position = config.position || defaultPosition;
        this.image = new Image();
        this.image.onload = () => {
            this.isLoaded = true;
        }
        this.image.src = require('../assets/player.png');
        this.keysPressed = [];
        this.animation = 'downidle';
        this.animationFrame = 1;
        this.animationTimer = 0;

        document.addEventListener('keydown', (e) => {
            if (!this.keysPressed.includes(e.code)) {
                this.keysPressed.push(e.code);
            }
        });
        document.addEventListener('keyup', (e) => {
            if (this.keysPressed.includes(e.code)) {
                this.keysPressed = [...this.keysPressed].filter(key => key !== e.code);
            }
        });
    }

    animate() {
        if(this.animationTimer >= 5) {
            this.animationTimer = 0;
            if (this.animationFrame < 7) {
                this.animationFrame++;
            } else {
                this.animationFrame = 0;
            }
        } else {
            this.animationTimer++;
        }
    }

    draw(ctx) {

        this.animate();

        this.keysPressed.forEach(key=>{
            if (key === 'KeyD') {
                this.position.x += 1;
            }
            if (key === 'KeyA') {
                this.position.x -= 1;
            }
            if (key === 'KeyW') {
                this.position.y -= 1;
            }
            if (key === 'KeyS') {
                this.position.y += 1;
            }
        });

        this.socket.emit('update-position', {
            inputs: this.keysPressed,
            x: this.position.x,
            y: this.position.y
        });

        this.isLoaded && ctx.drawImage(
            this.image,
            this.animationFrame * 32, //horizontal cut
            5 * 32, //vertical cut (rows)
            32, //size of cut x
            32, //size of cut y, i like ya cut g
            this.position.x, //x position
            this.position.y, //y position
            32,
            32
        );
    }
}

export default Player;
