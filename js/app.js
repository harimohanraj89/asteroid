var PI = Math.PI || 3.14159265;

window.onload = function() {
  console.log('Asteroid - A tribute');
  var game = new Game({
    inputMgr: new KeyboardInputManager(),
    actuator: new CanvasActuator(document.getElementById('game-canvas')),
    collider: new Collider()
  });
  game.tick();
}
