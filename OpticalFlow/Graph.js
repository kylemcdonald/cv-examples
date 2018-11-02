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
