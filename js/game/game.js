var Game = function(inputMgr, actuator, collider) {
  this.inputMgr = inputMgr;
  this.actuator = actuator;
  this.collider = collider;

  this.width = 100;
  this.height = 75;

  this.stars = new Stars();

  this.bullets = [];
  this.maxBullets = 6;
  this.bulletId = 0;
  this.shooting = false;

  this.asteroids = [];
  this.asteroidId = 0;
  this.asteroidScore = 1000;

  this.respawning = false;
  this.respawnTime = 3;
  this.level = 0;
  this.levelStarting = false;
  this.loadTime = 3;

  this.gameOver = false;

  this.t = null;
  this.dt = 0;

  this.newGame();
  this.stars.spawn(50, this.width, this.height);

  this.inputMgr.init();
  this.listen();
  this.initCollider();
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
      this.level++;
      setTimeout((function() {
        this.startLevel(this.numAsteroids(this.level));
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
    this.actuator.drawHud(this.lives, this.score);
    if (this.gameOver) {
      this.actuator.drawMessage('game over');
    } else if (this.respawning) {
      this.actuator.drawMessage('respawning');
    } else if (this.levelStarting) {
      this.actuator.drawMessage('level ' + this.level);
    }
  },

  newGame: function() {
    this.spawnShip();
    this.score = 0;
    this.lives = 3;
    this.level = 0;
    this.gameOver = false;
  },

  restartGame: function() {
    if (this.gameOver) {
      this.clearSpace();
      this.newGame();
    }
  },

  startLevel: function(num) {
    this.levelStarting = false;
    for (var i = 0; i < num; i++) {
      var position = {
        x: this.width/2,
        y: Math.floor(this.height * (Math.random() - 0.5))
      }
      var angle = 360 * Math.random();
      this.spawnAsteroid(position, angle, 2);
    }
  },

  listen: function() {
    this.shipListen();
    window.addEventListener('bulletDeath', this.killBullet.bind(this));
    window.addEventListener('asteroidDeath', this.killAsteroid.bind(this));
    window.addEventListener('shootPress', this.restartGame.bind(this));
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

  clearSpace: function() {
    this.asteroids = [];
    this.bullets = [];
  },

  // Ship Management

  spawnShip: function() {
    this.ship = new Ship();
    this.shipListen();
    this.respawning = false;
  },

  killShip: function() {
    this.ship = null;
    this.lives--;
    if (this.lives >= 0) {
      this.respawnShip();
    } else {
      this.gameOver = true;
    }
  },

  respawnShip: function() {
    this.respawning = true;
    setTimeout(this.spawnShip.bind(this), this.respawnTime * 1000);
  },

  // Bullet Management

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

  // Asteroid Management

  spawnAsteroid: function(position, angle, stage) {
    this.asteroids.push(new Asteroid(position, angle, stage, this.asteroidId++));
  },

  spawnAsteroidChildren: function(asteroid) {
    if (asteroid.stage > 0) {
      this.spawnAsteroid(asteroid.position, 360 * Math.random(), asteroid.stage - 1);
      this.spawnAsteroid(asteroid.position, 360 * Math.random(), asteroid.stage - 1);
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

  // Game Design

  numAsteroids: function(level) {
    return Math.min(level + 2, 8);
  },

  addAsteroidScore: function(stage) {
    this.score += this.asteroidScore * (3 - stage);
  },

  // Collision Management

  initCollider: function() {
    this.collider.init({
      asteroidBulletCallback: this.asteroidBulletCollision.bind(this),
      shipAsteroidCallback: this.shipAsteroidCollision.bind(this)
    });
  },

  detectCollisions: function() {
    this.collider.detectCollisions(this.asteroids, this.bullets, this.ship);
  },

  asteroidBulletCollision: function(asteroid, bullet) {
    bullet.die();
    this.spawnAsteroidChildren(asteroid);
    this.addAsteroidScore(asteroid.stage);
    asteroid.die();
  },

  shipAsteroidCollision: function(ship, asteroid) {
    this.killShip(ship);
    this.spawnAsteroidChildren(asteroid);
    asteroid.die();
  }
}
