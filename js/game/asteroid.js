var Asteroid = function(position, angle, stage, id) {
  this.position = { x: position.x, y: position.y };
  this.speed = 20;
  this.stage = stage;
  this.velocity = this.setVel(angle);
  this.id = id;
  this.color = '#ccc';
}

Asteroid.prototype.size = function() {
  return (3 + 2 * this.stage);
};

Asteroid.prototype.x = function() {
  return this.position.x;
};

Asteroid.prototype.y = function() {
  return this.position.y;
};

Asteroid.prototype.wrapPosition = function(width, height) {
  while (this.position.x > width/2) this.position.x -= width;
  while (this.position.x < -width/2) this.position.x += width;
  while (this.position.y > height/2) this.position.y -= height;
  while (this.position.y < -height/2) this.position.y += height;
};

Asteroid.prototype.updatePosition = function(dt) {
  var dx = this.velocity.x * dt / 1000;
  var dy = this.velocity.y * dt / 1000;

  this.position.x += dx;
  this.position.y += dy;
  return { dx: dx, dy: dy };
};

Asteroid.prototype.beforeUpdate = function() {};

Asteroid.prototype.afterUpdate = function() {};

Asteroid.prototype.update = function(dt, width, height) {
  this.updatePosition(dt);
  this.wrapPosition(width, height);
};

Asteroid.prototype.setVel = function(angle) {
  return {
    x: (this.speed - 5 * this.stage) * Math.cos(PI * angle / 180),
    y: -(this.speed - 5 * this.stage) * Math.sin(PI * angle / 180)
  }
};

Asteroid.prototype.die = function() {
  var asteroidDeath = new CustomEvent('asteroidDeath', { 'detail': this.id });
  dispatchEvent(asteroidDeath);
};
