// more here:
// http://fhtr.org/JSARToolKit/demos/tests/test2.html
var capture;
var w = 640, h = 480;

var raster, param, pmat, resultMat, detector;

function setup() {
  pixelDensity(1); // this makes the internal canvas smaller 
  capture = createCapture(VIDEO);
  createCanvas(w, h);
  capture.size(w, h);
  capture.hide();
  
  raster = new NyARRgbRaster_Canvas2D(canvas);
  param = new FLARParam(canvas.width, canvas.height);
  pmat = mat4.identity();
  param.copyCameraMatrix(pmat, 100, 10000);
  resultMat = new NyARTransMatResult();
  detector = new FLARMultiIdMarkerDetector(param, 2);
  detector.setContinueMode(true);
}

function draw() {
  image(capture, 0, 0, w, h);
  canvas.changed = true;
  var thresholdAmount = 128;//select('#thresholdAmount').value() * 255 / 100;
  detected = detector.detectMarkerLite(raster, thresholdAmount);
  select('#markersDetected').elt.innerText = detected;
  if(detected > 0) {
      for (var i = 0; i < detected; i++) {
        // read data from the marker
        // var id = detector.getIdMarkerData(i);
        
        // get the transformation for this marker
        detector.getTransformMatrix(i, resultMat);
        
        // convert the transformation to account for our camera
        var mat = resultMat;
        var cm = mat4.create();
        cm[0] = mat.m00, cm[1] = -mat.m10, cm[2] = mat.m20, cm[3] = 0;
        cm[4] = mat.m01, cm[5] = -mat.m11, cm[6] = mat.m21, cm[7] = 0;
        cm[8] = -mat.m02, cm[9] = mat.m12, cm[10] = -mat.m22, cm[11] = 0;
        cm[12] = mat.m03, cm[13] = -mat.m13, cm[14] = mat.m23, cm[15] = 1;
        mat4.multiply(pmat, cm, cm);
        
        // define a set of 3d vertices
        var verts = [
          vec4.create(-1, -1, 0, 1),
          vec4.create(1, -1, 0, 1),
          vec4.create(1, 1, 0, 1),
          vec4.create(-1, 1, 0, 1),
          // vec4.create(0, 0, -2, 1) // poke up
        ];
        
        // convert that set of vertices from object space to screen space
        var w2 = width / 2, h2 = height / 2;
        verts.forEach(function(v) {
          mat4.multiplyVec4(cm, v);
          v[0] = v[0] * w2 / v[3] + w2;
          v[1] = -v[1] * h2 / v[3] + h2;
        });
          
        noStroke();
        fill(0, millis() % 255);
        beginShape();
        verts.forEach(function(v) {
          vertex(v[0], v[1]);
        });
        endShape();
      }
  }
}
