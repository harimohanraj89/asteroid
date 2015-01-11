var Positionable = {
  attributes: {
    position: {
      x: 0,
      y: 0
    }
  },

  behaviors: {
    x: function() {
      return this.position.x;
    },

    y: function() {
      return this.position.y;
    },

    wrapPosition: function(width, height) {
      while (this.position.x > width/2) this.position.x -= width;
      while (this.position.x < -width/2) this.position.x += width;
      while (this.position.y > height/2) this.position.y -= height;
      while (this.position.y < -height/2) this.position.y += height;
    },

    updatePosition: function(dt) {
      var dx = this.velocity.x * dt / 1000;
      var dy = this.velocity.y * dt / 1000;

      this.position.x += dx;
      this.position.y += dy;
      return { dx: dx, dy: dy };
    },

    beforeUpdate: function() {},

    afterUpdate: function() {},

    update: function(dt, width, height) {
      this.beforeUpdate();
      var deltas = this.updatePosition(dt);
      this.wrapPosition(width, height);
      this.afterUpdate({
        dt: dt,
        width: width,
        height: height,
        deltas: deltas
      });
    }
  }
}
