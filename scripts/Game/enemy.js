import Sprite from "./sprite.js";

class Enemy extends Sprite {
    hp = 2;
    constructor(x, y, speed, imageid, goldprob, game) {
        super(game);
        this.velocity = {
            x: 0,
            y: speed,
        };
        this.position = {
            x: Math.round(x),
            y: Math.round(y),
        };
        if (imageid == undefined) {
            if (Math.random() < goldprob) this.imageid = 5;
            else this.imageid = Math.floor(Math.random() * 4) + 1;
        } else this.imageid = imageid;

        if (this.imageid == 1) {
            this.hp = 4;
            this.bounty = this.hp * 100;
        } else if (this.imageid == 2) {
            this.hp = 5;
            this.bounty = this.hp * 100;
        } else if (this.imageid == 3) {
            this.hp = 2;
            this.bounty = this.hp * 100;
        } else if (this.imageid == 4) {
            this.hp = 3;
            this.bounty = this.hp * 100;
        } else if (this.imageid == 5) {
            this.hp = 3;
            this.bounty = 700;
        }
        this.image = this.game.imagePreloader.get(
            "../img/Meteor_" + this.imageid + "_" + this.hp + ".png"
        );
        this.width = this.image.width;
        this.height = this.image.height;
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

    collidesWithBossProjectile() {
        for (let index = 0; index < this.game.bossprojectiles.length; index++) {
            const bossprojectile = this.game.bossprojectiles[index];
            if (bossprojectile.collidesWith(this)) {
                this.game.bossprojectiles.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    getImage() {
        return this.game.imagePreloader.get("../img/Meteor_" + this.imageid + "_" + this.hp + ".png");
    }
}

export default Enemy;
