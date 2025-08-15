
// Karl Yerkes
// 2023-10-01
//
// Rule 30
//

function windowResized() {
  let Width = select('#sketch').width;
  resizeCanvas(Width, Width / 2);
  // Keep original aspect; if you prefer responsive, replace with resizeCanvas(windowWidth, windowHeight);
  // Here we intentionally keep size stable for composition integrity.
}

function setup() {
  let Width = select('#sketch').width;
  let canvas = createCanvas(Width, Width / 2); 
  canvas.style('display', 'block');
  canvas.style('margin', '0 auto');
  canvas.parent('#sketch');
  noLoop();
  pixelDensity(1);
}

function turn_on(pixels, index) {
  pixels[index * 4 + 0] = 255;
  pixels[index * 4 + 1] = 255;
  pixels[index * 4 + 2] = 255;
  pixels[index * 4 + 3] = 255;
}

function turn_off(pixels, index) {
  pixels[index * 4 + 0] = 0;
  pixels[index * 4 + 1] = 0;
  pixels[index * 4 + 2] = 0;
  pixels[index * 4 + 3] = 255;
}

let which = 30;

function draw() {
  background(255);

  loadPixels();

  for (let column = 0; column < width; column++) {
    pixels[column * 4 + 0] = 255;
    pixels[column * 4 + 1] = 255;
    pixels[column * 4 + 2] = 255;
    pixels[column * 4 + 3] = 255;
  }
  pixels[(width / 2) * 4 + 0] = 0;
  pixels[(width / 2) * 4 + 1] = 0;
  pixels[(width / 2) * 4 + 2] = 0;
  pixels[(width / 2) * 4 + 3] = 255;

  let pixel = 0;
  for (let row = 0; row < height; row++) {
    pixel += 4;
    for (let column = 1; column < width - 1; column++) {
      const v =
        (pixels[pixel - 4] == 0 ? 4 : 0) |
        (pixels[pixel] == 0 ? 2 : 0) |
        (pixels[pixel + 4] == 0 ? 1 : 0);
      const o = ((which >> v) & 1) == 1 ? 0 : 255;
      pixels[pixel + width * 4 + 0] = o;
      pixels[pixel + width * 4 + 1] = o;
      pixels[pixel + width * 4 + 2] = o;
      pixels[pixel + width * 4 + 3] = 255;
      pixel += 4;
    }
    pixel += 4;
  }
  updatePixels();  
}

function keyReleased() {
  if (keyCode == RIGHT_ARROW) {
    which = (which + 1) & 255;
  } else if (keyCode == LEFT_ARROW) {
    which = (which - 1) & 255;
  } else if (key == " ") {
    saveCanvas();
  }
  redraw();
  print(which);
}

function windowResized() {
  resizeCanvas(windowWidth, 200);
  redraw();
}