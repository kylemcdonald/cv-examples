// get the value of a checked radio toggle
// usage: value = getRadioValue(name)
function getRadioValue(name) {
    var inputs = selectAll('input');
    for (var i = 0; i < inputs.length; i++) {
        var x = inputs[i];
        if (name == x.elt.name && x.elt.checked) {
            return x.elt.value;
        }
    }
}

// copy an array, creating a new array if necessary
// usage: dst = copyImage(src, dst)
// based on http://jsperf.com/new-array-vs-splice-vs-slice/113
function copyImage(src, dst) {
    var n = src.length;
    if (!dst || dst.length != n) {
        dst = new src.constructor(n);
    }
    while (n--) {
        dst[n] = src[n];
    }
    return dst;
}

// convert grayscale jsfeat image to p5 rgba image
// usage: dst = jsfeatToP5(src, dst)
function jsfeatToP5(src, dst) {
    if (!dst || dst.width != src.cols || dst.height != src.rows) {
        dst = createImage(src.cols, src.rows);
    }
    var n = src.data.length;
    dst.loadPixels();
    var srcData = src.data;
    var dstData = dst.pixels;
    for (var i = 0, j = 0; i < n; i++) {
        var cur = srcData[i];
        dstData[j++] = cur;
        dstData[j++] = cur;
        dstData[j++] = cur;
        dstData[j++] = 255;
    }
    dst.updatePixels();
    return dst;
}

function same(a1, a2, stride, n) {
    for (var i = 0; i < n; i += stride) {
        if (a1[i] != a2[i]) {
            return false;
        }
    }
    return true;
}

class Graph {
    constructor(historyLength, minValue, maxValue) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.historyLength = historyLength;
        this.history = new Float32Array(historyLength);
        this.index = 0;
    }

    addSample(sample) {
        this.history[this.index] = sample;
        this.index = (this.index + 1) % this.historyLength;
    }

    getNormalizedSample(offset) {
        var i = (this.index + offset) % this.historyLength;
        var range = this.maxValue - this.minValue;
        return (this.history[i] - this.minValue) / range;
    }

    draw(width, height) {
        push();
        noFill();
        strokeWeight(1);
        beginShape();
        var range = this.maxValue - this.minValue;
        for (var offset = 0; offset < this.historyLength; offset++) {
            var i = (this.index + offset) % this.historyLength;
            var x = (offset * width) / this.historyLength;
            var normalized = (this.history[i] - this.minValue) / range;
            var y = height - (normalized * height);
            vertex(x, y);
        }
        endShape();
        pop();
    }
}
