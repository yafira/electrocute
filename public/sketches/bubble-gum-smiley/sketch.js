function setup() {
  createCanvas(400, 400);
  background(220);

  // face (pastel pink)
  fill(255, 182, 193); // pastel pink
  ellipse(200, 200, 250, 250);

  // eyes
  fill(0);
  ellipse(160, 180, 10, 10);
  ellipse(240, 180, 10, 10);

  // smile
  noFill();
  stroke(0);
  arc(200, 230, 80, 40, 0, PI);
}
