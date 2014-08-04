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
  this.flameCount = 0;
  this.flameMaxCount = 3;
  this.cooldownMaxTime = 0.2;
  this.colors = ['#fff', '#c00', '#e81'];
  this.size = 2;

};

Ship.prototype = {
  thrustOn: function() {
    if (!this.thrust) {
      this.flameCount = 0;
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
    this.position.x += this.velocity.x * dt / 1000;
    this.position.y += this.velocity.y * dt / 1000;

    if (this.thrust) {
      this.velocity.x += this.thrustPower * Math.cos(PI * this.angle / 180) * dt / 1000;
      this.velocity.y -= this.thrustPower * Math.sin(PI * this.angle / 180) * dt / 1000;
    }
    if (this.rotLeft) this.angle += this.rotPower;
    if (this.rotRight) this.angle -= this.rotPower;

    this.limitVelocity();
    this.wrapPosition(width, height);

    this.cooldownTime = Math.max(this.cooldownTime - dt / 1000, 0);
  },

  fire: function() {
    if (this.cooldownTime === 0) {
      this.startCooldown();
      return new Bullet(this.gunPosition(), this.angle);
    }
    return null;
  },

  startCooldown: function() {
    this.cooldownTime = this.cooldownMaxTime;
    // console.log(this.cooldownTime);
  }
}
