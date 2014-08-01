var ship = {
  position: { x: 0, y: 0 },
  speed: 0,
  velocity: {
    x: 0,
    y: 0
  },
  angle: 0,
  thrust: false,
  thrustPower: 1000,
  rotRight: false,
  rotLeft: false,
  rotPower: 2.5,

  flame: false,
  flameCount: 0,
  flameMaxCount: 3,
  firstFlame: false,

  colors: ['#fff', '#c00', '#e81'],
  size: 2,

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

  draw: function() {
    var cPosition = canvasCoords(this.position);
    context.save();
    context.translate(cPosition.x, cPosition.y);
    context.rotate(-PI * this.angle / 180);
    this.drawBody();
    this.drawHead();
    this.drawFlame();
    context.restore();
  },

  drawBody: function() {
    var cSize = C * this.size;
    context.fillStyle = this.colors[0];
    context.fillRect(-cSize/2, -cSize/2, cSize, cSize);
  },

  drawHead: function() {
    var cSize = C * this.size;
    context.fillStyle = this.colors[1];
    context.fillRect(cSize/2, -cSize/8, cSize/4, cSize/4);
  },

  drawFlame: function() {
    if ((this.flame && this.thrust) || this.firstFlame) {
      var cSize = C * this.size;
      context.fillStyle = this.colors[2];
      context.beginPath();
      context.moveTo(-cSize/2, cSize/2);
      context.lineTo(-cSize, 0);
      context.lineTo(-cSize/2, -cSize/2);
      context.fill();

    }
    if (++this.flameCount > this.flameMaxCount) {
      this.flameCount = 0;
      this.flame = !this.flame;
      this.firstFlame = false;
    }
  }
}
