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
        if(this.animationTimer >= 7) {
            this.animationTimer = 0;
            if (this.animationFrame < 3) {
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

        this.socket.emit('update-position', {
            inputs: this.keysPressed,
            x: this.position.x,
            y: this.position.y
        });

        this.isLoaded && ctx.drawImage(
            this.image,
            this.animationFrame * 32, //left cut
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

export default Player;
