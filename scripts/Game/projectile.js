import Sprite from "./sprite.js";

class Projectile extends Sprite {
  constructor(position, velocity, color, game) {
    super(game);
    this.position = position;
    this.velocity = velocity;
    this.width = 3;
    this.height = 15;
    this.color = color;
  }

  draw() {
    this.game.ctx.beginPath();
    this.game.ctx.roundRect(
      this.position.x - 5,
      this.position.y - 5,
      13,
      25,
      6.5
    );
    this.game.ctx.fillStyle = addAlpha(this.color, 0.3);
    this.game.ctx.fill();
    this.game.ctx.closePath();

    this.game.ctx.beginPath();
    this.game.ctx.roundRect(
      this.position.x - 2,
      this.position.y - 2,
      7,
      19,
      3.5
    );
    this.game.ctx.fillStyle = addAlpha(this.color, 0.6);
    this.game.ctx.fill();
    this.game.ctx.closePath();

    this.game.ctx.beginPath();
    this.game.ctx.roundRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      this.width/2
    );
    this.game.ctx.fillStyle = "#FFFFFF";
    this.game.ctx.fill();
    this.game.ctx.closePath();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
  }
}
function addAlpha(color, opacity) {
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

export default Projectile;
