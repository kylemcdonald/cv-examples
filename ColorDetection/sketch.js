var capture;
var targetColor = [255,255,255];

function setup() {
  capture = createCapture(VIDEO);
  cnv = createCanvas(640, 480);
  capture.size(640, 480);
  capture.hide();
}

function draw() {
  capture.loadPixels();
  var sampling = false;
  if(capture.pixels.length > 0) { // don't forget this!
  
    if(mouseIsPressed &&
        mouseX > 0 && mouseX < width &&
        mouseY > 0 && mouseY < height) {
      targetColor = capture.get(mouseX, mouseY);
      sampling = true;
    }
  
    var w = capture.width, h = capture.height;
    var i = 0;
    var pixels = capture.pixels;
    var thresholdAmount = select('#thresholdAmount').value();
    thresholdAmount /= 100.; // this is the slider range
    thresholdAmount *= 255 * 3; // this is the maximum value
    var total = 0;
    for(var y = 0; y < h; y++) {
      for(var x = 0; x < w; x++) {
        var diff =
          Math.abs(pixels[i+0] - targetColor[0]) +
          Math.abs(pixels[i+1] - targetColor[1]) + 
          Math.abs(pixels[i+2] - targetColor[2]);
        var outputValue = 0;
        if (diff < thresholdAmount) {
          outputValue = 255;
          total++;
        }
        pixels[i++] = outputValue; // set red
        pixels[i++] = outputValue; // set green
        pixels[i++] = outputValue; // set blue
        i++; // skip alpha
      }
    }
    
    var n = w * h;
    var ratio = total / n;
    select('#percentWhite').elt.innerText = int(100 * ratio);
  }
  if(!sampling) {
    capture.updatePixels();
  }
  
  image(capture, 0, 0, 640, 480);
  
  noStroke();
  fill(targetColor);
  rect(20, 20, 40, 40);
}