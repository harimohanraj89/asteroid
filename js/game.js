var Game = function(context, inputMgr) {
  this.context = context;
  this.inputMgr = inputMgr;

  this.ship = new Ship();
  this.stars = new Stars();
  this.bullets = [];
  this.maxBullets = 6;

  this.t = null;
  this.dt = 0;

  this.inputMgr.init();
  this.listen();
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
    window.requestAnimationFrame(this.tick.bind(this));
  },

  update: function() {
    this.ship.update(this.dt);
    for (var i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update(this.dt);
    }
  },

  draw: function() {
    this.context.fillRect(0, 0, displayScale(GWIDTH), displayScale(GHEIGHT));
    this.stars.draw(this.context);
    this.ship.draw(this.context);
    for (var i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].draw(this.context);
    }
  },

  listen: function() {
    window.addEventListener('upPress', this.ship.thrustOn.bind(this.ship));
    window.addEventListener('leftPress', this.ship.rotLeftOn.bind(this.ship));
    window.addEventListener('rightPress', this.ship.rotRightOn.bind(this.ship));
    window.addEventListener('upRelease', this.ship.thrustOff.bind(this.ship));
    window.addEventListener('leftRelease', this.ship.rotLeftOff.bind(this.ship));
    window.addEventListener('rightRelease', this.ship.rotRightOff.bind(this.ship));
    window.addEventListener('shootPress', this.fire.bind(this));
  },

  fire: function() {
    this.bullets.push(new Bullet(this.ship.gunPosition(), this.ship.angle));
    while (this.bullets.length > this.maxBullets) {
      this.bullets.shift();
    }
  }
}
