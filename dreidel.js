let shape, img;
let currentAngle = 0;
let decrease = 1;
let turning = true;
let speed = 0.2;
let speedIncrease = 0;
let runningTotal = Math.PI / 2;
let increment = Math.PI / 2;
let matchAngle = false;
const threshold = 20;
const decreaseAmount = 0.99;
//vertical rotation end
function preload() {
  shape = loadModel("dreidel.obj", true);
  img = loadImage("Dreidel.png");
}
function setup() {
  createCanvas(400, 400, WEBGL);
  describe("A dreidel");
  window.addEventListener("click", () => {
    turning = true;
    decrease = 1;
  });
  window.addEventListener("dblclick", () => {
    turning = true;
    decrease = 0.9;
    speed *= 1.1;
  });
}
function draw() {
  background(100, 190, 255);
  noStroke();
  camera(0, 0, 800, 0, 0, 0);
  {
    push();
    const c = color(255);
    const north = createVector(-1, 0, -0.3).normalize();
    directionalLight(c, north.x, north.y, north.z);
    const east = createVector(0, 1, -0.3).normalize();
    directionalLight(c, east.x, east.y, east.z);
    const west = createVector(0, -1, -0.3).normalize();
    directionalLight(c, west.x, west.y, west.z);
    const south = createVector(1, 0, -0.3).normalize();
    directionalLight(c, south.x, south.y, south.z);
    texture(img);
    rotateZ(PI);
    scale(-1, 1);
    if (turning) {
      if (!matchAngle) {
        speedIncrease = speed * decrease;
        currentAngle += speedIncrease;
        decrease *= decreaseAmount;
        if (currentAngle > runningTotal) runningTotal += increment;
        if (decrease < 0.01) matchAngle = true;
      } else {
        const distance = runningTotal - currentAngle;
        currentAngle += distance * decrease;
      }
      rotateY(currentAngle);
    } else {
      rotateY(currentAngle);
      speed = 0.2;
    }
    model(shape);
    pop();
  }
  //plane
  {
    push();
    ambientLight(255);
    ambientMaterial(200);
    translate(0, 100, 0);
    rotateX(HALF_PI);
    plane(300, 300);
    pop();
  }
}
