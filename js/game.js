var Game = function(inputMgr, actuator) {
  this.inputMgr = inputMgr;
  this.actuator = actuator;

  this.width = 100;
  this.height = 75;

  // this.ship = new Ship();

  this.stars = new Stars();

  this.bullets = [];
  this.maxBullets = 6;
  this.bulletId = 0;
  this.shooting = false;

  this.asteroids = [];
  this.asteroidId = 0;

  this.respawning = false;
  this.respawnTime = 3;
  this.levelStarting = false;
  this.loadTime = 3;

  this.t = null;
  this.dt = 0;

  this.spawnShip();
  this.stars.spawn(50, this.width, this.height);

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
    this.actuator.animate(this.tick.bind(this));
  },

  update: function() {
    if (this.ship) {
      this.ship.update(this.dt, this.width, this.height);
    }
    for (var i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update(this.dt, this.width, this.height);
    }
    for (var i = this.asteroids.length - 1; i >= 0; i--) {
      this.asteroids[i].update(this.dt, this.width, this.height);
    }

    this.detectCollisions();

    if (this.asteroids.length === 0 && !this.levelStarting) {
      setTimeout((function() {
        this.startLevel(3)
      }).bind(this), this.loadTime * 1000);
      this.levelStarting = true;
    }

  },

  draw: function() {
    this.actuator.clearScreen();
    this.actuator.drawStars(this.stars, this.width, this.height);

    if (this.ship) {
      this.actuator.drawShip(this.ship, this.width, this.height);
    }
    for (var i = this.bullets.length - 1; i >= 0; i--) {
      this.actuator.drawBullet(this.bullets[i], this.width, this.height);
    }
    for (var i = this.asteroids.length - 1; i >= 0; i--) {
      this.actuator.drawAsteroid(this.asteroids[i], this.width, this.height);
    }
    if (this.respawning) {
      this.actuator.drawMessage('respawning');
    } else if (this.levelStarting) {
      this.actuator.drawMessage('get ready');
    }
  },

  listen: function() {

    this.shipListen();
    window.addEventListener('bulletDeath', this.killBullet.bind(this));
    window.addEventListener('asteroidDeath', this.killAsteroid.bind(this));
  },

  shipListen: function() {
    window.addEventListener('upPress', this.ship.thrustOn.bind(this.ship));
    window.addEventListener('leftPress', this.ship.rotLeftOn.bind(this.ship));
    window.addEventListener('rightPress', this.ship.rotRightOn.bind(this.ship));
    window.addEventListener('upRelease', this.ship.thrustOff.bind(this.ship));
    window.addEventListener('leftRelease', this.ship.rotLeftOff.bind(this.ship));
    window.addEventListener('rightRelease', this.ship.rotRightOff.bind(this.ship));
    window.addEventListener('shootPress', this.shoot.bind(this));
    window.addEventListener('shootRelease', (function() { this.shooting = false }).bind(this));
  },

  spawnShip: function() {
    this.ship = new Ship();
    this.shipListen();
    this.respawning = false;
  },

  killShip: function() {
    this.ship = null;
    this.respawnShip();
  },

  respawnShip: function() {
    this.respawning = true;
    setTimeout(this.spawnShip.bind(this), this.respawnTime * 1000);
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
  },

  spawnAsteroid: function(position, angle) {
    this.asteroids.push(new Asteroid(position, angle, this.asteroidId++));
  },

  startLevel: function(num) {
    this.levelStarting = false;
    for (var i = 0; i < num; i++) {
      var position = {
        x: this.width/2,
        y: Math.floor(this.height * (Math.random() - 0.5))
      }
      var angle = 360 * Math.random();
      this.spawnAsteroid(position, angle);
    }
  },

  killAsteroid: function(e) {
    var asteroidId = e.detail;
    for (var i = this.asteroids.length - 1; i >= 0; i--) {
      if (this.asteroids[i].id === asteroidId) {
        this.asteroids.splice(i, 1);
        break;
      }
    }
  },

  detectCollisions: function() {
    for (var i in this.asteroids) {
      var asteroid = this.asteroids[i];

      // Asteroids and bullets
      for (var j in this.bullets) {
        var bullet = this.bullets[j];
        if (Math.abs(bullet.position.x - asteroid.position.x) < asteroid.size/2
            && Math.abs(bullet.position.y - asteroid.position.y) < asteroid.size/2) {
          bullet.die();
          asteroid.die();
        }
      }

      // Asteroids and ship
      if (this.ship) {
        if (Math.abs(this.ship.position.x - asteroid.position.x) < asteroid.size/2
            && Math.abs(this.ship.position.y - asteroid.position.y) < asteroid.size/2) {
          this.killShip();
          asteroid.die();
        }
      }
    }
  }
}
