var capture;
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

var captureMat, gray, blurred, thresholded;
var contours, hierarchy;
function cvSetup() {
    captureMat = new cv.Mat([h, w], cv.CV_8UC4);
    gray = new cv.Mat([h, w], cv.CV_8UC1);
    blurred = new cv.Mat([h, w], cv.CV_8UC1);
    thresholded = new cv.Mat([h, w], cv.CV_8UC1);
}

var ready = false;
function cvReady() {
    if(!cv || !cv.loaded) return false;
    if(ready) return true;
    cvSetup();
    ready = true;
    return true;
}

function draw() {
    var showThresholded = select('#showThresholded').checked();

    if (cvReady()) {
        capture.loadPixels();
        if (capture.pixels.length > 0) {
            captureMat.data().set(capture.pixels);

            var blurRadius = select('#blurRadius').value();
            blurRadius = map(blurRadius, 0, 100, 1, 10);

            var threshold = select('#threshold').value();
            threshold = map(threshold, 0, 100, 0, 255);

            cv.cvtColor(captureMat, gray, cv.ColorConversionCodes.COLOR_RGBA2GRAY.value, 0);
            cv.blur(gray, blurred, [blurRadius, blurRadius], [-1, -1], cv.BORDER_DEFAULT);
            cv.threshold(blurred, thresholded, threshold, 255, cv.ThresholdTypes.THRESH_BINARY.value);

            if (showThresholded) {
                var src = thresholded.data();
                var dst = capture.pixels;
                var n = src.length;
                var j = 0;
                for (var i = 0; i < n; i++) {
                    dst[j++] = src[i];
                    dst[j++] = src[i];
                    dst[j++] = src[i];
                    dst[j++] = 255;
                }
                capture.updatePixels();
            }

            contours = new cv.MatVector();
            hierarchy = new cv.Mat();
            cv.findContours(thresholded, contours, hierarchy, 3, 2, [0, 0]);
        }
    }

    image(capture, 0, 0, w, h);

    if (contours && !showThresholded) {
        noStroke();
        for (var i = 0; i < contours.size(); i++) {
            fill(0, 0, 255, 128);
            var contour = contours.get(i);
            beginShape();
            var k = 0;
            for (var j = 0; j < contour.total(); j++) {
                var x = contour.get_int_at(k++);
                var y = contour.get_int_at(k++);
                vertex(x, y);
            }
            endShape(CLOSE);

            noFill();
            stroke(255, 255, 255)
            var box = cv.boundingRect(contour);
            rect(box.x, box.y, box.width, box.height);

            // these aren't working right now:
            // https://github.com/ucisysarch/opencvjs/issues/30
//            var minAreaRect = cv.minAreaRect(contour);
//            var minAreaEllipse = cv.ellipse1(contour);
//            var fitEllipse = cv.fitEllipse(contour);
        }
    }
}
