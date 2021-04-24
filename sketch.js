var boids;
var flow;
const N_BOIDS = 5;
var h = 230;
var s = 10;
var b = 100;
const H = 360;
const S = 100;
const B = 100;
var maxH = H;
var maxS = S;
var maxB = B;

let renderPG, debugPG, overlayPG;

function setup() {
  createCanvas(windowWidth, windowHeight);
  init();
}

function init() {
  renderPG = createGraphics(width, height);
  // debugPG = createGraphics(width, height);
  overlayPG = createGraphics(width, height);
  overlayPG.strokeWeight(1);
  overlayPG.stroke(233, 233, 229);
  for (let i = 0; i < 100; i++) {
    overlayPG.push();
    overlayPG.circle(random(width), random(height), random(1, 3));
    overlayPG.rotate(random(TWO_PI));
    overlayPG.translate(random(width), random(height));
    const len = random(5, 10);
    overlayPG.line(-len, 0, len, 0);
    overlayPG.pop();
  }
  colorMode(HSB, H, S, B);
  boids = [];
  var i = 0;
  var r = max(width, height);
  while (i <= N_BOIDS) {
    boids[i++] = new Boid(random() * width, random() * height, r, random() * width, random() * height);
  }
  background(233, 233, 229);
  for (var j = 0; j < 10; j++) {
    boids.forEach((boid) => {
      boid.applyBehaviour(boids);
      boid.update();

    });
  }
}

function draw() {
  // perspective atmospherique.
  renderPG.push();
  renderPG.noStroke();
  // renderPG.fill(233, 233, 229, 20);
  renderPG.background(233, 233, 229)
  // renderPG.rect(0, 0, width, height);
  renderPG.pop();

  for (var i = 0; i < boids.length; i++) {
    boids[i].applyBehaviour(boids);
    boids[i].update();
  }
  image(renderPG, 0, 0, width, height);
  image(overlayPG, 0, 0, width, height);
}

function mousePressed () {
  for (var i = 0; i < boids.length; i++) {
    boids[i].x = random(width);
    boids[i].y = random(height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init();
}

var g = 1;
var bounceForce = .2;
var drawForce = true;
var forceScale = 2;
var maxspeed = 1;

function Boid(x, y, mass, vx, vy) {
  this.x = x;
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.ax = 0;
  this.ay = 0;
  this.m = mass;
  this.h = 100;
  this.s = 0;
  this.b = 100;
}

Boid.prototype.applyForce = function(x, y) {
  if (drawForce) {
    renderPG.strokeWeight(width / 20);
    renderPG.stroke(0);
    let delta = x / y;
    let ampl = forceScale * (Math.pow(x, 2) + Math.pow(y, 2));
    renderPG.strokeCap(SQUARE);
    renderPG.line(this.x / 2, this.y / 2, this.x / 2 + ampl * delta, this.y / 2 + ampl / delta);
    renderPG.push();
    renderPG.translate(width, 0);
    renderPG.scale(-1.0,1.0)
    renderPG.line(this.x / 2, this.y / 2, this.x / 2 + ampl * delta, this.y / 2 + ampl / delta);
    renderPG.pop();
    renderPG.push();
    renderPG.translate(0, height);
    renderPG.scale(1.0,-1.0)
    renderPG.line(this.x / 2, this.y / 2, this.x / 2 + ampl * delta, this.y / 2 + ampl / delta);
    renderPG.pop();
    renderPG.push();
    renderPG.translate(width, height);
    renderPG.scale(-1.0,-1.0)
    renderPG.line(this.x / 2, this.y / 2, this.x / 2 + ampl * delta, this.y / 2 + ampl / delta);
    renderPG.pop();
    // debugPG.push();
    // debugPG.noStroke();
    // debugPG.fill(255, 0 ,0);
    // debugPG.circle(this.x / 2, this.y / 2, 10);
    // debugPG.pop();
  }
  this.ax += x;
  this.ay += y;
}

Boid.prototype.bounce = function() {
  if (this.x < 0) {
    this.applyForce(bounceForce, 0);
  } else if (this.x > width) {
    this.applyForce(-bounceForce, 0);
  }
  if (this.y < 0) {
    this.applyForce(0, bounceForce);
  } else if (this.y > height) {
    this.applyForce(0, -bounceForce);
  }
}

Boid.prototype.applyGravity = function (boids) {
  let totMass = 0;

  boids
  .filter(boid => boid !== this)
  .forEach((boid) => {
    deltax = boid.x - this.x;
    deltay = boid.y - this.y;
    const xovery = (deltax) / (deltay);
    totMass = this.m + boid.m;
    const f = totMass / (Math.pow(deltax, 2) + Math.pow(deltay, 2));
    const fx = g * f * xovery;
    const fy = g * f / xovery;
    if (fx < width && fy < height) {
      this.applyForce(fx, fy);
    }
  })
}

Boid.prototype.applyBehaviour = function(boids) {
  this.applyGravity(boids);
}

Boid.prototype.update = function() {
  this.bounce();
  this.vx += this.ax;
  this.vy += this.ay;
  if (maxspeed) {
    this.vx = Math.sign(this.vx) * Math.min(Math.abs(this.vx), maxspeed);
    this.vy = Math.sign(this.vy) * Math.min(Math.abs(this.vy), maxspeed);
  }
  this.x += this.vx;
  this.y += this.vy;
  if (
    this.x > (width * 1.2)
    || this.y > (height * 1.2)
    || this.x < 0 - .2 * width
    || this.y < 0 - .2 * height
  ) {
    this.x = width / 2;
    this.y = height / 2;
  }
  this.ax = 0;
  this.ay = 0;
}
