var PI = Math.PI || 3.14159265;

window.onload = function() {
  console.log('Asteroid - A tribute');

  var canvas = document.getElementById('game-canvas');

  var game = new Game(new KeyboardInputManager(), new CanvasActuator(canvas));
  window.requestAnimationFrame(function() {
    game.tick();
  });
}
