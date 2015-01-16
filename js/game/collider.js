var Collider = function() {
};

Collider.prototype.init = function(config) {
  this.asteroidBulletCallback = config.asteroidBulletCallback;
  this.shipAsteroidCallback = config.shipAsteroidCallback;
};

Collider.prototype.detectCollisions = function(asteroids, bullets, ship) {
  for (var i in asteroids) {
    var asteroid = asteroids[i];
    for (var j in bullets) {
      var bullet = bullets[j];
      this.detectAsteroidBulletCollision(asteroid, bullet);
    }

    this.detectShipAsteroidCollision(ship, asteroid);
  }
};

Collider.prototype.detectAsteroidBulletCollision = function(asteroid, bullet) {
  if (this.asteroidBulletOverlapping(asteroid, bullet)) {
    if (typeof this.asteroidBulletCallback === 'function') {
      this.asteroidBulletCallback(asteroid, bullet);
    }
  }
};

Collider.prototype.detectShipAsteroidCollision = function(ship, asteroid) {
  if (ship && this.shipAsteroidOverlapping(ship, asteroid)) {
    if (typeof this.shipAsteroidCallback === 'function') {
      this.shipAsteroidCallback(ship, asteroid);
    }
  }
};

Collider.prototype.asteroidBulletOverlapping = function(asteroid, bullet) {
  return (Math.abs(bullet.x() - asteroid.x()) < asteroid.size()/2
  && Math.abs(bullet.y() - asteroid.y()) < asteroid.size()/2);
};

Collider.prototype.shipAsteroidOverlapping = function(ship, asteroid) {
  return (Math.abs(ship.x() - asteroid.x()) < asteroid.size()/2
  && Math.abs(ship.y() - asteroid.y()) < asteroid.size()/2);
};
