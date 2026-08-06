function setup() {
  createCanvas(400, 400);

  background('black')

  let turtleString = "B"
  for (let i = 0; i < 7; i++){
     turtleString = turtleString.replaceAll("B", "F[+B][-B]")
  }

  print(turtleString)

  translate(width / 2, height); // x and y
  stroke('#8BC34A')
  renderString(turtleString)
}
let branchLength = 100;
let angle = Math.PI / 10;
// 45 -> Math.PI / 4
// 90 -> Math.PI / 2
// render string function
function renderString(string) {
  for (let character of string) {
    if (character == 'F') {
      strokeWeight(branchLength / 10)
      line(0, 0, 0, -branchLength);
      translate(0, -branchLength);
    } else if (character == '+') {
      rotate(random());
      // rotate(mouseX / 100);
    } else if (character == '-') {
      rotate(-random());
      // rotate(-mouseY / 100);
    } else if (character == '[') {
      branchLength = branchLength / 1.5;
      push();
    } else if (character == ']') {
      branchLength = branchLength * 1.5;
      pop();
    }
  }
}
