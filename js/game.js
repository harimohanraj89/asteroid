var Game = function(context) {
  this.ship = new Ship();
  this.stars = new Stars();
  this.bullets = [];
  this.maxBullets = 6;
  this.context = context;
  this.listen();
}

Game.prototype = {
  tick: function() {
    this.update();
    this.draw();
    window.requestAnimationFrame(this.tick.bind(this));
  },

  update: function() {
    this.ship.update();
    for (var i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update();
    }
  },

  draw: function() {
    this.context.fillRect(0, 0, CWIDTH, CHEIGHT);
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
