import Boss from "./Game/boss.js";
import Player from "./Game/player.js";
import Ally from "./Game/ally.js";
import Projectile from "./Game/projectile.js";
import Rectangle from "./Game/rectangle.js";
import Enemy from "./Game/enemy.js";
import Preloader from "./Game/preloader.js";

export const goldprob = 0.05; //Wahrscheinlichkeit, dass ein Meteorit ein Goldmeteorit wird
export const maxShoot = 30; //so oft kann mann schießen, bis das Raumschiff überhitzt
export const tickPerShoot = 10; //so viele ticks werden auf overheat drauf addiert
export const bossEventTime = 3000; //Nach so vielen Ticks kommt der Boss
export const playerShootDelay = 10; //Ticks zwischen jedem Schuss des Spielers
export const bossShootDelayTicks = 20; //Ticks zwischen jedem Schuss des Bosses
export const overheatDetainTime = 240; //Ticks nach denen das Überhitzen wieder aufhört
export const soundtrackVolume = 0.2;
export const soundeffectVolume = 0.7;

export const shot_snd = "audio/laser_shot.wav";
export const hit_snd = "audio/hit.mp3";
export const break_snd = "audio/break-stone.wav";

export const srcs = [
  "../img/ally.png",
  "../img/Meteor_1_1.png",
  "../img/Meteor_1_2.png",
  "../img/Meteor_1_3.png",
  "../img/Meteor_1_4.png",
  "../img/Meteor_2_1.png",
  "../img/Meteor_2_2.png",
  "../img/Meteor_2_3.png",
  "../img/Meteor_2_4.png",
  "../img/Meteor_2_5.png",
  "../img/Meteor_3_1.png",
  "../img/Meteor_3_2.png",
  "../img/Meteor_4_1.png",
  "../img/Meteor_4_2.png",
  "../img/Meteor_4_3.png",
  "../img/Meteor_5_1.png",
  "../img/Meteor_5_2.png",
  "../img/Meteor_5_3.png",
  { src: "../img/boss/", count: 13 },
  { src: "../img/player/", count: 11 },
];

class Game {
  canvas;
  real_canvas;
  ctx;
  real_ctx;
  shootDelay = 0;
  keys = [];
  projectiles = [];
  enemies = [];
  allies = [];
  player;
  score = 0;
  tick = 0;
  scorecounter;
  highscorecounter;
  walenda = true;
  run = true;
  enemy_prob = 0.25; // Die Wahrscheinlichkeit pro tick das ein Meteorit spawned bei einer Canvas-Breite von 1920px
  bossTime = false;
  bossspawned = false;
  bossarray = [];
  bossShootDelay = 0;
  bossprojectiles = [];
  bosstick = 0;
  overheat = 0;
  overheatDetainTimer = 0;
  bountyElement;
  window;
  document;
  imagePreloader;

  soundtrack = new Audio("audio/soundtrack.mp3");
  game_over = new Audio("audio/game_over.wav");

  constructor(window, document, imagePreloader) {
    this.window = window;
    this.document = document;
    this.imagePreloader = imagePreloader;
    this.soundtrack.volume = soundtrackVolume;
    this.game_over.volume = soundeffectVolume;
    this.real_canvas = this.document.getElementById("game");
    this.canvas = this.document.getElementById("hidden_canvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.roundRect = function (x, y, width, height, radius) {
      this.beginPath();
      this.moveTo(x + radius, y);
      this.lineTo(x + width - radius, y);
      this.arcTo(x + width, y, x + width, y + radius, radius);
      this.lineTo(x + width, y + height - radius);
      this.arcTo(x + width, y + height, x + width - radius, y + height, radius);
      this.lineTo(x + radius, y + height);
      this.arcTo(x, y + height, x, y + height - radius, radius);
      this.lineTo(x, y + radius);
      this.arcTo(x, y, x + radius, y, radius);
      this.stroke();
    };
    this.real_ctx = this.real_canvas.getContext("2d");

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.enemy_prob *= this.canvas.width / 1920;

    this.real_canvas.width = this.real_canvas.offsetWidth;
    this.real_canvas.height = this.real_canvas.offsetHeight;
    this.ctx.fillStyle = "blue";
    this.ctx.save();
    this.player = new Player(
      this.canvas.width / 2 - 25,
      this.canvas.height - 75,
      this,
    );
    this.scorecounter = this.document.getElementById("score");
    this.highscorecounter = this.document.getElementById("highscore");
    this.bountyElement = this.document.getElementById("bounties");
  }

