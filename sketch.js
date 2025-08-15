/*
ChatGPT prompt:

Write a p5js sketch that draws a painting in the abstract and colorful style of Wassily Kandinsky. Add animation. Give the just the javascript.

*/

// p5.js — Abstract, animated Kandinsky-ish composition (JS only)

let palette = [
  "#f94144","#f3722c","#f8961e","#f9844a","#f9c74f",
  "#90be6d","#43aa8b","#577590","#277da1","#9b5de5",
  "#f15bb5","#00bbf9","#ffd166","#06d6a0","#ef476f"
];

let circles = [];
let bars = [];
let arcs = [];
let lines = [];
let paperTex;


function windowResized() {
  resizeCanvas(select('#sketch').width,select('#sketch').width * 0.8);
  // Keep original aspect; if you prefer responsive, replace with resizeCanvas(windowWidth, windowHeight);
  // Here we intentionally keep size stable for composition integrity.
}

function setup() {
  const SEED = int(second());
  randomSeed(SEED);
  noiseSeed(SEED);
  createCanvas(select('#sketch').width, select('#sketch').width * 0.8);
  angleMode(RADIANS);
  noCursor();

  // Generate shapes
  for (let i = 0; i < 7; i++) circles.push(new CircleShape());
  for (let i = 0; i < 8; i++) bars.push(new BarShape());
  for (let i = 0; i < 6; i++) arcs.push(new ArcShape());
  for (let i = 0; i < 14; i++) lines.push(new LineShape());
}

function draw() {
  drawBackground();

  let t = millis() / 1000;

  // Depth ordering: lines behind, then bars, circles, arcs, then accent lines
  push();
  for (let l of lines) if (!l.front) l.show(t);
  for (let b of bars) b.show(t);
  for (let c of circles) c.show(t);
  for (let a of arcs) a.show(t);
  for (let l of lines) if (l.front) l.show(t);
  pop();

  // Paper grain overlay
  push();
  tint(255, 25);
  //image(paperTex, 0, 0);
  pop();
}

function drawBackground() {
  // soft cream to pale yellow vertical gradient
  let c1 = color("#f4efe6");
  let c2 = color("#fff3c4");
  for (let y = 0; y < height; y++) {
    let n = y / height;
    stroke(lerpColor(c1, c2, n));
    line(0, y, width, y);
  }

  // vignette
  noFill();
  for (let i = 0; i < 80; i++) {
    stroke(0, map(i, 0, 79, 3, 0));
    rect(10 + i, 10 + i, width - 20 - 2 * i, height - 20 - 2 * i);
  }
}

function makePaperTexture() {
  paperTex = createGraphics(width, height);
  paperTex.clear();
  paperTex.noStroke();
  let dots = int(width * height * 0.008);
  for (let i = 0; i < dots; i++) {
    paperTex.fill(0, random(10, 22));
    let x = random(width);
    let y = random(height);
    let r = random(0.5, 1.7);
    paperTex.circle(x, y, r);
  }
  // light fibers
  paperTex.stroke(0, 10);
  for (let i = 0; i < 120; i++) {
    let x = random(width);
    let y = random(height);
    paperTex.line(x, y, x + random(-15, 15), y + random(-15, 15));
  }
}

/* ---------- Shape Classes ---------- */

class CircleShape {
  constructor() {
    this.x = random(width * 0.1, width * 0.9);
    this.y = random(height * 0.15, height * 0.85);
    this.r = random(35, 120);
    this.fillCol = color(random(palette));
    this.strokeCol = color(0);
    this.strokeW = random(2, 5);

    this.wobbleAmp = random(2, 12);
    this.wobbleFreq = random(0.3, 0.8);
    this.rotSpeed = random([-1, 1]) * random(0.05, 0.18);

    // Satellites orbiting
    this.satellites = [];
    let n = int(random(2, 6));
    for (let i = 0; i < n; i++) {
      this.satellites.push({
        r: random(this.r * 0.35, this.r * 0.8),
        size: random(4, 10),
        col: color(random(palette)),
        phase: random(TWO_PI),
        speed: random(0.5, 1.5)
      });
    }

    // Inner chords
    this.chords = int(random(2, 5));
  }

  show(t) {
    push();
    translate(this.x + wobble(this.x, t, this.wobbleFreq, this.wobbleAmp),
              this.y + wobble(this.y, t, this.wobbleFreq * 0.9, this.wobbleAmp));
    rotate(this.rotSpeed * t);

    stroke(this.strokeCol);
    strokeWeight(this.strokeW);
    fill(this.fillCol);
    circle(0, 0, this.r * 2);

    // inner ring
    noFill();
    stroke(0, 140);
    strokeWeight(this.strokeW * 0.6);
    circle(0, 0, this.r * 1.5);

    // chords (geometric accents)
    stroke(0, 180);
    for (let i = 0; i < this.chords; i++) {
      let a1 = random(TWO_PI);
      let a2 = a1 + random(PI / 3, PI * 0.9);
      line(this.r * cos(a1), this.r * sin(a1), this.r * cos(a2), this.r * sin(a2));
    }

    // satellites
    noStroke();
    for (let s of this.satellites) {
      let ang = s.phase + t * s.speed;
      fill(s.col);
      circle(cos(ang) * (this.r + s.r), sin(ang) * (this.r + s.r), s.size + sin(t * 2 + s.phase) * 1.2);
    }

    pop();
  }
}

