window.requestAnimationFrame = window.requestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.msRequestAnimationFrame;

function displayScale(value) {
  return C * value;
}

function displayCoords(absLocation) {
  return {
    x: (absLocation.x + GWIDTH/2) * C, // multiplier is width of canvas
    y: (absLocation.y + GHEIGHT/2) * C, // multiplier is height of canvas
  };
}

var C = 8;
var CWIDTH = 800;
var CHEIGHT = 600;
var GWIDTH = CWIDTH / C;
var GHEIGHT = CHEIGHT / C;
var PI = Math.PI || 3.14159265;