  animate() {
    this.tick++;
    this.soundtrack.play().then();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.bossTime === true) {
      if (Math.random() < this.calculateEnemyProb(this.tick) / 3) {
        this.enemies.push(
          new Enemy(
            Math.round(Math.random() * this.canvas.width),
            -50,
            this.calculateEnemyStep(this.tick),
            undefined,
            goldprob,
            this,
          ),
        );
      }
      if (this.bossspawned === false) {
        this.document.getElementById("alert-screen").classList.add("show");
        setTimeout(() => {
          this.document.getElementById("alert-screen").classList.remove("show");
          this.bossarray.push(new Boss(this.canvas.width / 2, -40, this));
        }, 5000);
        this.bossspawned = true;
      }
      for (let index = 0; index < this.bossarray.length; index++) {
        const boss = this.bossarray[index];
        this.drawProgressBar(
          boss.hp * 8.5,
          boss.position.x,
          boss.position.y - 8,
          boss.width,
          5,
          "#F5FF00",
          "#00FF00",
          40,
        );
        if (boss.position.y < 150) {
          boss.velocity.y = 2;
        } else {
          boss.velocity.y = 0;
          if (boss.collidesWithProjectile()) {
            boss.hp--;
          }
          if (boss.position.x >= this.canvas.width - boss.width) {
            boss.velocity.x = -3;
          }
          if (boss.position.x <= 0) {
            boss.velocity.x = 3;
          }
        }
        if (this.bossShootDelay > 0) this.bossShootDelay--;

        for (let index = 0; index < this.bossprojectiles.length; index++) {
          const bossprojectile = this.bossprojectiles[index];
          if (bossprojectile.position.y + bossprojectile.radius <= 0) {
            this.bossprojectiles.splice(index, 1);
          }

          if (bossprojectile.collidesWith(this.player)) {
            this.endGame();
          } else {
            bossprojectile.update();
          }
        }
        if (this.bossShootDelay <= 0) {
          this.bossprojectiles.push(
            new Projectile(
              {
                x: boss.position.x + boss.width / 2,
                y: boss.position.y + tickPerShoot,
              },
              {
                x: 0,
                y: 10,
              },
              "#00FF00",
              this,
            ),
          );
          this.bossShootDelay = bossShootDelayTicks;
        }

        if (boss.hp === 0) {
          this.bossTime = false;
          this.bosstick++;
          this.bossarray.splice(index, 1);
          this.addBounty(1500);
          this.bossprojectiles = [];
        } else {
          boss.update();
        }
      }
    } else {
      this.score++;
      this.bosstick++;
      if (this.score > this.highscore) {
        this.highscore = this.score;
      }
      this.bossspawned = false;
      if (Math.random() < this.calculateEnemyProb(this.tick)) {
        this.enemies.push(
          new Enemy(
            Math.round(Math.random() * this.canvas.width),
            -50,
            this.calculateEnemyStep(this.tick),
            undefined,
            goldprob,
            this,
          ),
        );
      }
      if (Math.random() < this.calculateEnemyProb(this.tick) / 100) {
        this.allies.push(
          new Ally(Math.round(Math.random() * this.canvas.width), -50, this),
        );
      }
    }
    for (let index = 0; index < this.allies.length; index++) {
      let astronaut = this.allies[index];
      if (
        astronaut.collidesWith(this.player) ||
        astronaut.collidesWithProjectile()
      ) {
        this.allies.splice(index, 1);
        this.endGame();
      } else {
        astronaut.update();
      }
    }

    if (this.shootDelay > 0) this.shootDelay--;
    this.player.update();
    for (let index = 0; index < this.projectiles.length; index++) {
      const projectile = this.projectiles[index];
      if (projectile.position.y + projectile.radius <= 0) {
        this.projectiles.splice(index, 1);
        index--;
      } else {
        projectile.update();
      }
    }

