// sign up for an account here:
// https://developer.clarifai.com/accounts/signup/
// confirm your account via email.
// go this url and click "create a new application":
// https://developer.clarifai.com/applications/
// paste the info into the two fields below:
var clientId = "";
var clientSecret = "";

var accessToken;
function getAccessToken() {
  $.ajax({
    method: 'POST',
    url: 'https://api.clarifai.com/v1/token/',
    data: {
      'grant_type': 'client_credentials',
      'client_id': clientId,
      'client_secret': clientSecret
    }
  })
  .done(function(data) {
    accessToken = data.access_token;
  });
}
getAccessToken();

function tagUrl(url, cb) {
  $.ajax({
    url: 'https://api.clarifai.com/v1/tag/?url=' + url,
    headers: { 'Authorization': 'Bearer ' + accessToken }
  })
  .done(function(data) {
    cb(data.results[0].result.tag);
  });
}

function tagCanvas(cnv, cb) {
  cnv.toBlob(function(blob) {
    var fd = new FormData();
    fd.append('encoded_data', blob);
    $.ajax({
      type: 'POST',
      url: 'https://api.clarifai.com/v1/tag/',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      data: fd,
      processData: false,
      contentType: false
    }).done(function(data) {
      cb(data.results[0].result.tag);
    });
  }, 'image/jpeg');
}

function tagMedia(media, cb) {
  // on retina devices creates a double-sized buffer
  var buffer = createGraphics(media.width, media.height);
  buffer.image(media, 0, 0);
  tagCanvas(buffer.elt, cb);
}
