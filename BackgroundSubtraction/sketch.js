var capture;

function setup() {
  capture = createCapture(VIDEO);
  createCanvas(640, 480);
  capture.size(640, 480);
  capture.hide();
}

var backgroundPixels;
function resetBackground() {
  backgroundPixels = undefined;
}

function draw() {
  capture.loadPixels();
  if(capture.pixels.length > 0) { // don't forget this!
    if(!backgroundPixels) {
      backgroundPixels = copyImage(capture.pixels, backgroundPixels);
    }
    var w = capture.width, h = capture.height;
    var i = 0;
    var pixels = capture.pixels;
    var thresholdAmount = select('#thresholdAmount').value() * 255. / 100.;
    var thresholdType = getRadioValue('thresholdType');
    if(thresholdType === 'rgb') {
      for(var y = 0; y < h; y++) {
        for(var x = 0; x < w; x++) {
          pixels[i] = pixels[i] - backgroundPixels[i] > thresholdAmount ? 255 : 0; i++;
          pixels[i] = pixels[i] - backgroundPixels[i] > thresholdAmount ? 255 : 0; i++;
          pixels[i] = pixels[i] - backgroundPixels[i] > thresholdAmount ? 255 : 0; i++;
          i++; // skip alpha
        }
      }
    } else if (thresholdType === 'bw') {
      var total = 0;
      for(var y = 0; y < h; y++) {
        for(var x = 0; x < w; x++) {
          // another common type of background thresholding uses absolute difference, like this:
          // var total = Math.abs(pixels[i+0] - backgroundPixels[i+0] > thresholdAmount) || ...
          var rdiff = (pixels[i+0] - backgroundPixels[i+0] > thresholdAmount);
          var gdiff = (pixels[i+1] - backgroundPixels[i+1] > thresholdAmount);
          var bdiff = (pixels[i+1] - backgroundPixels[i+1] > thresholdAmount);
          var anydiff = rdiff || gdiff || bdiff;
          var output = 0;
          if(anydiff) {
            output = 255;
            total++;
          }
          pixels[i++] = output;
          pixels[i++] = output;
          pixels[i++] = output;
          i++; // skip alpha
        }
      }
      var n = w * h;
      var ratio = total / n;
      select('#presence').elt.innerText = int(100 * ratio); 
    } else {
      for(var y = 0; y < h; y++) {
        for(var x = 0; x < w; x++) {
          pixels[i] = pixels[i] - backgroundPixels[i]; i++;
          pixels[i] = pixels[i] - backgroundPixels[i]; i++;
          pixels[i] = pixels[i] - backgroundPixels[i]; i++;
          i++; // skip alpha
        }
      }
    }
  }
  capture.updatePixels();
  
  image(capture, 0, 0, 640, 480);
}