var Stars = function() {
  this.positions = [];
  this.size = 2;
  this.color = '#999';
  this.spawn(50);
};

Stars.prototype = {
  spawn: function(num) {
    this.positions = [];
    for(var i = 0; i < num; i++) {
      this.positions.push({ x: GWIDTH * (Math.random() - 0.5), y: GHEIGHT * (Math.random() - 0.5) });
    }
  },

  draw: function(context) {
    context.save();
    context.fillStyle = this.color;
    for (var i = this.positions.length - 1; i >= 0; i--) {
      var cPosition = displayCoords(this.positions[i]);
      context.fillRect(cPosition.x, cPosition.y, this.size, this.size);
    }
    context.restore();
  }
};
