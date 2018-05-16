var capture;
var previousPixels;
var w = 640;
var h = 480;

function setup() {
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function() {
        console.log('capture ready.')
    });
    capture.elt.setAttribute('playsinline', '');
    capture.size(w, h);
    createCanvas(w, h);
    capture.hide();
}

function draw() {
    capture.loadPixels();
    var total = 0;
    if (capture.pixels.length > 0) { // don't forget this!
        if (!previousPixels) {
            previousPixels = copyImage(capture.pixels, previousPixels);
        } else {
            var w = capture.width,
                h = capture.height;
            var i = 0;
            var pixels = capture.pixels;
            var thresholdAmount = select('#thresholdAmount').value() * 255. / 100.;
            thresholdAmount *= 3; // 3 for r, g, b
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    // calculate the differences
                    var rdiff = Math.abs(pixels[i + 0] - previousPixels[i + 0]);
                    var gdiff = Math.abs(pixels[i + 1] - previousPixels[i + 1]);
                    var bdiff = Math.abs(pixels[i + 2] - previousPixels[i + 2]);
                    // copy the current pixels to previousPixels
                    previousPixels[i + 0] = pixels[i + 0];
                    previousPixels[i + 1] = pixels[i + 1];
                    previousPixels[i + 2] = pixels[i + 2];
                    var diffs = rdiff + gdiff + bdiff;
                    var output = 0;
                    if (diffs > thresholdAmount) {
                        output = 255;
                        total += diffs;
                    }
                    pixels[i++] = output;
                    pixels[i++] = output;
                    pixels[i++] = output;
                    // also try this:
                    // pixels[i++] = rdiff;
                    // pixels[i++] = gdiff;
                    // pixels[i++] = bdiff;
                    i++; // skip alpha
                }
            }
        }
    }
    // need this because sometimes the frames are repeated
    if (total > 0) {
        select('#motion').elt.innerText = total;
        capture.updatePixels();
        image(capture, 0, 0, 640, 480);
    }
}
