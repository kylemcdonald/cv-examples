// sign up for an account here:
// https://developer.clarifai.com/accounts/signup/
// confirm your account via email.
// go this url and click "create a new application":
// https://developer.clarifai.com/applications/
// if you don't set a language, your browser might set
// "Accept-Language" headers on your behalf.

var app;

function setupClarifai(apiKey) {
    if (!apiKey) {
        console.warn('setupClarifai(apiKey): ' +
            'Empty arguments. First create an account at https://developer.clarifai.com/accounts/signup/ and ' +
            'click "Create API Key" at https://developer.clarifai.com/applications/ then ' +
            'call setupClarifai() with the API Key before tagging images.');
        return;
    }
    app = new Clarifai.App({
        apiKey: apiKey
    });
}

function tagUrl(url, cb, language) {
    if (language) {
        headers['Accept-Language'] = language;
    }
    app.models.predict(Clarifai.GENERAL_MODEL, url).then(
        function (response) {
            console.log(response);
            cb(response.outputs[0].data.concepts);
        },
        function (err) {
            console.error(err);
        }
    );
}

function canvasToBase64(cnv, imageType, cb) {
    cnv.toBlob(function (blob) {
        var reader = new window.FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            var base64data = reader.result.split(',')[1];
            cb(base64data);
        }
    }, imageType);
}

function tagCanvas(cnv, cb, language) {
    canvasToBase64(cnv, 'image/jpeg', function (data) {
        app.models.predict(Clarifai.GENERAL_MODEL, {
            base64: data
        }).then(
            function (response) {
                console.log(response);
                cb(response.outputs[0].data.concepts);
            },
            function (err) {
                console.error(err);
            }
        );
    });
}

function tagMedia(media, cb, language) {
    // on retina devices creates a double-sized buffer
    var buffer = createGraphics(media.width, media.height);
    buffer.image(media, 0, 0);
    tagCanvas(buffer.elt, cb, language);
}