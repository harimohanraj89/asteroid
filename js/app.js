var PI = Math.PI || 3.14159265;

window.onload = function() {
  console.log('Asteroid - A tribute');
  var game = new Game(
    new KeyboardInputManager(),
    new CanvasActuator(document.getElementById('game-canvas'))
  );
  game.tick();
}
