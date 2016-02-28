var capture;
var results;
var w = 640, h = 480;

function setup() {
  capture = createCapture(VIDEO);
  createCanvas(w, h);
  capture.size(w, h);
  capture.hide();
  textAlign(LEFT, TOP);
}

function draw() {
  image(capture, 0, 0, w, h);
  if(results) {
    var n = results.classes.length;
    translate(10, 10);
    var barWidth = 200;
    for(var i = 0; i < n; i++) {
      var probability = results.probs[i];
      var category = results.classes[i];
      rect(0, 0, probability * barWidth, 18);
      text(category, 2, 2);
      translate(0, 20);
    }
  }
}

function sendPhoto() {
  tagMedia(capture, function(tag) {
    results = tag;
  })
}