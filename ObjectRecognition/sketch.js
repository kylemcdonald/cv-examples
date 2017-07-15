var capture;
var results;
var w = 640,
    h = 480;

function setup() {
    capture = createCapture(VIDEO);
    createCanvas(w, h);
    capture.size(w, h);
    capture.hide();
    textAlign(LEFT, TOP);

    // add your credentials here
    // to load on startup
    setupClarifai(
        '', // clientId
        '' // clientSecret
    );
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
