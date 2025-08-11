
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  // draw an X across the canvas
  line(0, 0, width, height);
  line(0, height, width, 0);
}

// update the canvas size when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
