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

Util.includeBehavior(Ship, Positionable);

Ship.prototype.thrustOn = function() {
  if (!this.thrust) {
    this.flameTime = 0;
    this.firstFlame = true;
  }
  this.thrust = true;
};

Ship.prototype.thrustOff = function() {
  this.thrust = false;
};

Ship.prototype.rotRightOn = function() {
  this.rotRight = true;
};

Ship.prototype.rotRightOff = function() {
  this.rotRight = false;
};

Ship.prototype.rotLeftOn = function() {
  this.rotLeft = true;
};

Ship.prototype.rotLeftOff = function() {
  this.rotLeft = false;
};

Ship.prototype.gunPosition = function() {
  return {
    x: this.position.x + Math.cos(PI * this.angle / 180),
    y: this.position.y - Math.sin(PI * this.angle / 180)
  }
};

Ship.prototype.afterUpdate = function(info) {
  this.updateVelocity(info.dt);
  this.updateRotation(info.dt);
  this.limitVelocity();
  this.updateCooldown(info.dt);
  this.updateFlame(info.dt);
};

Ship.prototype.limitVelocity = function() {
  var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
  if (speed > this.maxSpeed) {
    this.velocity.x *= this.maxSpeed / speed;
    this.velocity.y *= this.maxSpeed / speed;
  }
};

Ship.prototype.updateVelocity = function(dt) {
  if (this.thrust) {
    this.plusVx(this.thrustPower * Math.cos(PI * this.angle / 180) * dt / 1000);
    this.plusVy(-this.thrustPower * Math.sin(PI * this.angle / 180) * dt / 1000);
  }
};

Ship.prototype.updateRotation = function(dt) {
  if (this.rotLeft) this.angle += this.rotPower;
  if (this.rotRight) this.angle -= this.rotPower;
};

Ship.prototype.updateCooldown = function(dt) {
  this.cooldownTime = Math.max(this.cooldownTime - dt / 1000, 0);
};

Ship.prototype.updateFlame = function(dt) {
  this.flameTime += dt/1000;
  if (this.flameTime > this.flameMaxTime) {
    this.flameTime = 0;
    this.flame = !this.flame;
    this.firstFlame = false;
  }
};

Ship.prototype.fire = function(bulletId) {
  if (this.cooldownTime === 0) {
    this.startCooldown();
    return new Bullet(this.gunPosition(), this.angle, bulletId);
  }
  return null;
};

Ship.prototype.startCooldown = function() {
  this.cooldownTime = this.cooldownMaxTime;
};

Ship.prototype.registerControls = function(controller) {
  controller.register('upPress', this.thrustOn, this);
  controller.register('leftPress', this.rotLeftOn, this);
  controller.register('rightPress', this.rotRightOn, this);
  controller.register('upRelease', this.thrustOff, this);
  controller.register('leftRelease', this.rotLeftOff, this);
  controller.register('rightRelease', this.rotRightOff, this);
};
