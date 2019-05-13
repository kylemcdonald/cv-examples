# cv-examples

This repo contains a collection of computer vision examples for p5.js and JavaScript.

You can preview the examples [here](https://kylemcdonald.github.io/cv-examples/).

## Setup

Clone this repository or download the zip, then run the [p5 Editor](http://p5js.org/download/). In the p5 Editor, click `File > Open` and navigate to `cv-examples/` and select `index.html`. Click the play button, and this should launch the browser with links to each of the sketches.

Another way to run the examples is by starting a web server on `localhost` at the root directory. Usually you need an `https://` server to access the camera, but for `localhost` there is usually an exception. For example:

```
$ cd cv-examples
$ python -m SimpleHTTPServer 8000
```

Then navigate to `https://localhost:8000/` in your browser.