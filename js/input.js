function initInput() {
  window.addEventListener('keydown', keydown);
  window.addEventListener('keyup', keyup);
}

function keydown(e) {
  console.log(e.which);
  switch(e.which) {
  case 87: // w
  case 38: // up
    upPress();
    e.preventDefault();
    break;
  case 65: // a
  case 37: // left
    leftPress();
    e.preventDefault();
    break;
  case 83: // s
  case 40: // down
    // down();
    e.preventDefault();
    break;
  case 68: // d
  case 39: // right
    rightPress();
    e.preventDefault();
    break;
  case 32: // space
    console.log('shoot');
    e.preventDefault();
    break;

  }
}

function keyup(e) {
  console.log(e.which);
  switch(e.which) {
  case 87: // w
  case 38: // up
    upRelease();
    e.preventDefault();
    break;
  case 65: // a
  case 37: // left
    leftRelease();
    e.preventDefault();
    break;
  case 83: // s
  case 40: // down
    // down();
    e.preventDefault();
    break;
  case 68: // d
  case 39: // right
    rightRelease();
    e.preventDefault();
    break;
  case 32: // space
    console.log('shoot');
    e.preventDefault();
    break;

  }
}

function upPress() {
  ship.thrustOn();
}

function leftPress() {
  ship.rotLeftOn();
}

function rightPress() {
  ship.rotRightOn();
}

function upRelease() {
  ship.thrustOff();
}

function leftRelease() {
  ship.rotLeftOff();
}

function rightRelease() {
  ship.rotRightOff();
}
