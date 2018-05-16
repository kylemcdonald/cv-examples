var capture;
var results;
var w = 640,
    h = 480;

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
    createCanvas(w, h);
    capture.size(w, h);
    capture.hide();
    textAlign(LEFT, TOP);

    // add your API key here
    // to load on startup
    setupClarifai('');
}

function draw() {
    image(capture, 0, 0, w, h);
    if (results) {
        var n = results.length;
        translate(10, 10);
        var barWidth = 200;
        for (var i = 0; i < n; i++) {
            var value = results[i].value;
            var name = results[i].name;
            rect(0, 0, value * barWidth, 18);
            text(name, 2, 2);
            translate(0, 20);
        }
    }
}

function sendPhoto() {
    tagMedia(capture, function (tag) {
        results = tag;
    }, 'en'); // try changing the language
    console.log('Sent photo...');
}
