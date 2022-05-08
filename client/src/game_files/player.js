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
        this.animations = {
            downidle: 0,
            downrun: 1,
            rightidle: 2,
            rightrun: 3,
            leftidle: 4,
            leftrun: 5,
            upidle: 6,
            uprun: 7
        }
        this.facing = 'down';
        this.idle = true;
        this.currentAnimation = this.animations.downidle;
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
        let time = 0;
        this.idle ? time = 10 : time = 5;
        if(this.animationTimer >= time) {
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
                this.idle = false;
                this.position.x += 1;
                this.currentAnimation = this.animations.rightrun;
                this.facing = 'right';
            }
            if (key === 'KeyA') {
                this.idle = false;
                this.position.x -= 1;
                this.currentAnimation = this.animations.leftrun;
                this.facing = 'left';
            }
            if (key === 'KeyW') {
                this.idle = false;
                this.position.y -= 1;
                this.currentAnimation = this.animations.uprun;
                this.facing = 'up';
            }
            if (key === 'KeyS') {
                this.idle = false;
                this.position.y += 1;
                this.currentAnimation = this.animations.downrun;
                this.facing = 'down';
            }
        });
        if (this.keysPressed.length === 0) {
            this.idle = true;
            if (this.facing === 'down') {
                this.currentAnimation = this.animations.downidle;
            }
            if (this.facing === 'right') {
                this.currentAnimation = this.animations.rightidle;
            }
            if (this.facing === 'left') {
                this.currentAnimation = this.animations.leftidle;
            }
            if (this.facing === 'up') {
                this.currentAnimation = this.animations.upidle;
            }
        }

        this.socket.emit('update-position', {
            inputs: this.keysPressed,
            x: this.position.x,
            y: this.position.y
        });

        this.isLoaded && ctx.drawImage(
            this.image,
            this.animationFrame * 32, //horizontal cut
            this.currentAnimation * 32, //vertical cut (rows)
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
