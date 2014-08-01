function initInput() {
  window.addEventListener('keydown', keydown);
  window.addEventListener('keyup', keyup);
}

var eventmap = {
  87: 'up',
  38: 'up',
  65: 'left',
  37: 'left',
  83: 'down',
  40: 'down',
  68: 'right',
  39: 'right',
  32: 'shoot',
}

function keydown(e) {
  if (eventmap[e.which]) {
    window.dispatchEvent(new Event(eventmap[e.which] + 'Press'));
  }
}

function keyup(e) {
  if (eventmap[e.which]) {
    window.dispatchEvent(new Event(eventmap[e.which] + 'Release'));
  }
}
