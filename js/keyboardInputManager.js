var KeyboardInputManager = function() {
  this.eventmap = {
    87: 'up',
    38: 'up',
    65: 'left',
    37: 'left',
    83: 'down',
    40: 'down',
    68: 'right',
    39: 'right',
    32: 'shoot'
  }
}

KeyboardInputManager.prototype = {
  init: function() {
    window.addEventListener('keydown', this.keydown.bind(this));
    window.addEventListener('keyup', this.keyup.bind(this));
  },

  keydown: function(e) {
    console.log(e.which);
    if (this.eventmap[e.which]) {
      e.preventDefault();
      window.dispatchEvent(new Event(this.eventmap[e.which] + 'Press'));
    }
  },

  keyup: function(e) {
    if (this.eventmap[e.which]) {
      window.dispatchEvent(new Event(this.eventmap[e.which] + 'Release'));
    }
  }
}
