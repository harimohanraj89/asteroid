var Stars = function() {
  this.positions = [];
  this.size = 0.2;
  this.color = '#999';
};

Stars.prototype.spawn = function(num, width, height) {
  this.positions = [];
  for(var i = 0; i < num; i++) {
    this.positions.push({ x: width * (Math.random() - 0.5), y: height * (Math.random() - 0.5) });
  }
};
