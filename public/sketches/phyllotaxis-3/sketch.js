var n = 0;
var c = 4;
var seeds = [];
function setup() {
  createCanvas(450, 450); // as a mobile first designer lol
  angleMode(DEGREES);
  background('#9363A5');
}
// gets called 60fps
function draw() {
  translate(width / 2, height / 2);

  var angle = n * 937.5; // play here! this
  var radius = c * sqrt(n);
  var x = radius * cos(angle);
  var y = radius * sin(angle);

  // generate random number
  let r = random();
  if (r < 0.11) {
    fill('#D3BDEB');
  } else if(r > 0.11 || r < 0.66) {
     fill('#B88AFF');
  } else if(r > 0.66) {
    fill('rgb(255,255,255)');
  }

  noStroke();
  ellipse(x, y, 4 * sin(n), 5 * sin(n+0.5));
  n++;
  c += 0 // play here! this will dynamically change the spacing. try c += sin(n)

}
// things to try
// play around with n and/or c
// change the color based on position or order
// change the size of the seeds based on position/order
// change the seed size after a certain n
// random colors
// build your flower with other shapes
// build your flower with letters or images instead of ellipses
// animate the flower in draw() after placing the leaves in a setup() loop
// connect leaves
// can you make something that looks like a romanesco broccoli
// reminder to take lots of pictures of WIP flowers. right click and download to share
