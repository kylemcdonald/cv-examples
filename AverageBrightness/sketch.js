var capture;
var w = 640,
    h = 480;

function setup() {
    capture = createCapture(VIDEO);
    createCanvas(w, h);
    capture.size(w, h);
    capture.hide();
}

function draw() {
    image(capture, 0, 0, w, h);
    capture.loadPixels();
    if (capture.pixels.length > 0) { // don't forget this!
        var h = capture.height;
        var w = capture.width;
        var total = 0;
        var n = 0;
        var i = 0;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var r = capture.pixels[i];
                total += r;
                n++;
                i += 4;
            }
        }
        var avg = int(total / n);
        select('#average').elt.innerText = avg;
        select('body').elt.style.backgroundColor = 'rgb(' + avg + ',' + avg + ',' + avg + ')';
    }
}