let shape, bg, img;
let decrease = 1;
let currentAngle = 0;
let turning = true;
let speed = 0.2;
const threshold = 20;
function preload() {
  shape = loadModel("dreidel.obj", true);
  bg = loadImage("cayley_interior.jpg");
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
      currentAngle += speed * decrease;
      decrease *= 0.99;
      rotateY(currentAngle);
      if (Math.abs((currentAngle % 1) - 1) < 0.0001) turning = false;
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
