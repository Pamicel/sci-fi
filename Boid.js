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
    push();
    strokeWeight(1);
    stroke(this.h, this.s, this.b);
    let delta = x / y;
    let ampl = forceScale * (Math.pow(x, 2) + Math.pow(y, 2));
    line(this.x, this.y, this.x + ampl * delta, this.y + ampl / delta);
    pop();
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
  var totMass, fx, fy, xovery;
  for (let i in boids)
    if (boids[i] !== this) {
      deltax = boids[i].x - this.x;
      deltay = boids[i].y - this.y;
      xovery = (deltax) / (deltay);
      totMass = this.m + boids[i].m;
      f = totMass / (Math.pow(deltax, 2) + Math.pow(deltay, 2));
      fx = g * f * xovery;
      fy = g * f / xovery;
      this.applyForce(fx, fy, totMass);
    }
}

Boid.prototype.applyBehaviour = function(boids) {
  this.applyGravity(boids);
}

Boid.prototype.setColor = function (h, s, b) {
  this.h = h;
  this.s = s;
  this.b = b;
}

// Boid.prototype.follow = function(boids) {
//   this.bounce();
//   var desired;
//   for (let i in boids) {
//     desired = flow.get(this.x, this.y);
//   }
//   desired.setMag(this.maxspeed);
//   var steering = p5.Vector.sub(desired, this.vel);
//   steering.limit(this.maxforce);
//   return (steering);
//   this.applyForce(steering);
//   //this.applyForce(flow.get(this.x, this.y));
// }
//
// Boid.prototype.seek = function(target) {
//   var desired = p5.Vector.sub(target, this.pos);
//   var d = desired.mag();
//   if (d < 100) {
//     desired.setMag(map(d, 0, 100, 0, this.maxspeed));
//   }
//   else {
//     desired.setMag(this.maxspeed);
//   }
//   var steering = p5.Vector.sub(desired, this.vel);
//   steering.limit(this.maxforce);
//   return (steering);
// }
//
// Boid.prototype.align = function(boids) {
//   var desired = createVector(0, 0);
//   var neighbourhood = this.dia * boid_personal_space;
//   var count = 0;
//   var d;
//
//   for (var i = 0; i < boids.length; i++) {
//     d = p5.Vector.dist(this.pos, boids[i].pos);
//     if (d > 0 && d < neighbourhood) {
//       desired.add(boids[i].vel);
//       count++;
//     }
//   }
//   if (count) {
//     desired.div(count);
//     desired.limit(this.maxspeed);
//     var steering = p5.Vector.sub(desired, this.vel);
//     steering.limit(this.maxforce);
//     return (steering);
//   }
//   else {
//     return (desired);
//   }
// }
//
// Boid.prototype.seperate = function(boids) {
//   var sum = createVector(0, 0);
//   var neighbourhood = this.dia * boid_personal_space;
//   var count = 0;
//   var d;
//
//   for (var i = 0; i < boids.length; i++) {
//     d = p5.Vector.dist(this.pos, boids[i].pos);
//     if (d > 0 && d < neighbourhood) {
//       var diff = p5.Vector.sub(this.pos, boids[i].pos);
//       diff.normalize();
//       diff.div(d);
//       sum.add(diff);
//       count++;
//     }
//   }
//   if (count) {
//     sum.div(count).limit(this.maxspeed);
//     return (p5.Vector.sub(sum, this.vel).limit(this.maxforce));
//   }
//   else {
//     return (sum);
//   }
// }
//
// Boid.prototype.cohesion = function(boids) {
//   var sum = createVector(0, 0);
//   var neighbourhood = this.dia * boid_personal_space;
//   var count = 0;
//   var d;
//
//   for (var i = 0; i < boids.length; i++) {
//     d = p5.Vector.dist(this.pos, boids[i].pos);
//     if (d > 0 && d < neighbourhood) {
//       sum.add(boids[i].pos);
//       count++;
//     }
//   }
//   if (count) {
//     sum.div(count);
//     return (this.seek(sum));
//   }
//   else {
//     return (sum);
//   }
// }

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
  this.ax = 0;
  this.ay = 0;
}

// Boid.prototype.display = function() {
  // ellipse(this.x, this.y, this.m);
// }
