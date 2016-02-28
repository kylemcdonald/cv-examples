// https://github.com/kylemcdonald/AppropriatingNewTechnologies/wiki/Week-2
var capture;
var tracker
var w = 640, h = 480;

function setup() {
  capture = createCapture(VIDEO);
  createCanvas(w, h);
  capture.size(w, h);
  capture.hide();
  
  colorMode(HSB);
  
  tracker = new clm.tracker();
  tracker.init(pModel);
  tracker.start(capture.elt);
}

function draw() {
  image(capture, 0, 0, w, h);
  var positions = tracker.getCurrentPosition();

  noFill();
  stroke(255);
  beginShape();
  for (var i=0; i<positions.length; i++) {
    vertex(positions[i][0], positions[i][1]);
  }
  endShape();
  
  noStroke();
  for (var i=0; i<positions.length; i++) {
    fill(map(i, 0, positions.length, 0, 360), 50, 100);
    ellipse(positions[i][0], positions[i][1], 4, 4);
    text(i, positions[i][0], positions[i][1]);
  }
  
  if(positions.length > 0) {
    var mouthLeft = createVector(positions[44][0], positions[44][1]);
    var mouthRight = createVector(positions[50][0], positions[50][1]);
    var smile = mouthLeft.dist(mouthRight);
    // rect(20, 20, smile * 3, 20);
  }
}
