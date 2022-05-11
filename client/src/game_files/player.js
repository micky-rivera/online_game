const defaultPosition = {
    x: 10,
    y: 4,
}

class Player {

    constructor (config) {
        this.id = config.id;
        this.socket = config.socket;
        this.position = config.position || defaultPosition;
        this.specificPosition = {
            x: this.position.x * 16 - 8,
            y: this.position.y * 16 - 1,
        }
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
        this.currentX = 'idk';
        this.currentY = 'idk';

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

        // updated handleinput
        let currentKey = this.keysPressed.reverse()[0];
        if (currentKey === 'KeyD') {
            // if currently on grid, change grid position to next
            if (this.specificPosition.x === this.position.x * 16 - 8 && this.specificPosition.y === this.position.y * 16 - 1) {
                this.position.x++;
                this.specificPosition.x++;
                this.idle = false;
                this.currentAnimation = this.animations.rightrun;
                this.facing = 'right';
                this.action = 'move right';
                this.socket.emit('update-action', {
                    id: this.id,
                    action: this.action
                });
            }
        }
        if (currentKey === 'KeyA') {
            if (this.specificPosition.x === this.position.x * 16 - 8 && this.specificPosition.y === this.position.y * 16 - 1) {
                this.position.x--;
                this.specificPosition.x--;
                this.idle = false;
                this.currentAnimation = this.animations.leftrun;
                this.facing = 'left';
                this.action = 'move left';
                this.socket.emit('update-action', {
                    id: this.id,
                    action: this.action
                });
            }
        }
        if (currentKey === 'KeyW') {
            if (this.specificPosition.x === this.position.x * 16 - 8 && this.specificPosition.y === this.position.y * 16 - 1) {
                this.position.y--;
                this.specificPosition.y--;
                this.idle = false;
                this.currentAnimation = this.animations.uprun;
                this.facing = 'up';
                this.action = 'move up';
                this.socket.emit('update-action', {
                    id: this.id,
                    action: this.action
                });
            }
        }
        if (currentKey === 'KeyS') {
            if (this.specificPosition.x === this.position.x * 16 - 8 && this.specificPosition.y === this.position.y * 16 - 1) {
                this.position.y++;
                this.specificPosition.y++;
                this.idle = false;
                this.currentAnimation = this.animations.downrun;
                this.facing = 'down';
                this.action = 'move down';
                this.socket.emit('update-action', {
                    id: this.id,
                    action: this.action
                });
            }
        }

        //handling idle anims, NEEDS TO BE CHANGED
        if (this.keysPressed.length === 0) { // AND on grid position!
            if (this.specificPosition.x === this.position.x * 16 - 8 && this.specificPosition.y === this.position.y * 16 - 1) {
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
        }

        // if not on grid position, move towards that position
        if (this.specificPosition.x !== this.position.x * 16 - 8 || this.specificPosition.y !== this.position.y * 16 - 1) {
            if (this.facing === 'right') {
                this.specificPosition.x++;
            }
            if (this.facing === 'left') {
                this.specificPosition.x--;
            }
            if (this.facing === 'up') {
                this.specificPosition.y--;
            }
            if (this.facing === 'down') {
                this.specificPosition.y++;
            }
        }

        // if on grid, tell the server about myself
        if (this.specificPosition.x === this.position.x * 16 - 8 && this.specificPosition.y === this.position.y * 16 - 1) {
            if(this.currentX !== this.specificPosition.x || this.currentY !== this.specificPosition.y) {
                this.socket.emit('update-position', {
                    id: this.id,
                    x: this.position.x,
                    y: this.position.y,
                });
                this.currentX = this.specificPosition.x;
                this.currentY = this.specificPosition.y;
            }
        }

        this.isLoaded && ctx.drawImage(
            this.image,
            this.animationFrame * 32, //horizontal cut
            this.currentAnimation * 32, //vertical cut (rows)
            32, //size of cut x
            32, //size of cut y, i like ya cut g
            this.specificPosition.x, //x position
            this.specificPosition.y, //y position
            32,
            32
        );
    }
}

export default Player;
