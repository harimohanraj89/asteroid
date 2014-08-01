var Bullet = function(position, angle) {
  this.position = { x: position.x, y: position.y };
  this.speed = 50;
  this.velocity = this.setVel(angle);
  this.size = 0.5;
  this.color = '#fff';
}

Bullet.prototype = {
  wrap: function() {
    while (this.position.x > GWIDTH/2) this.position.x -= GWIDTH;
    while (this.position.x < -GWIDTH/2) this.position.x += GWIDTH;
    while (this.position.y > GHEIGHT/2) this.position.y -= GHEIGHT;
    while (this.position.y < -GHEIGHT/2) this.position.y += GHEIGHT;
  },

  update: function(dt) {
    this.position.x += this.velocity.x * dt / 1000;
    this.position.y += this.velocity.y * dt / 1000;
    this.wrap();
  },

  draw: function(context) {
    var cPosition = displayCoords(this.position);
    var cSize = C * this.size;
    context.save();
    context.fillStyle = this.color;
    context.fillRect(cPosition.x - cSize/2, cPosition.y - cSize/2, cSize, cSize);
    context.restore();
  },

  setVel: function(angle) {
    return {
      x: this.speed * Math.cos(PI * angle / 180),
      y: -this.speed * Math.sin(PI * angle / 180)
    }
  }
}
