window.requestAnimationFrame = window.requestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.msRequestAnimationFrame;

function canvasCoords(absLocation) {
  return {
    x: (absLocation.x + GWIDTH/2) * C, // multiplier is width of canvas
    y: (absLocation.y + GHEIGHT/2) * C, // multiplier is height of canvas
  };
}

var canvas;
var context;
var C = 8;
var CWIDTH = 800;
var CHEIGHT = 600;
var GWIDTH = CWIDTH / C;
var GHEIGHT = CHEIGHT / C;
var DT = 0.002;
var PI = Math.PI || 3.14159265;
