let shape;
let bg;
let decrease = 1;
let currentAngle = 0;
let turning = true;
const threshold = 20;
const angleThreshold = 0.2;
function preload() {
  shape = loadModel("Dreidel.stl", true);
  bg = loadImage("cayley_interior.jpg");
}
function setup() {
  createCanvas(400, 400, WEBGL);
  describe("A dreidel");
}
function draw() {
  background(255);
  noStroke();
  const c = color(82, 162, 255);
  const north = createVector(-1, 0, -0.3).normalize();
  directionalLight(c, north.x, north.y, north.z);
  const east = createVector(0, 1, -0.3).normalize();
  directionalLight(c, east.x, east.y, east.z);
  const west = createVector(0, -1, -0.3).normalize();
  directionalLight(c, west.x, west.y, west.z);
  const south = createVector(1, 0, -0.3).normalize();
  directionalLight(c, south.x, south.y, south.z);
  ambientMaterial(82, 162, 255);
  if (turning) {
    currentAngle += 0.2 * decrease;
    decrease *= 0.99;
    rotateY(currentAngle);
    if (Math.abs(currentAngle - threshold) < angleThreshold) turning = false;
    console.log(currentAngle);
  } else rotateY(currentAngle);
  model(shape);
}
