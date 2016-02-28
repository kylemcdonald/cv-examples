var capture;
var tracker;

var rhi, ghi, bhi;
var rlo, glo, blo;
function setTarget(r, g, b, range) {
  range = range || 32;
  rhi = r + range, rlo = r - range;
  ghi = g + range, glo = g - range;
  bhi = b + range, blo = b - range;
}

function setup() {
  var w = 640, h = 480;
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.parent('container');
  cnv = createCanvas(w, h);
  cnv.parent('container');
  // capture.hide(); // tracking.js can't track the video when it's hidden
  
  setTarget(255, 255, 255); // by default track white
  tracking.ColorTracker.registerColor('match', function(r, g, b) {
    if(r <= rhi && r >= rlo &&
       g <= ghi && g >= glo &&
       b <= bhi && b >= blo) {
      return true;
    }
    return false;
  });
  tracker = new tracking.ColorTracker(['match']);
  tracker.minDimension = 20; // make this smaller to track smaller objects
  capture.elt.id = 'p5video';
  tracking.track('#p5video', tracker, { camera: true });
  tracker.on('track', function(event) {
    clear();
    strokeWeight(4);
    stroke(255, 0, 0);
    noFill();
    event.data.forEach(function(r) {
      rect(r.x, r.y, r.width, r.height);
    })
  });
}

function draw() {
  if(mouseIsPressed &&
    mouseX > 0 && mouseX < width &&
    mouseY > 0 && mouseY < height) {
    capture.loadPixels();
    target = capture.get(mouseX, mouseY);
    setTarget(target[0], target[1], target[2]);
  }
}
