let shape;
let bg;
function preload() {
  shape = loadModel("Dreidel.stl", true);
  bg = loadImage("cayley_interior.jpg");
}
function setup() {
  createCanvas(400, 400, WEBGL);
  describe("A dreidel");
}
function draw() {
  background(200);
  debugMode();
  fill(82, 162, 255);
  orbitControl();
  noStroke();
  const c = color(255, 255, 255);
  directionalLight(c, -1, -1, -0.5);
  directionalLight(c, 1, -1, -0.5);
  directionalLight(c, 0, 1, 0.5);
  ambientMaterial(255, 255, 255);
  specularMaterial(255, 255, 255);
  shininess(200);
  model(shape);
}
