var CanvasActuator = function(canvas) {
  this.width = 800;
  this.height = 600;
  this.C = 8;
  this.canvas = canvas;
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  this.context = canvas.getContext('2d');
  this.bgColor = '#000';
  this.font = 'Courier New';
  this.messageSize = 48;
  this.hudSize = 16;

  this.requestAnimationFrame = window.requestAnimationFrame ||
                                 window.mozRequestAnimationFrame ||
                                 window.webkitRequestAnimationFrame ||
                                 window.msRequestAnimationFrame;
};

CanvasActuator.prototype.clearScreen = function() {
  this.context.save();
  this.context.fillStyle = this.bgColor;
  this.context.fillRect(0, 0, this.width, this.height);
  this.context.restore();
};

CanvasActuator.prototype.animate = function(callback) {
  this.requestAnimationFrame.call(window, callback);
};

CanvasActuator.prototype.displayScale = function(value, width) {
  return value * this.width / width;
};

CanvasActuator.prototype.displayCoords = function(absLocation, width, height) {
  return {
    x: (absLocation.x + width/2) * this.width / width,
    y: (absLocation.y + height/2) * this.height / height
  };
};

CanvasActuator.prototype.drawShip = function(ship, width, height) {
  var cPosition = this.displayCoords(ship.position, width, height);
  this.context.save();
  this.context.translate(cPosition.x, cPosition.y);
  this.context.rotate(-PI * ship.angle / 180);
  this.drawShipBody(ship);
  this.drawShipFlame(ship);
  this.context.restore();
};

CanvasActuator.prototype.drawShipBody = function(ship) {
  var cSize = this.C * ship.size;
  this.context.save();
  this.context.fillStyle = ship.colors[0];
  this.context.beginPath();
  this.context.moveTo(cSize/2, 0);
  this.context.lineTo(-cSize/2, cSize/2);
  this.context.lineTo(-cSize/4, 0);
  this.context.lineTo(-cSize/2, -cSize/2);
  this.context.fill();
  this.context.restore();
};

CanvasActuator.prototype.drawShipHead = function(ship) {
  var cSize = this.C * this.size;
  context.fillStyle = this.colors[1];
  context.fillRect(cSize/2 - cSize/8, -cSize/8, cSize/4, cSize/4);
};

CanvasActuator.prototype.drawShipFlame = function(ship) {
  if ((ship.flame && ship.thrust) || ship.firstFlame) {
    var cSize = this.C * ship.size;
    this.context.fillStyle = ship.colors[2];
    this.context.beginPath();
    this.context.moveTo(-cSize/2, cSize/2);
    this.context.lineTo(-cSize, cSize/4);
    this.context.lineTo(-cSize/2 - cSize/6, 0);
    this.context.lineTo(-cSize, -cSize/4);
    this.context.lineTo(-cSize/2, -cSize/2);
    this.context.lineTo(-cSize/4, 0);
    this.context.fill();

  }
};

CanvasActuator.prototype.drawStars = function(stars, width, height) {
  var cPosition;
  var cSize = this.C * stars.size;
  this.context.save();
  this.context.fillStyle = stars.color;
  for (var i = stars.positions.length - 1; i >= 0; i--) {
    cPosition = this.displayCoords(stars.positions[i], width, height);
    this.context.fillRect(cPosition.x, cPosition.y, cSize, cSize);
  }
  this.context.restore();
};

CanvasActuator.prototype.drawBullet = function(bullet, width, height) {
  var cPosition = this.displayCoords(bullet.position, width, height);
  var cSize = this.C * bullet.size;
  this.context.save();
  this.context.fillStyle = bullet.color;
  this.context.fillRect(cPosition.x - cSize/2, cPosition.y - cSize/2, cSize, cSize);
  this.context.restore();
};

CanvasActuator.prototype.drawAsteroid = function(asteroid, width, height) {
  var cPosition = this.displayCoords(asteroid.position, width, height);
  var cSize = this.C * asteroid.size();
  this.context.save();
  this.context.strokeStyle = asteroid.color;
  this.context.strokeRect(cPosition.x - cSize/2, cPosition.y - cSize/2, cSize, cSize);
  this.context.restore();
};

CanvasActuator.prototype.drawMessage = function(text) {
  this.context.save();
  this.context.font = this.messageSize + 'px ' + this.font;
  this.context.fillStyle = '#fff';
  this.context.fillText(text, (this.width - this.context.measureText(text).width)/2, (this.height - this.messageSize)/2);
  this.context.restore();
};

CanvasActuator.prototype.drawHud = function(lives, score) {
  lives = Math.max(lives, 0);
  this.context.save();
  this.context.font = this.hudSize + 'px ' + this.font;
  this.context.fillStyle = '#fff';
  this.context.fillText('Score: ' + score, 4, this.hudSize);
  this.context.fillText('Lives: ' + lives, (this.width - this.context.measureText('Lives: ' + lives).width) - 4, this.hudSize);
  this.context.restore();
};
