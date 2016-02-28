var capture;
var tracker;
var w = 640, h = 480;

function setup() {
  capture = createCapture(VIDEO);
  createCanvas(w, h);
  capture.size(w, h);
  // capture.hide();
  
  capture.elt.id = 'p5video';
  tracker = new tracking.ColorTracker(['yellow']);
  tracking.track('#p5video', tracker, { camera: true });
  tracker.on('track', function(event) {
    stroke(0);
    noFill();
    event.data.forEach(function(r) {
      rect(r.x, r.y, r.width, r.height);
    })
  });
}

function draw() {
  // image(capture, 0, 0, w, h);
  capture.loadPixels();
  if(capture.pixels.length > 0) { // don't forget this!
  }
}