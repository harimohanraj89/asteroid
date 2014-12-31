var Collider = function() {
};

Collider.prototype = {
  init: function(config) {
    this.asteroidBulletCallback = config.asteroidBulletCallback;
    this.shipAsteroidCallback = config.shipAsteroidCallback;
  },

  detectCollisions: function(asteroids, bullets, ship) {
    for (var i in asteroids) {
      var asteroid = asteroids[i];
      for (var j in bullets) {
        var bullet = bullets[j];
        this.detectAsteroidBulletCollision(asteroid, bullet);
      }

      this.detectShipAsteroidCollision(ship, asteroid);
    }
  },

  detectAsteroidBulletCollision: function(asteroid, bullet) {
    if (this.asteroidBulletOverlapping(asteroid, bullet)) {
      if (typeof this.asteroidBulletCallback === 'function') {
        this.asteroidBulletCallback(asteroid, bullet);
      }
    }
  },

  detectShipAsteroidCollision: function(ship, asteroid) {
    if (ship && this.shipAsteroidOverlapping(ship, asteroid)) {
      if (typeof this.shipAsteroidCallback === 'function') {
        this.shipAsteroidCallback(ship, asteroid);
      }
    }
  },

  asteroidBulletOverlapping: function(asteroid, bullet) {
    return (Math.abs(bullet.position.x - asteroid.position.x) < asteroid.size/2
    && Math.abs(bullet.position.y - asteroid.position.y) < asteroid.size/2);
  },

  shipAsteroidOverlapping: function(ship, asteroid) {
    return (Math.abs(ship.position.x - asteroid.position.x) < asteroid.size/2
    && Math.abs(ship.position.y - asteroid.position.y) < asteroid.size/2);
  }
};
