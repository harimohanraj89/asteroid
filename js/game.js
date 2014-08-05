var Game = function(inputMgr, actuator) {
  this.inputMgr = inputMgr;
  this.actuator = actuator;

  this.width = 100;
  this.height = 75;

  this.ship = new Ship();
  this.stars = new Stars();
  this.bullets = [];
  this.maxBullets = 6;
  this.bulletId = 0;
  this.shooting = false;

  this.t = null;
  this.dt = 0;

  this.inputMgr.init();
  this.listen();

  this.stars.spawn(50, this.width, this.height);
}

Game.prototype = {
  tick: function(step) {
    if (!this.t) {
      this.t = step;
    }
    this.dt = step - this.t;
    this.dt = isNaN(this.dt) ? 0 : this.dt;
    this.t = step;

    this.update();
    this.draw();
    this.actuator.animate(this.tick.bind(this));
  },

  update: function() {
    this.ship.update(this.dt, this.width, this.height);
    for (var i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update(this.dt, this.width, this.height);
    }
  },

  draw: function() {
    this.actuator.clearScreen();
    this.actuator.drawStars(this.stars, this.width, this.height);
    this.actuator.drawShip(this.ship, this.width, this.height);
    for (var i = this.bullets.length - 1; i >= 0; i--) {
      this.actuator.drawBullet(this.bullets[i], this.width, this.height);
    }
  },

  listen: function() {
    window.addEventListener('upPress', this.ship.thrustOn.bind(this.ship));
    window.addEventListener('leftPress', this.ship.rotLeftOn.bind(this.ship));
    window.addEventListener('rightPress', this.ship.rotRightOn.bind(this.ship));
    window.addEventListener('upRelease', this.ship.thrustOff.bind(this.ship));
    window.addEventListener('leftRelease', this.ship.rotLeftOff.bind(this.ship));
    window.addEventListener('rightRelease', this.ship.rotRightOff.bind(this.ship));
    window.addEventListener('shootPress', this.shoot.bind(this));
    window.addEventListener('shootRelease', (function() { this.shooting = false }).bind(this));

    window.addEventListener('bulletDeath', this.killBullet.bind(this));
  },

  shoot: function() {
    if (!this.shooting) {
      var bullet = this.ship.fire(this.bulletId++);
      if (bullet) {
        this.bullets.push(bullet);
      }
      this.limitBullets();
      this.shooting = true;
    }
  },

  limitBullets: function() {
    while (this.bullets.length > this.maxBullets) {
      this.bullets.shift();
    }
  },

  killBullet: function(e) {
    var bulletId = e.detail;
    for (var i = this.bullets.length - 1; i >= 0; i--) {
      if (this.bullets[i].id === bulletId) {
        this.bullets.splice(i, 1);
        break;
      }
    }
  }
}
