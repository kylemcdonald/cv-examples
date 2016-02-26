var capture;

function setup() {
  capture = createCapture(VIDEO);
  createCanvas(640, 480);
  capture.size(640, 480);
  capture.hide();
}

function findBrightest(video) {
  var w = video.width, h = video.height;
  var brightestValue = 0;
  var brightestPosition = createVector(0, 0);
  var pixels = video.pixels;
  var i = 0;
  for(var y = 0; y < h; y++) {
    for(var x = 0; x < w; x++) {
      var r = pixels[i++];
      var g = pixels[i++];
      var b = pixels[i++];
      i++; // ignore a
      var brightness = r + g + b;
      if(brightness > brightestValue) {
        brightestValue = brightness;
        brightestPosition.set(x, y);
      }
    }
  }
  return brightestPosition;
}

var lastPoint;
function smoothPoint(point, amt) {
  if(!lastPoint) {
    lastPoint = point;
  } else {
    lastPoint.lerp(point, amt);
  }
  return lastPoint.copy();
}

var trailPointsLength = 100;
var trailPoints = [];
function drawTrail(nextPoint) {
  trailPoints.push(nextPoint);
  if(trailPoints.length > trailPointsLength) {
    trailPoints.shift();
  }
  beginShape();
  trailPoints.forEach(function (point) {
    vertex(point.x, point.y);
  })
  endShape();
}

function clearTrail() {
  trailPoints = [];
}

function draw() {
  // this acts as a background() or clear()
  image(capture, 0, 0, 640, 480);

  capture.loadPixels();
  if(capture.pixels.length > 0) { // don't forget this!
    var brightest = findBrightest(capture);
    var lerpAmount = select("#lerpAmount").value() / 100.;
    var smoothed = smoothPoint(brightest, lerpAmount);

    var radius = 8;
    noStroke();
    fill(255, 0, 0);
    ellipse(smoothed.x, smoothed.y, radius, radius);

    noFill();
    stroke(0, 255, 0);
    drawTrail(smoothed);
  }
}