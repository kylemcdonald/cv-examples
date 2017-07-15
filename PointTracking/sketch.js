// https://inspirit.github.io/jsfeat/sample_oflow_lk.html

var cnv;
var capture;
var curpyr, prevpyr, pointCount, pointStatus, prevxy, curxy;
var w = 640,
    h = 480;
var maxPoints = 1000;

function setup() {
    capture = createCapture(VIDEO);
    cnv = createCanvas(w, h);
    capture.size(w, h);
    capture.hide();

    curpyr = new jsfeat.pyramid_t(3);
    prevpyr = new jsfeat.pyramid_t(3);
    curpyr.allocate(w, h, jsfeat.U8_t | jsfeat.C1_t);
    prevpyr.allocate(w, h, jsfeat.U8_t | jsfeat.C1_t);

    pointCount = 0;
    pointStatus = new Uint8Array(maxPoints);
    prevxy = new Float32Array(maxPoints * 2);
    curxy = new Float32Array(maxPoints * 2);
}

function keyPressed(key) {
    for (var i = 0; i < 100; i++) {
        addPoint(random(width), random(height));
    }
}

function mousePressed() {
    addPoint(mouseX, mouseY);
}

function addPoint(x, y) {
    if (pointCount < maxPoints) {
        var pointIndex = pointCount * 2;
        curxy[pointIndex] = x;
        curxy[pointIndex + 1] = y;
        pointCount++;
    }
}

function prunePoints() {
    var outputPoint = 0;
    for (var inputPoint = 0; inputPoint < pointCount; inputPoint++) {
        if (pointStatus[inputPoint] == 1) {
            if (outputPoint < inputPoint) {
                var inputIndex = inputPoint * 2;
                var outputIndex = outputPoint * 2;
                curxy[outputIndex] = curxy[inputIndex];
                curxy[outputIndex + 1] = curxy[inputIndex + 1];
            }
            outputPoint++;
        }
    }
    pointCount = outputPoint;
}

function draw() {
    image(capture, 0, 0, w, h);
    capture.loadPixels();
    if (capture.pixels.length > 0) { // don't forget this!
        var xyswap = prevxy;
        prevxy = curxy;
        curxy = xyswap;
        var pyrswap = prevpyr;
        prevpyr = curpyr;
        curpyr = pyrswap;

        // these are options worth breaking out and exploring
        var winSize = 20;
        var maxIterations = 30;
        var epsilon = 0.01;
        var minEigen = 0.001;

        jsfeat.imgproc.grayscale(capture.pixels, w, h, curpyr.data[0]);
        curpyr.build(curpyr.data[0], true);
        jsfeat.optical_flow_lk.track(
            prevpyr, curpyr,
            prevxy, curxy,
            pointCount,
            winSize, maxIterations,
            pointStatus,
            epsilon, minEigen);
        prunePoints();

        for (var i = 0; i < pointCount; i++) {
            var pointOffset = i * 2;
            ellipse(curxy[pointOffset], curxy[pointOffset + 1], 8, 8);
        }
    }
}