var DomController = function() {

};

DomController.prototype = {
  register: function(action, callback, self) {
    window.addEventListener(action, function(e) {
      if (self) {
        callback.call(self, e);
      } else {
        callback.call(this, e);
      }
    });
  }
}
