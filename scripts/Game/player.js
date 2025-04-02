import Sprite from "./sprite.js"

class Player extends Sprite{
    constructor(x, y, game) {
        super(game);
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.position = {
            x: Math.round(x),
            y: Math.round(y),
        };
        this.width = 50;
        this.height = 50;

        this.setImage("../../img/player/", 11,2)
    }
}

export default Player;