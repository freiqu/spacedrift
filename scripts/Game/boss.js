import Sprite from "./sprite.js";

class Boss extends Sprite{
    constructor(x, y, game) {
        super(game);
        this.hp = 12;

        this.bounty = 500;

        this.velocity = {
            x: 3,
            y: 0,
        };
        this.position = {
            x: Math.round(x),
            y: Math.round(y),
        };
        

        this.setImage("../../img/boss/", 13, 9)
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

export default Boss;