// particle class to represent wind elements
class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.prevPos = this.pos.copy();
  }
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // reset particle if it moves off screen
    if (this.pos.x > width || this.pos.x < 0 ||
        this.pos.y > height || this.pos.y < 0) {
      this.pos = createVector(random(width), random(height));
      this.prevPos = this.pos.copy();
    }
  }
  applyForce(force) {
    this.acc.add(force);
  }
  show() {
    stroke(255, 255, 255, 50);
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.prevPos = this.pos.copy();
  }
}
let particles = [];
let noiseScale = 0.01;
let noiseStrength = 1;
let particleCount = 1000;
function setup() {
  createCanvas(800, 800);
  background(20, 20, 30);

  // initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
function draw() {
  background(20, 20, 30, 10);

  // update and display all particles
  for (let particle of particles) {
    let angle = noise(particle.pos.x * noiseScale,
                     particle.pos.y * noiseScale) * TWO_PI * 2;

    let force = p5.Vector.fromAngle(angle);
    force.mult(noiseStrength);

    particle.applyForce(force);
    particle.update();
    particle.show();
  }
}
