var Asteroid = function(position, angle, stage, id) {
  this.position = { x: position.x, y: position.y };
  this.speed = 20;
  this.stage = stage;
  this.velocity = this.setVel(angle);
  this.id = id;
  this.color = '#ccc';
}

Util.includeBehavior(Asteroid, Positionable);

Asteroid.prototype.size = function() {
  return (3 + 2 * this.stage);
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
