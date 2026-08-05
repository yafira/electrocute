let words = [
  { text: 'Soft', lang: 'English', color: [250, 245, 255] },
  { text: 'Suave', lang: 'Español', color: [255, 240, 245] },
  { text: 'やわらかい', lang: '日本語', color: [233, 242, 254] },
  { text: '부드러운', lang: '한국어', color: [241, 231, 203] },
  { text: 'ناعم', lang: 'العربية', color: [200, 234, 221] },
  { text: 'Doux', lang: 'Français', color: [244, 203, 215] },
  { text: 'Sanft', lang: 'Deutsch', color: [240, 255, 250] },
  { text: 'Morbido', lang: 'Italiano', color: [250, 245, 255] },
  { text: 'Macio', lang: 'Português', color: [255, 255, 224] },
  { text: 'Yumuşak', lang: 'Türkçe', color: [241, 231, 203] },
  { text: 'мягкий', lang: 'Русский', color: [233, 242, 254] },
  { text: 'μαλακός', lang: 'Ελληνικά', color: [255, 240, 245] },
  { text: 'नरम', lang: 'हिन्दी', color: [244, 203, 215] },
  { text: 'นุ่ม', lang: 'ไทย', color: [250, 245, 255] },
  { text: 'רך', lang: 'עברית', color: [200, 234, 221] }
];

let softWords = ['breathe', 'calm', 'gentle', 'rest', 'ease', 'softness'];
let softWordParticles = [];

let currentIndex = 0;
let timer = 0;
let interval = 240;
let alpha = 0;

let floatingOrbs = [];
let clouds = [];
let sparkles = [];
let gemShapes = [];
let fadeAmt = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Quicksand');
  textAlign(CENTER, CENTER);

  for (let i = 0; i < 10; i++) {
    floatingOrbs.push({
      angle: random(TWO_PI),
      radius: random(50, 250),
      size: random(10, 30),
      speed: random(0.001, 0.005)
    });
  }

  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: random(width),
      y: random(50, height - 200),
      speed: random(0.1, 0.3),
      scale: random(0.8, 1.5)
    });
  }

  for (let i = 0; i < 100; i++) {
    sparkles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.1, 0.5)
    });
  }

  for (let i = 0; i < 15; i++) {
    gemShapes.push({
      x: random(width),
      y: random(height),
      size: random(20, 40),
      color: randomGemColor(),
      speedX: random(-0.1, 0.1),
      speedY: random(-0.1, 0.1),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.002, 0.002)
    });
  }

  for (let i = 0; i < 20; i++) {
    softWordParticles.push({
      text: random(softWords),
      x: random(width),
      y: random(height),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.2, 0.2)
    });
  }

  myDescribe();
}

function draw() {
  let targetColor = words[currentIndex].color;
  background(color(targetColor[0], targetColor[1], targetColor[2]));

  drawBreathingCircle();
  drawClouds();
  drawGemShapes();
  drawSparkles();
  drawSoftWordParticles();

  alpha = lerp(alpha, 255, 0.05);
  fadeAmt = sin(frameCount * 0.01) * 50 + 205;

  let orbitX = width / 2 + cos(frameCount * 0.005) * 50;
  let orbitY = height / 2 + sin(frameCount * 0.005) * 50;
  let breathingScale = 1 + sin(frameCount * 0.01) * 0.02;

  push();
  translate(orbitX, orbitY);
  scale(breathingScale);
  textSize(64);
  fill(0, 20);
  text(words[currentIndex].text, 2, 2);
  fill(100, 100, 180, fadeAmt);
  text(words[currentIndex].text, 0, 0);
  pop();

  fill(80, 80, 80, alpha / 2);
  textSize(20);
  text(words[currentIndex].lang, width / 2, height / 2 + 80);

  timer++;
  if (timer > interval) {
    currentIndex = (currentIndex + 1) % words.length;
    timer = 0;
    alpha = 0;
  }

  drawFloatingShapes();
  drawGlimmer();
  drawOrbs();
  drawCursorTouch();
}

function drawBreathingCircle() {
  push();
  noStroke();
  let breath = 400 + sin(frameCount * 0.02) * 150;
  fill(255, 230, 240, 90); // soft, visible pink-white glow
  ellipse(width / 2, height / 2, breath);
  pop();
}

function mousePressed() {
  addSoftWord(mouseX, mouseY);
}

