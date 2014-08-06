var Asteroid = function(position, angle, id) {
  this.position = { x: position.x, y: position.y };
  this.speed = 10;
  this.velocity = this.setVel(angle);
  this.id = id;

  this.size = 5;
  this.color = '#ccc';
}

Asteroid.prototype = {
  wrapPosition: function(width, height) {
    while (this.position.x > width/2) this.position.x -= width;
    while (this.position.x < -width/2) this.position.x += width;
    while (this.position.y > height/2) this.position.y -= height;
    while (this.position.y < -height/2) this.position.y += height;
  },

  update: function(dt, width, height) {
    var dx = this.velocity.x * dt / 1000;
    var dy = this.velocity.y * dt / 1000;

    this.position.x += dx;
    this.position.y += dy;
    this.wrapPosition(width, height);
  },

  setVel: function(angle) {
    return {
      x: this.speed * Math.cos(PI * angle / 180),
      y: -this.speed * Math.sin(PI * angle / 180)
    }
  }
}
