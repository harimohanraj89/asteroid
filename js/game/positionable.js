var Positionable = {
  attributes: {
    position: {
      x: 0,
      y: 0
    },

    velocity: {
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

    setX: function(x) {
      this.position.x = x;
    },

    setY: function(y) {
      this.position.y = y;
    },

    plusX: function(dx) {
      this.position.x += dx;
    },

    plusY: function(dy) {
      this.position.y += dy;
    },

    vx: function() {
      return this.velocity.x;
    },

    vy: function() {
      return this.velocity.y;
    },

    plusVx: function(dVx) {
      this.velocity.x += dVx;
    },

    plusVy: function(dVy) {
      this.velocity.y += dVy;
    },

    wrapPosition: function(width, height) {
      while (this.x() > width/2) this.plusX(-width);
      while (this.x() < -width/2) this.plusX(width);
      while (this.y() > height/2) this.plusY(-height);
      while (this.y() < -height/2) this.plusY(height);
    },

    updatePosition: function(dt) {
      var dx = this.vx() * dt / 1000;
      var dy = this.vy() * dt / 1000;

      this.plusX(dx);
      this.plusY(dy);
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
