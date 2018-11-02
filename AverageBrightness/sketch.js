// https://kylemcdonald.github.io/cv-examples/

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

// [r g b a] r g b a r g b a ...
function draw() {
    image(capture, 0, 0, w, h);
    capture.loadPixels();
    if (capture.pixels.length > 0) { // don't forget this!
        var total = 0;
        var i = 0;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var redValue = capture.pixels[i];
                total += redValue;
                i += 4;
            }
        }
        var n = w * h;
        var avg = int(total / n);
        select('#average-value').elt.innerText = avg;
        select('#average-color').elt.style.backgroundColor = 'rgb(' + avg + ',' + avg + ',' + avg + ')';
    }
}