function mouseDragged() {
  if (frameCount % 10 === 0) {
    addSoftWord(mouseX, mouseY);
  }
}

function addSoftWord(x, y) {
  softWordParticles.push({
    text: random(softWords),
    x: x,
    y: y,
    speedX: random(-0.3, 0.3),
    speedY: random(-0.3, 0.3)
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawClouds() {
  noStroke();
  fill(255, 255, 255, 80);
  for (let cloud of clouds) {
    push();
    translate(cloud.x, cloud.y);
    scale(cloud.scale);
    ellipse(0, 0, 80, 50);
    ellipse(30, -10, 60, 40);
    ellipse(-30, -10, 60, 40);
    ellipse(0, -20, 50, 30);
    pop();

    cloud.x += cloud.speed;
    if (cloud.x > width + 100) {
      cloud.x = -100;
      cloud.y = random(50, height - 200);
    }
  }
}

function drawFloatingShapes() {
  noStroke();
  fill(255, 255, 255, 8);
  for (let i = 0; i < 25; i++) {
    let x = width / 2 + cos(frameCount * 0.005 + i) * (200 + i * 2);
    let y = height / 2 + sin(frameCount * 0.005 + i) * (200 + i * 2);
    ellipse(x, y, 15 + sin(frameCount * 0.02 + i) * 4);
  }
}

function drawGlimmer() {
  push();
  noStroke();
  fill(255, 255, 255, 10);
  let x = width / 2 + cos(frameCount * 0.01) * 150;
  let y = height / 2 + sin(frameCount * 0.01) * 150;
  ellipse(x, y, 80 + sin(frameCount * 0.05) * 20);
  pop();
}

function drawOrbs() {
  noStroke();
  fill(255, 180, 220, 50);
  for (let orb of floatingOrbs) {
    let x = width / 2 + cos(orb.angle + frameCount * orb.speed) * orb.radius;
    let y = height / 2 + sin(orb.angle + frameCount * orb.speed) * orb.radius;
    ellipse(x, y, orb.size);
  }
}

function drawSparkles() {
  noStroke();
  fill(255, 255, 255, 40);
  for (let s of sparkles) {
    ellipse(s.x, s.y, s.size);
    s.y -= s.speed;
    if (s.y < 0) {
      s.y = height;
      s.x = random(width);
    }
  }
}

function drawCursorTouch() {
  push();
  noFill();
  stroke(255, 200, 240, 80);
  strokeWeight(2);
  let pulse = 30 + sin(frameCount * 0.05) * 10;
  ellipse(mouseX, mouseY, pulse);
  pop();

  push();
  noStroke();
  fill(255, 200, 240, 60);
  ellipse(mouseX, mouseY, pulse * 0.6);
  pop();
}

function drawGemShapes() {
  for (let shape of gemShapes) {
    drawSoftGem(shape);
    updateGem(shape);
  }
}

function drawSoftGem(shape) {
  push();
  translate(shape.x, shape.y);
  rotate(shape.rotation);
  noStroke();
  for (let i = 0; i < 3; i++) {
    fill(lerpColor(color(shape.color), color(255, 255, 255, 150), i / 3));
    ellipse(0, 0, shape.size * (1 - i * 0.3));
  }
  pop();
}

function updateGem(shape) {
  shape.x += shape.speedX;
  shape.y += shape.speedY;
  if (shape.x > width) shape.x = 0;
  if (shape.x < 0) shape.x = width;
  if (shape.y > height) shape.y = 0;
  if (shape.y < 0) shape.y = height;
  shape.rotation += shape.rotationSpeed;
}

function randomGemColor() {
  const palette = [
    color(232, 215, 241, 150),
    color(241, 231, 203, 150),
    color(244, 203, 215, 150),
    color(200, 234, 221, 150),
    color(233, 242, 254, 150)
  ];
  return palette[floor(random(palette.length))];
}

function drawSoftWordParticles() {
  noStroke();
  fill(80, 80, 80, 50);
  textSize(14);
  for (let p of softWordParticles) {
    text(p.text, p.x, p.y);
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x > width) p.x = 0;
    if (p.x < 0) p.x = width;
    if (p.y > height) p.y = 0;
    if (p.y < 0) p.y = height;
  }
}

function myDescribe() {
  describe('Fullscreen soft canvas. A breathing circle expands and contracts behind the orbiting word "Soft" in many languages. Click or drag to release new floating words like "breathe." Clouds, sparkles, and soft shapes animate slowly.');
}
