var stars = {
  positions: [],
  size: 1,
  color: '#999',

  spawn: function(num) {
    this.positions = [];
    for(var i = 0; i < num; i++) {
      this.positions.push({ x: GWIDTH * (Math.random() - 0.5), y: GHEIGHT * (Math.random() - 0.5) });
    }
  },

  draw: function() {
    context.save();
    context.fillStyle = this.color;
    for (var i = this.positions.length - 1; i >= 0; i--) {
      var cPosition = canvasCoords(this.positions[i]);
      context.fillRect(cPosition.x, cPosition.y, this.size, this.size);
    }
    context.restore();
  }
};
