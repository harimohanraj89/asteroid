var Bullet = function(position, angle, id) {
  this.position = { x: position.x, y: position.y };
  this.speed = 50;
  this.velocity = this.setVel(angle);
  this.id = id;
  this.distance = 0;

  this.maxDistance = 80;
  this.size = 0.5;
  this.color = '#fff';
}

Bullet.prototype = {
  x: function() {
    return this.position.x;
  },

  y: function() {
    return this.position.y;
  },

  wrapPosition: function(width, height) {
    while (this.position.x > width/2) this.position.x -= width;
    while (this.position.x < -width/2) this.position.x += width;
    while (this.position.y > height/2) this.position.y -= height;
    while (this.position.y < -height/2) this.position.y += height;
  },

  updatePosition: function(dt) {
    var dx = this.velocity.x * dt / 1000;
    var dy = this.velocity.y * dt / 1000;

    this.position.x += dx;
    this.position.y += dy;
    return { dx: dx, dy: dy };
  },

  beforeUpdate: function() {},

  update: function(dt, width, height) {
    this.beforeUpdate();
    var deltas = this.updatePosition(dt);
    this.wrapPosition(width, height);
    this.afterUpdate({
      dt: dt,
      width: width,
      height: height,
      deltas: deltas
    });
  },

  afterUpdate: function(info) {
    this.checkDeath(info.deltas)
  },

  checkDeath: function(deltas) {
    this.distance += Math.sqrt(deltas.dx*deltas.dx + deltas.dy*deltas.dy);
    if (this.distance > this.maxDistance) {
      this.die();
    }
  },

  setVel: function(angle) {
    return {
      x: this.speed * Math.cos(PI * angle / 180),
      y: -this.speed * Math.sin(PI * angle / 180)
    }
  },

  die: function() {
    var bulletDeath = new CustomEvent('bulletDeath', { 'detail': this.id });
    dispatchEvent(bulletDeath);
  }
}
