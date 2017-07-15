var capture;
var motionHistoryImage;

function setup() {
    var w = 640,
        h = 480;
    capture = createCapture(VIDEO);
    createCanvas(w, h);
    capture.size(w, h);
    capture.hide();
}

var backgroundPixels;

function resetBackground() {
    backgroundPixels = undefined;
}

function draw() {
    image(capture, 0, 0);
    capture.loadPixels();
    if (capture.pixels.length > 0) { // don't forget this!
        var w = capture.width,
            h = capture.height;
        if (!backgroundPixels) {
            // copy the camera pixels for storing the background
            backgroundPixels = copyImage(capture.pixels, backgroundPixels);
            // make a grayscale image for storing the motion history
            motionHistoryImage = new Uint8ClampedArray(w * h);
        }
        var pixels = capture.pixels;
        var thresholdAmount = select('#thresholdAmount').value() / 100;
        var sumSquaredThreshold = thresholdAmount * (255 * 255) * 3;
        var iRgb = 0,
            iGray = 0;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var rdiff = pixels[iRgb + 0] - backgroundPixels[iRgb + 0];
                var gdiff = pixels[iRgb + 1] - backgroundPixels[iRgb + 1];
                var bdiff = pixels[iRgb + 2] - backgroundPixels[iRgb + 2];
                var sumSquaredDiff = rdiff * rdiff + gdiff * gdiff + bdiff * bdiff;
                // if this is a foreground pixel
                if (sumSquaredDiff > sumSquaredThreshold) {
                    // set the motion history image to white
                    motionHistoryImage[iGray] = 255;
                } else {
                    // otherwise make it fade towards black
                    motionHistoryImage[iGray]--;
                }
                var output = motionHistoryImage[iGray];
                pixels[iRgb++] = output;
                pixels[iRgb++] = output;
                pixels[iRgb++] = output;
                iRgb++; // skip alpha in rgbindex
                iGray++; // next grayscale index
            }
        }

        // some parameters for calculating the motion vectors
        var stepSize = 16;
        var radius = 8;
        var maximumDiff = 8; // ignore big "motion edges"
        var minimumValue = 245; // ignore very old values
        var arrowWidth = .25;
        stroke(255);
        noFill();

        // pre-calculate some values outside the loop
        var upOffset = -radius * w;
        var downOffset = +radius * w;
        var leftOffset = -radius;
        var rightOffset = +radius;
        var maximumLength = Math.sqrt(maximumDiff * maximumDiff * 2);
        for (var y = radius; y + radius < h; y += stepSize) {
            for (var x = radius; x + radius < w; x += stepSize) {
                var i = y * w + x;
                var center = motionHistoryImage[i];
                var dx = 0,
                    dy = 0;
                if (center > minimumValue) {
                    var up = motionHistoryImage[i + upOffset];
                    var down = motionHistoryImage[i + downOffset];
                    var left = motionHistoryImage[i + leftOffset];
                    var right = motionHistoryImage[i + rightOffset];
                    dx = right - left;
                    dy = down - up;
                    // ignore big "motion edges"
                    if (dx > maximumDiff || dy > maximumDiff ||
                        -dx > maximumDiff || -dy > maximumDiff) {
                        dx = 0, dy = 0;
                    } else {
                        // big changes are slow motion, small changes are fast motion
                        var length = Math.sqrt(dx * dx + dy * dy);
                        var rescale = (maximumLength - length) / length;
                        dx *= rescale;
                        dy *= rescale;
                    }
                }
                line(x + dx, y + dy, x - arrowWidth * dy, y + arrowWidth * dx);
                line(x + dx, y + dy, x + arrowWidth * dy, y - arrowWidth * dx);
            }
        }
    }

    // uncomment to view the raw motion history image
    // capture.updatePixels();
    // image(capture, 0, 0, 640, 480);
}
