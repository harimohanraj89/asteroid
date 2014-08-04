var Bullet = function(position, angle) {
  this.position = { x: position.x, y: position.y };
  this.speed = 50;
  this.velocity = this.setVel(angle);
  this.size = 0.5;
  this.color = '#fff';
}

Bullet.prototype = {
  wrapPosition: function(width, height) {
    while (this.position.x > width/2) this.position.x -= width;
    while (this.position.x < -width/2) this.position.x += width;
    while (this.position.y > height/2) this.position.y -= height;
    while (this.position.y < -height/2) this.position.y += height;
  },

  update: function(dt, width, height) {
    this.position.x += this.velocity.x * dt / 1000;
    this.position.y += this.velocity.y * dt / 1000;
    this.wrapPosition(width, height);
  },

  setVel: function(angle) {
    return {
      x: this.speed * Math.cos(PI * angle / 180),
      y: -this.speed * Math.sin(PI * angle / 180)
    }
  }
}
