var capture;
var w = 640, h = 480;

function setup() {
  capture = createCapture(VIDEO);
  createCanvas(w, h);
  capture.size(w, h);
  capture.hide();
}

function draw() {
  image(capture, 0, 0, w, h);
  capture.loadPixels();
  if(capture.pixels.length > 0) { // don't forget this!
    
  }
}