class BarShape {
  constructor() {
    this.cx = random(width * 0.1, width * 0.9);
    this.cy = random(height * 0.1, height * 0.9);
    this.w = random(60, 220);
    this.h = random(10, 45);
    this.angle = random(TWO_PI);
    this.col = color(random(palette));
    this.strokeW = random(2, 4);
    this.rotSpeed = random([-1, 1]) * random(0.1, 0.25);
    this.slideAmp = random(6, 20);
  }

  show(t) {
    push();
    translate(
      this.cx + noiseShift(this.cx, t, 0.18, this.slideAmp),
      this.cy + noiseShift(this.cy, t, 0.22, this.slideAmp)
    );
    rotate(this.angle + this.rotSpeed * 0.2 * sin(t * 0.8));
    stroke(0, 200);
    strokeWeight(this.strokeW);
    fill(this.col);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h, 6);

    // thin black cap lines (graphic feel)
    stroke(0);
    strokeWeight(1.5);
    line(-this.w * 0.5, 0, this.w * 0.5, 0);
    pop();
  }
}

class ArcShape {
  constructor() {
    this.x = random(width * 0.15, width * 0.85);
    this.y = random(height * 0.2, height * 0.8);
    this.r = random(60, 180);
    this.thick = random(6, 18);
    let span = random(PI / 3, PI * 1.4);
    this.a1 = random(TWO_PI);
    this.a2 = this.a1 + span;
    this.col = color(random(palette));
    this.speed = random([-1, 1]) * random(0.08, 0.18);
  }

  show(t) {
    push();
    translate(this.x, this.y);
    rotate(this.speed * t);
    noFill();
    stroke(this.col);
    strokeWeight(this.thick);
    strokeCap(SQUARE);
    arc(0, 0, this.r * 2, this.r * 2, this.a1, this.a2);

    // inner thin echo
    stroke(0, 180);
    strokeWeight(this.thick * 0.25);
    arc(0, 0, this.r * 1.6, this.r * 1.6, this.a1 + 0.2, this.a2 - 0.1);
    pop();
  }
}

class LineShape {
  constructor() {
    this.x1 = random(-width * 0.1, width * 1.1);
    this.y1 = random(-height * 0.1, height * 1.1);
    this.x2 = random(-width * 0.1, width * 1.1);
    this.y2 = random(-height * 0.1, height * 1.1);
    this.w = random(1.2, 4);
    this.col = random() < 0.5 ? color(0) : color(0, 160);
    this.dash = random(6, 20);
    this.gap = random(4, 14);
    this.front = random() < 0.35; // some lines above shapes
    this.waveAmp = random(0.002, 0.006);
    this.phase = random(TWO_PI);
  }

  show(t) {
    push();
    stroke(this.col);
    strokeWeight(this.w);
    let offset = (sin(t * 2 + this.phase) * 0.5 + 0.5) * (this.dash + this.gap);
    dashedLine(
      this.x1 + sin((this.x1 + t) * this.waveAmp) * 20,
      this.y1 + sin((this.y1 + t) * this.waveAmp) * 20,
      this.x2 + sin((this.x2 + t) * this.waveAmp) * 20,
      this.y2 + sin((this.y2 + t) * this.waveAmp) * 20,
      this.dash, this.gap, offset
    );
    pop();
  }
}

/* ---------- Utilities ---------- */

function dashedLine(x1, y1, x2, y2, dashLen, gapLen, offset) {
  let dx = x2 - x1, dy = y2 - y1;
  let distTotal = sqrt(dx * dx + dy * dy);
  let angle = atan2(dy, dx);
  let progress = -offset % (dashLen + gapLen);
  push();
  translate(x1, y1);
  rotate(angle);
  while (progress < distTotal) {
    let seg = min(dashLen, distTotal - progress);
    if (progress + seg > 0) {
      let sx = max(0, progress);
      let ex = max(0, progress + seg);
      line(sx, 0, ex, 0);
    }
    progress += dashLen + gapLen;
  }
  pop();
}

function wobble(seed, t, freq, amp) {
  return (noise(seed * 0.01 + t * freq) - 0.5) * 2 * amp;
}

function noiseShift(seed, t, freq, amp) {
  return map(noise(seed * 0.1 + t * freq), 0, 1, -amp, amp);
}
