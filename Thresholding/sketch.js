var capture;

function setup() {
  capture = createCapture(VIDEO);
  createCanvas(640, 480);
  capture.size(640, 480);
  capture.hide();
}

function draw() {
  capture.loadPixels();
  if(capture.pixels.length > 0) { // don't forget this!
    var w = capture.width, h = capture.height;
    var i = 0;
    var pixels = capture.pixels;
    var thresholdAmount = select('#thresholdAmount').value();
    thresholdAmount /= 100.; // this is the slider range
    thresholdAmount *= 255; // this is the maximum value
    var total = 0;
    for(var y = 0; y < h; y++) {
      for(var x = 0; x < w; x++) {
        var redValue = pixels[i];
        var outputValue = 0;
        if (redValue > thresholdAmount) {
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
  capture.updatePixels();
  
  image(capture, 0, 0, 640, 480);
}