    for (let index = 0; index < this.enemies.length; index++) {
      const enemy = this.enemies[index];
      if (enemy.collidesWith(this.player)) {
        this.endGame();
      }
      if (enemy.collidesWithProjectile()) {
        let enemyhit;
        if (enemy.hp > 1) enemyhit = new Audio(hit_snd);
        else enemyhit = new Audio(break_snd);
        enemyhit.volume = soundeffectVolume;
        enemyhit.play().then();
        enemy.hp--;
      }
      if (enemy.collidesWithBossProjectile()) {
        enemy.hp = 0;
      }

      if (enemy.position.y >= this.canvas.height || enemy.hp === 0) {
        if (enemy.hp === 0 && this.bossTime === false)
          this.addBounty(enemy.bounty);
        this.enemies.splice(index, 1);
        index--;
      } else {
        enemy.update();
      }
    }
    if (this.bosstick % bossEventTime === 0) {
      this.bossTime = true;
    }
    if (
      this.keys["w"] &&
      this.keys["a"] &&
      this.keys["l"] &&
      this.walenda === true
    ) {
      this.walenda = false;
      // updateMode();
    }
    if (this.keys[78] && this.walenda === false) {
      this.walenda = true;
      // updateMode();
    }
    this.drawProgressBar(
      (this.overheat / (tickPerShoot * maxShoot)) * 100,
      this.player.position.x,
      this.player.position.y + this.player.height + 8,
      this.player.width,
      5,
      "#fe8206",
      "#ff0000",
      90,
    );
    if (
      (this.keys["a"] || this.keys["ArrowLeft"]) &&
      this.player.position.x >= 0
    ) {
      this.player.move(-5, 0);
    }
    if (
      (this.keys["d"] || this.keys["ArrowRight"]) &&
      this.player.position.x + this.player.width <= innerWidth
    ) {
      this.player.move(5, 0);
    }
    if (
      (this.keys[" "] || this.keys["ArrowUp"]) &&
      this.shootDelay <= 0 &&
      this.overheat <= maxShoot * tickPerShoot
    ) {
      let shotSound = new Audio(shot_snd);
      shotSound.volume = soundeffectVolume;
      shotSound.play().then();
      this.overheat += tickPerShoot;
      this.projectiles.push(
        new Projectile(
          {
            x: this.player.position.x + this.player.width / 2,
            y: this.player.position.y,
          },
          {
            x: 0,
            y: -20,
          },
          "#cc0000",
          this,
        ),
      );
      this.shootDelay = playerShootDelay;
    }
    if (this.overheatDetainTimer > 0) this.overheatDetainTimer--;
    else if (this.overheat >= maxShoot * tickPerShoot) {
      this.overheat = maxShoot * tickPerShoot;
      this.overheatDetainTimer = overheatDetainTime;
    }
    if (
      this.overheat > 0 &&
      !(this.keys[" "] || this.keys["ArrowUp"]) &&
      this.overheatDetainTimer <= 0
    ) {
      this.overheat--;
    }
    this.real_ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.real_ctx.drawImage(this.canvas, 0, 0);

    this.scorecounter.innerHTML = this.score;
    this.highscorecounter.innerHTML = this.highscore;
  }

  addBounty(bounty) {
    this.score += bounty;
    let div = document.createElement("div");
    div.innerHTML = "+" + bounty;
    this.bountyElement.appendChild(div);
    div.classList.add("hide");
  }

  endGame() {
    this.postScore();
    setTimeout(() => {
      this.reloadGlobalScoreBoard();
    }, 100);
    this.soundtrack.pause();
    this.game_over.play().then();
    this.run = false;
    this.document.getElementById("game-over-screen").classList.add("show");
    this.document.getElementById("score-board").classList.add("end");
    this.onGameEnded();
  }

  onGameEnded() {}

  /**
   * @param {number} val percentage the bar should be filled by
   * @param {number} x postion x
   * @param {number} y postion y
   * @param {number} width inner width of the progress bar
   * @param {number} height inner height of the progress bar
   * @param {string} color
   * @param {string} color2
   * @param a
   */
  drawProgressBar(val, x, y, width, height, color, color2, a) {
    if (val > 100) val = 100;
    new Rectangle(x, y, x + width, y + height).draw(undefined, this.ctx);
    this.ctx.fillStyle = color;
    if (val > a) this.ctx.fillStyle = color2;
    this.ctx.fillRect(x, y, (width * val) / 100, height);
  }

  calculateEnemyStep(tick) {
    let mid = Math.round(this.getProgressingValue(tick, 2, 6) * 2) / 2; // get a value between 2 and 5 rounded to .5

    let random = Math.round(Math.random() * 2 - 1) / 2; // -0.5, 0.0 or 0.5

    return mid + random;
  }

  calculateEnemyProb(tick) {
    return this.getProgressingValue(
      tick,
      this.enemy_prob - this.enemy_prob / 2,
      this.enemy_prob + this.enemy_prob / 2,
    );
  }

  /**
   * tick = x
   * (1/(1+ℯ^(-((x)/(1500))+5)))
   * @param {number} tick current tick
   * @returns The step an enemy should make
   */
  getProgressingMultiplicator(tick) {
    return 1 / (1 + Math.pow(Math.E, -(tick / 2000) + 5));
  }

  getProgressingValue(tick, min, max) {
    return (max - min) * this.getProgressingMultiplicator(tick) + min;
  }
}

let loader = new Preloader();
loader.load(srcs);

let game;
let ran = false;

function animate() {
  if (ran) {
    game.animate();
    if (game.run) window.requestAnimationFrame(animate);
  }
}

function startGame() {
  document.getElementById("start-screen").classList.add("hide");
  game = new Game(window, document, loader);

  ran = true;
  let locallyStoredScore = window.localStorage.getItem("highscore");
  if (locallyStoredScore) {
    game.highscore = parseInt(locallyStoredScore);
  }
  window.requestAnimationFrame(animate);
  document.getElementById("score-board").classList.remove("hide");
  if (isNaN(game.highscore) || game.highscore === undefined) {
    game.highscore = 0;
  }
}

document.querySelector("#start-screen > .play-button").onclick = () => {
  startGame();
};

window.onkeydown = (ev) => {
  if (game) {
    game.keys[ev.key] = true;
  }
};
window.onkeyup = (ev) => {
  if (game) {
    game.keys[ev.key] = false;
  }
};
