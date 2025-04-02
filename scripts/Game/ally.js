import Sprite from "./sprite.js";

class Ally extends Sprite{

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {Game} game 
     */
    constructor(x, y, game) {
        super(game);
        this.hp = 1;

        this.bounty = 500;

        this.velocity = {
            x: 0,
            y:
                Math.floor(Math.random() * 40) / 20 +
                2 +
                3 * (-1 / Math.pow(2, this.game.tick / 5000) + 1),
        };
        this.position = {
            x: Math.round(x),
            y: Math.round(y),
        };
        
        this.setImage("../../img/ally.png")
    }

    collidesWithProjectile() {
        for (let index = 0; index < this.game.projectiles.length; index++) {
            const projectile = this.game.projectiles[index];
            if (projectile.collidesWith(this)) {
                this.game.projectiles.splice(index, 1);
                return true;
            }
        }
        return false;
    }
}

export default Ally;