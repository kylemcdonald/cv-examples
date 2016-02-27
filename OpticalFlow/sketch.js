// https://inspirit.github.io/jsfeat/sample_oflow_lk.html

var cnv;
var capture;
var curr_img_pyr, prev_img_pyr, point_count, point_status, prev_xy, curr_xy;
var w = 640, h = 480;

function setup() {
  capture = createCapture(VIDEO);
  cnv = createCanvas(w, h);
  capture.size(w, h);
  capture.hide();
  
  cnv.mousePressed(function() {
    curr_xy[point_count<<1] = mouseX;
    curr_xy[(point_count<<1)+1] = mouseY;
    point_count++;
  })

  curr_img_pyr = new jsfeat.pyramid_t(3);
  prev_img_pyr = new jsfeat.pyramid_t(3);
  curr_img_pyr.allocate(w, h, jsfeat.U8_t|jsfeat.C1_t);
  prev_img_pyr.allocate(w, h, jsfeat.U8_t|jsfeat.C1_t);
  
  point_count = 0;
  point_status = new Uint8Array(100);
  prev_xy = new Float32Array(100*2);
  curr_xy = new Float32Array(100*2);
}

function prune_oflow_points() {
  var n = point_count;
  var i=0,j=0;

  for(; i < n; ++i) {
      if(point_status[i] == 1) {
          if(j < i) {
              curr_xy[j<<1] = curr_xy[i<<1];
              curr_xy[(j<<1)+1] = curr_xy[(i<<1)+1];
          }
          ellipse(curr_xy[j<<1], curr_xy[(j<<1)+1], 8, 8);
          ++j;
      }
  }
  point_count = j;
}

function draw() {
  image(capture, 0, 0, w, h);
  capture.loadPixels();
  if(capture.pixels.length > 0) { // don't forget this!
    var _pt_xy = prev_xy;
    prev_xy = curr_xy;
    curr_xy = _pt_xy;
    var _pyr = prev_img_pyr;
    prev_img_pyr = curr_img_pyr;
    curr_img_pyr = _pyr;
    
    var winSize = 20;
    var maxIterations = 30;
    var epsilon = 0.01;
    var minEigen = 0.001;
    
    jsfeat.imgproc.grayscale(capture.pixels, w, h, curr_img_pyr.data[0]);
    curr_img_pyr.build(curr_img_pyr.data[0], true);
    jsfeat.optical_flow_lk.track(
      prev_img_pyr, curr_img_pyr,
      prev_xy, curr_xy,
      point_count,
      winSize, maxIterations,
      point_status,
      epsilon, minEigen);
    prune_oflow_points();
  }
}