window.onload = function() {
  console.log('Asteroid - A tribute');

  var canvas = document.getElementById('game-canvas');
  var context = canvas.getContext('2d');
  canvas.width = CWIDTH;
  canvas.height = CHEIGHT;

  initInput();

  var game = new Game(context);
  window.requestAnimationFrame(function() {
    game.tick();
  });
}
