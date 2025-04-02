import Rectangle from "./rectangle.js";

class Sprite {
    game;
    currentFrame = 0;
    isGif = false;
    frameCount;
    frameDelay;
    frameDelayCounter; 
    constructor(game) {
        if (!game) {
            throw new Error("game is undefined");
        }
        this.game = game;
    }
    getBoundingRectangle() {
        return new Rectangle(
            this.position.x,
            this.position.y,
            this.position.x + this.width,
            this.position.y + this.height
        );
    }
    collidesWith(sprite) {
        let otherRect = sprite.getBoundingRectangle();
        let rect = this.getBoundingRectangle();
        return (
            rect.isInside(otherRect.x1, otherRect.y1) ||
            otherRect.isInside(rect.x1, rect.y1) ||
            rect.isInside(otherRect.x1, otherRect.y2) ||
            otherRect.isInside(rect.x1, rect.y2)
        );
    }
    draw() {
        const image = this.getImage();
        if (image) {
            this.game.ctx.drawImage(
                image,
                Math.round(this.position.x),
                Math.round(this.position.y),
                image.width,
                image.height
            );
        }
    }
    move(x, y) {
        this.position.x += x;
        this.position.y += y;
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw();
    }
    getImage() {
        if (!this.isGif) return this.image;
        else {
            this.frameDelayCounter--;
            if(this.frameDelayCounter <= 0) {
                this.frameDelayCounter = this.frameDelay;
                this.currentFrame++;
            }

            if (this.currentFrame >= this.frameCount) {
                this.currentFrame = 0;
            }
            this.height = this.images[this.currentFrame].height;
            this.width = this.images[this.currentFrame].width;
            return this.images[this.currentFrame];
        }
    }
    setImage(src, imageCount, frameDelay) {
        if (typeof src != "string") {
            throw new Error("src should be type of string");
        }
        if (src.endsWith("/")) {
            this.isGif = true;
            if (!imageCount) throw new Error("image count not set");
            this.images = [];
            for (let i = 0; i < imageCount; i++) {
                this.images.push(this.game.imagePreloader.get(src + (i + 1) + ".png"));
            }
            this.frameCount = imageCount;
        } else {
            this.image = this.game.imagePreloader.get(src)
            this.width = this.image.width;
            this.height = this.image.height;
        }
        if(!frameDelay) {
            frameDelay = 1;
        }
        this.frameDelay = frameDelay;
        this.frameDelayCounter = frameDelay;
    }
}

export default Sprite;
