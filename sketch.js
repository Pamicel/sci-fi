var boids;
var flow;
var n = 10;
var h = 230;
var s = 10;
var b = 100;
const H = 360;
const S = 100;
const B = 100;
var maxH = H;
var maxS = S;
var maxB = B;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, H, S, B);
  boids = [];
  var i = 0;
  var r = .005 * max(width, height);
  while (i <= n) {
    boids[i++] = new Boid(random() * width, random() * height, r, random() * width, random() * height);
  }
  background('white');
}

function draw() {
  // perspective atmospherique.
  // push();
  // fill(0, 0, 100);
  // rect(0, 0, width, height);
  // pop();
  var i = 0;
  while (i <= n) {
    boids[i].applyBehaviour(boids);
    boids[i].update();
    boids[i++].setColor(h, s, b);
  }
  h = (h + 0.05) % maxH;
  if (s <= maxS) s += 0.05;
  if (b <= maxB) b++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
