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

Bullet.prototype.x = function() {
  return this.position.x;
};

Bullet.prototype.y = function() {
  return this.position.y;
};

Bullet.prototype.wrapPosition = function(width, height) {
  while (this.position.x > width/2) this.position.x -= width;
  while (this.position.x < -width/2) this.position.x += width;
  while (this.position.y > height/2) this.position.y -= height;
  while (this.position.y < -height/2) this.position.y += height;
};

Bullet.prototype.update = function(dt, width, height) {
  var dx = this.velocity.x * dt / 1000;
  var dy = this.velocity.y * dt / 1000;

  this.position.x += dx;
  this.position.y += dy;
  this.wrapPosition(width, height);

  this.distance += Math.sqrt(dx*dx + dy*dy);
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
