var Game = function(config) {
  this.inputMgr = config.inputMgr;
  this.actuator = config.actuator;
  this.collider = config.collider;
  this.controller = config.controller;

  this.width = 100;
  this.height = 75;

  this.stars = config.stars;

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
  this.registerControls(this.controller);
  this.initCollider();
};

Game.prototype.tick = function(step) {
  if (!this.t) {
    this.t = step;
  }
  this.dt = step - this.t;
  this.dt = isNaN(this.dt) ? 0 : this.dt;
  this.t = step;

  this.update();
  this.draw();
  this.actuator.animate(this.tick.bind(this));
};

Game.prototype.update = function() {
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

};

Game.prototype.draw = function() {
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
};

Game.prototype.newGame = function() {
  this.spawnShip();
  this.score = 0;
  this.lives = 3;
  this.level = 0;
  this.gameOver = false;
};

Game.prototype.restartGame = function() {
  if (this.gameOver) {
    this.clearSpace();
    this.newGame();
  }
};

Game.prototype.startLevel = function(num) {
  this.levelStarting = false;
  for (var i = 0; i < num; i++) {
    var position = {
      x: this.width/2,
      y: Math.floor(this.height * (Math.random() - 0.5))
    }
    var angle = 360 * Math.random();
    this.spawnAsteroid(position, angle, 2);
  }
};

Game.prototype.registerControls = function(controller) {
  controller.register('bulletDeath', this.killBullet, this);
  controller.register('asteroidDeath', this.killAsteroid, this);
  controller.register('shootPress', this.restartGame, this);
  controller.register('shootPress', this.shoot, this);
  controller.register('shootRelease', (function() { this.shooting = false }), this);

  this.registerShipControls(controller);
};

Game.prototype.registerShipControls = function(controller) {
  this.ship.registerControls(this.controller);
};

Game.prototype.clearSpace = function() {
  this.asteroids = [];
  this.bullets = [];
};

// Ship Management

Game.prototype.newShip = function() {
  return new Ship();
};

Game.prototype.spawnShip = function() {
  this.ship = this.newShip()
  this.registerShipControls(this.controller);
  this.respawning = false;
};

Game.prototype.killShip = function() {
  this.ship = null;
  this.lives--;
  if (this.lives >= 0) {
    this.respawnShip();
  } else {
    this.gameOver = true;
  }
};

Game.prototype.respawnShip = function() {
  this.respawning = true;
  setTimeout(this.spawnShip.bind(this), this.respawnTime * 1000);
};

// Bullet Management

Game.prototype.shoot = function() {
  if (!this.shooting) {
    var bullet = this.ship.fire(this.bulletId++);
    if (bullet) {
      this.bullets.push(bullet);
    }
    this.limitBullets();
    this.shooting = true;
  }
};

Game.prototype.limitBullets = function() {
  while (this.bullets.length > this.maxBullets) {
    this.bullets.shift();
  }
};

Game.prototype.killBullet = function(e) {
  var bulletId = e.detail;
  for (var i = this.bullets.length - 1; i >= 0; i--) {
    if (this.bullets[i].id === bulletId) {
      this.bullets.splice(i, 1);
      break;
    }
  }
};

// Asteroid Management

Game.prototype.spawnAsteroid = function(position, angle, stage) {
  this.asteroids.push(new Asteroid(position, angle, stage, this.asteroidId++));
};

Game.prototype.spawnAsteroidChildren = function(asteroid) {
  if (asteroid.stage > 0) {
    this.spawnAsteroid(asteroid.position, 360 * Math.random(), asteroid.stage - 1);
    this.spawnAsteroid(asteroid.position, 360 * Math.random(), asteroid.stage - 1);
  }
};

Game.prototype.killAsteroid = function(e) {
  var asteroidId = e.detail;
  for (var i = this.asteroids.length - 1; i >= 0; i--) {
    if (this.asteroids[i].id === asteroidId) {
      this.asteroids.splice(i, 1);
      break;
    }
  }
};

// Game Design

Game.prototype.numAsteroids = function(level) {
  return Math.min(level + 2, 8);
};

Game.prototype.addAsteroidScore = function(stage) {
  this.score += this.asteroidScore * (3 - stage);
};

// Collision Management

Game.prototype.initCollider = function() {
  this.collider.init({
    asteroidBulletCallback: this.asteroidBulletCollision.bind(this),
    shipAsteroidCallback: this.shipAsteroidCollision.bind(this)
  });
};

Game.prototype.detectCollisions = function() {
  this.collider.detectCollisions(this.asteroids, this.bullets, this.ship);
};

Game.prototype.asteroidBulletCollision = function(asteroid, bullet) {
  bullet.die();
  this.spawnAsteroidChildren(asteroid);
  this.addAsteroidScore(asteroid.stage);
  asteroid.die();
};

Game.prototype.shipAsteroidCollision = function(ship, asteroid) {
  this.killShip(ship);
  this.spawnAsteroidChildren(asteroid);
  asteroid.die();
};
