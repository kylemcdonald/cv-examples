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
    capture.hide();
    capture.size(w, h);
    canvas = createCanvas(w, h);
}

function findBrightest(video) {
    var brightestValue = 0;
    var brightestPosition = createVector(0, 0);
    var pixels = video.pixels;
    var i = 0;
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var r = pixels[i++];
            var g = pixels[i++];
            var b = pixels[i++];
            i++; // ignore a
            var brightness = r + g + b;
            if (brightness > brightestValue) {
                brightestValue = brightness;
                brightestPosition.set(x, y);
            }
        }
    }
    return brightestPosition;
}

var lastPoint;
function smoothPoint(point, amt) {
    if (!lastPoint) {
        lastPoint = point;
    } else {
        lastPoint.lerp(point, 1 - amt);
    }
    return lastPoint.copy();
}

var trailPointsLength = 100;
var trailPoints = [];
function drawTrail(nextPoint) {
    trailPoints.push(nextPoint);
    if (trailPoints.length > trailPointsLength) {
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

var anotherLastPoint;
function draw() {
    // this acts as a background() or clear()
    image(capture, 0, 0, 640, 480);

    capture.loadPixels();
    if (capture.pixels.length > 0) { // don't forget this!
        var brightest = findBrightest(capture);

        // first step to try: uncomment the line below to enable smoothing
        var smoothingAmount = select("#smoothingAmount").value() / 100.0;
//        brightest = smoothPoint(brightest, smoothingAmount);

        // next step to try: ignore points that are too far from current point
        if (anotherLastPoint) {
            var dist = anotherLastPoint.dist(brightest);
            if (dist > 30) {
//                brightest = anotherLastPoint;
            }
        }

        var radius = 8;
        noStroke();
        fill(255, 0, 0);
        ellipse(brightest.x, brightest.y, radius, radius);

        noFill();
        strokeWeight(4);
        stroke(255, 0, 0);
        drawTrail(brightest);

        anotherLastPoint = brightest.copy();
    }
}
