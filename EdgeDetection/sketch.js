// https://inspirit.github.io/jsfeat/sample_canny_edge.html

var capture;
var buffer;
var result;
var w = 640, h = 480;

function setup() {
  capture = createCapture(VIDEO);
  createCanvas(w, h);
  capture.size(w, h);
  capture.hide();
  buffer = new jsfeat.matrix_t(w, h, jsfeat.U8C1_t);
}

function draw() {
  image(capture, 0, 0, 640, 480);
  capture.loadPixels();
  if(capture.pixels.length > 0) { // don't forget this!
    var blurSize = 6;
    var lowThreshold = 20;
    var highThreshold = 50;
    jsfeat.imgproc.grayscale(capture.pixels, w, h, buffer);
    jsfeat.imgproc.gaussian_blur(buffer, buffer, blurSize, 0);
    jsfeat.imgproc.canny(buffer, buffer, lowThreshold, highThreshold);
    result = jsfeatToP5(buffer, result);
    image(result, 0, 0, 640, 480);
  }
}