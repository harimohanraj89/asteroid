window.onload = function() {
  console.log('Asteroid - A tribute');

  canvas = document.getElementById('game-canvas');
  context = canvas.getContext('2d');
  canvas.width = CWIDTH;
  canvas.height = CHEIGHT;

  initInput();

  stars.spawn(50);
  stars.draw();
  ship.draw();

  window.requestAnimationFrame(draw);
}

function draw() {
  context.fillRect(0, 0, CWIDTH, CHEIGHT);
  stars.draw();
  ship.update();
  ship.draw();
  window.requestAnimationFrame(draw);
}
