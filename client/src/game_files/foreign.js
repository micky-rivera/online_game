class Foreign {

    constructor (config) {
        this.id = config.id || 'fuck';
        this.position = config.position || { x: 7, y: 5 };
        this.specificPosition = {
            x: this.position.x * 16 - 8,
            y: this.position.y * 16 -1,
        }
        this.image = new Image();
        this.image.src = require('../assets/player.png');
        this.image.onload = () => {
            this.isLoaded = true;
        }
        this.keysPressed = [];
        this.facing = config.facing; // get from server
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
        this.currentAnimation = this.animations.downidle;
        this.animationFrame = 1;
        this.animationTimer = 0;
    }

    updateInputs(input) {
        this.keysPressed = input;
    }

    updatePosition(input) {
        if (this.specificPosition.x === this.position.x * 16 - 8 && this.specificPosition.y === this.position.y * 16 - 1) {
            this.position.x = input.x;
            this.position.y = input.y;
            this.facing = input.facing;
        }
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

        // if not on grid position, move towards new grid position
        if (this.specificPosition.x !== this.position.x * 16 - 8 || this.specificPosition.y !== this.position.y * 16 - 1) {
            this.idle = false;
            if (this.facing === 'right') {
                this.currentAnimation = this.animations.rightrun;
                this.specificPosition.x++;
            }
            if (this.facing === 'left') {
                this.currentAnimation = this.animations.leftrun;
                this.specificPosition.x--;
            }
            if (this.facing === 'up') {
                this.currentAnimation = this.animations.uprun;
                this.specificPosition.y--;
            }
            if (this.facing === 'down') {
                this.currentAnimation = this.animations.downrun;
                this.specificPosition.y++;
            }
        } else {
            if (this.facing === 'right') {
                this.idle = true;
                this.currentAnimation = this.animations.rightidle;
            }
            if (this.facing === 'left') {
                this.idle = true;
                this.currentAnimation = this.animations.leftidle;
            }
            if (this.facing === 'up') {
                this.idle = true;
                this.currentAnimation = this.animations.upidle;
            }
            if (this.facing === 'down') {
                this.idle = true;
                this.currentAnimation = this.animations.downidle;
            }
        }

        this.isLoaded && ctx.drawImage(
            this.image,
            this.animationFrame * 32, //horizontal cut
            this.currentAnimation * 32, //vertical cut (rows)
            32, //size of cut
            32, //size of cut, i like ya cut g
            this.specificPosition.x, //x position
            this.specificPosition.y, //y position
            32,
            32
        );
    }
}

export default Foreign;
