// sign up for an account here:
// https://developer.clarifai.com/accounts/signup/
// confirm your account via email.
// go this url and click "create a new application":
// https://developer.clarifai.com/applications/
// if you don't set a language, your browser might set
// "Accept-Language" headers on your behalf.

var accessToken;
function setupClarifai(clientId, clientSecret) {
  if(!clientId || !clientSecret) {
    console.warn('setupClarifai(clientId, clientSecret): ' +
      'Empty arguments. First create an account at https://developer.clarifai.com/accounts/signup/ and '+
      'add an application at https://developer.clarifai.com/applications/ then ' +
      'call setupClarifai() with credentials before tagging images.');
    return;
  }
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
    console.log(data);
  });
}

function tagUrl(url, cb, language) {
  var headers = { 'Authorization': 'Bearer ' + accessToken };
  if(language) {
    headers['Accept-Language'] = language;
  }
  $.ajax({
    url: 'https://api.clarifai.com/v1/tag/?url=' + url,
    headers: headers
  })
  .done(function(data) {
    cb(data.results[0].result.tag);
  });
}

function tagCanvas(cnv, cb, language) {
  cnv.toBlob(function(blob) {
    var fd = new FormData();
    fd.append('encoded_data', blob);
    var headers = { 'Authorization': 'Bearer ' + accessToken };
    if(language) {
      headers['Accept-Language'] = language;
    }
    $.ajax({
      type: 'POST',
      url: 'https://api.clarifai.com/v1/tag/',
      headers: headers,
      data: fd,
      processData: false,
      contentType: false
    }).done(function(data) {
      cb(data.results[0].result.tag);
    });
  }, 'image/jpeg');
}

function tagMedia(media, cb, language) {
  // on retina devices creates a double-sized buffer
  var buffer = createGraphics(media.width, media.height);
  buffer.image(media, 0, 0);
  tagCanvas(buffer.elt, cb, language);
}
