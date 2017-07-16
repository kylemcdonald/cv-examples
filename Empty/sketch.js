var capture;
var w = 640,
    h = 480;

function setup() {
    capture = createCapture(VIDEO);
    capture.hide();
    capture.size(w, h);
    createCanvas(w, h);
}

function draw() {
    image(capture, 0, 0, w, h);
    capture.loadPixels();
    if (capture.pixels.length > 0) { // don't forget this!
    }
}
