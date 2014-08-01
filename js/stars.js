var Stars = function() {
  this.positions = [];
  this.size = 2;
  this.color = '#999';
};

Stars.prototype = {
  spawn: function(num, width, height) {
    this.positions = [];
    for(var i = 0; i < num; i++) {
      this.positions.push({ x: width * (Math.random() - 0.5), y: height * (Math.random() - 0.5) });
    }
  },

  draw: function(context) {
    // context.save();
    // context.fillStyle = this.color;
    // for (var i = this.positions.length - 1; i >= 0; i--) {
    //   var cPosition = displayCoords(this.positions[i]);
    //   context.fillRect(cPosition.x, cPosition.y, this.size, this.size);
    // }
    // context.restore();
  }
};
