var Ship = function() {
  this.position = { x: 0, y: 0 };
  this.speed = 0;
  this.velocity = { x: 0, y: 0 };
  this.angle = 90;
  this.thrust = false;
  this.rotRight = false;
  this.rotLeft = false;
  this.flame = false;
  this.firstFlame = false;
  this.bulletCooldown = false;
  this.cooldownTime = 0;

  this.maxSpeed = 40;
  this.thrustPower = 20;
  this.rotPower = 3;
  this.flameTime = 0;
  this.flameMaxTime = 0.07;
  this.cooldownMaxTime = 0.2;
  this.colors = ['#fff', '#c00', '#e81'];
  this.size = 2;

};

Ship.prototype = {
  thrustOn: function() {
    if (!this.thrust) {
      this.flameTime = 0;
      this.firstFlame = true;
    }
    this.thrust = true;
  },

  thrustOff: function() {
    this.thrust = false;
  },

  rotRightOn: function() {
    this.rotRight = true;
  },

  rotRightOff: function() {
    this.rotRight = false;
  },

  rotLeftOn: function() {
    this.rotLeft = true;
  },

  rotLeftOff: function() {
    this.rotLeft = false;
  },

  gunPosition: function() {
    return {
      x: this.position.x + Math.cos(PI * this.angle / 180),
      y: this.position.y - Math.sin(PI * this.angle / 180)
    }
  },

  wrapPosition: function(width, height) {
    while (this.position.x > width/2) this.position.x -= width;
    while (this.position.x < -width/2) this.position.x += width;
    while (this.position.y > height/2) this.position.y -= height;
    while (this.position.y < -height/2) this.position.y += height;
  },

  limitVelocity: function() {
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
      this.velocity.x *= this.maxSpeed / speed;
      this.velocity.y *= this.maxSpeed / speed;
    }
  },

  update: function(dt, width, height) {
    this.updatePosition(dt);
    this.updateVelocity(dt);
    this.updateRotation(dt);
    this.limitVelocity();
    this.wrapPosition(width, height);
    this.updateCooldown(dt);
    this.updateFlame(dt);
  },

  updatePosition: function(dt) {
    this.position.x += this.velocity.x * dt / 1000;
    this.position.y += this.velocity.y * dt / 1000;
  },

  updateVelocity: function(dt) {
    if (this.thrust) {
      this.velocity.x += this.thrustPower * Math.cos(PI * this.angle / 180) * dt / 1000;
      this.velocity.y -= this.thrustPower * Math.sin(PI * this.angle / 180) * dt / 1000;
    }
  },

  updateRotation: function(dt) {
    if (this.rotLeft) this.angle += this.rotPower;
    if (this.rotRight) this.angle -= this.rotPower;
  },

  updateCooldown: function(dt) {
    this.cooldownTime = Math.max(this.cooldownTime - dt / 1000, 0);
  },

  updateFlame: function(dt) {
    this.flameTime += dt/1000;
    if (this.flameTime > this.flameMaxTime) {
      this.flameTime = 0;
      this.flame = !this.flame;
      this.firstFlame = false;
    }
  },

  fire: function(bulletId) {
    if (this.cooldownTime === 0) {
      this.startCooldown();
      return new Bullet(this.gunPosition(), this.angle, bulletId);
    }
    return null;
  },

  startCooldown: function() {
    this.cooldownTime = this.cooldownMaxTime;
  }
}
