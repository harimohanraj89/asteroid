window.onload = function() {
  console.log('Asteroid - A tribute');

  var canvas = document.getElementById('game-canvas');
  var context = canvas.getContext('2d');
  canvas.width = CWIDTH;
  canvas.height = CHEIGHT;

  var game = new Game(context, new KeyboardInputManager());
  window.requestAnimationFrame(function() {
    game.tick();
  });
}
