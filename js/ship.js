var Ship = function() {
  this.position = { x: 0, y: 0 };
  this.speed = 0;
  this.velocity = { x: 0, y: 0 };
  this.angle = 90;
  this.thrust = false;
  this.thrustPower = 1200;
  this.rotRight = false;
  this.rotLeft = false;
  this.rotPower = 3;
  this.flame = false;
  this.flameCount = 0;
  this.flameMaxCount = 3;
  this.firstFlame = false;
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

  wrap: function() {
    while (this.position.x > GWIDTH/2) this.position.x -= GWIDTH;
    while (this.position.x < -GWIDTH/2) this.position.x += GWIDTH;
    while (this.position.y > GHEIGHT/2) this.position.y -= GHEIGHT;
    while (this.position.y < -GHEIGHT/2) this.position.y += GHEIGHT;
  },

  update: function() {
    this.position.x += this.velocity.x * DT;
    this.position.y += this.velocity.y * DT;


    if (this.thrust) {
      this.velocity.x += this.thrustPower * Math.cos(PI * this.angle / 180) * DT;
      this.velocity.y -= this.thrustPower * Math.sin(PI * this.angle / 180) * DT;
      console.log(this.velocity);
    }
    if (this.rotLeft) this.angle += this.rotPower;
    if (this.rotRight) this.angle -= this.rotPower;

    this.wrap();
  },

  draw: function(context) {
    var cPosition = canvasCoords(this.position);
    context.save();
    context.translate(cPosition.x, cPosition.y);
    context.rotate(-PI * this.angle / 180);
    this.drawBody(context);
    // this.drawHead(context);
    this.drawFlame(context);
    context.restore();
  },

  drawBody: function(context) {
    var cSize = C * this.size;
    context.fillStyle = this.colors[0];
    context.beginPath();
    context.moveTo(cSize/2, 0);
    context.lineTo(-cSize/2, cSize/2);
    context.lineTo(-cSize/4, 0);
    context.lineTo(-cSize/2, -cSize/2);
    context.fill();
    // context.fillRect(-cSize/2, -cSize/2, cSize, cSize);
  },

  drawHead: function(context) {
    var cSize = C * this.size;
    context.fillStyle = this.colors[1];
    context.fillRect(cSize/2 - cSize/8, -cSize/8, cSize/4, cSize/4);
  },

  drawFlame: function(context) {
    if ((this.flame && this.thrust) || this.firstFlame) {
      var cSize = C * this.size;
      context.fillStyle = this.colors[2];
      context.beginPath();
      context.moveTo(-cSize/2, cSize/2);
      context.lineTo(-cSize, cSize/4);
      context.lineTo(-cSize/2 - cSize/6, 0);
      context.lineTo(-cSize, -cSize/4);
      context.lineTo(-cSize/2, -cSize/2);
      context.lineTo(-cSize/4, 0);
      context.fill();

    }
    if (++this.flameCount > this.flameMaxCount) {
      this.flameCount = 0;
      this.flame = !this.flame;
      this.firstFlame = false;
    }
  }
}
