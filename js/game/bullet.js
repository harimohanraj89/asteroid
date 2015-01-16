var Bullet = function(position, angle, id) {
  this.position = { x: position.x, y: position.y };
  this.speed = 50;
  this.velocity = this.setVel(angle);
  this.id = id;
  this.distance = 0;

  this.maxDistance = 80;
  this.size = 0.5;
  this.color = '#fff';
};

Util.includeBehavior(Bullet, Positionable);

Bullet.prototype.afterUpdate = function(info) {
  this.checkDeath(info.deltas)
};

Bullet.prototype.checkDeath = function(deltas) {
  this.distance += Math.sqrt(deltas.dx*deltas.dx + deltas.dy*deltas.dy);
  if (this.distance > this.maxDistance) {
    this.die();
  }
};

Bullet.prototype.setVel = function(angle) {
  return {
    x: this.speed * Math.cos(PI * angle / 180),
    y: -this.speed * Math.sin(PI * angle / 180)
  }
};

Bullet.prototype.die = function() {
  var bulletDeath = new CustomEvent('bulletDeath', { 'detail': this.id });
  dispatchEvent(bulletDeath);
};
