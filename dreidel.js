const gameState = Vue.reactive({result: "-"});
const spin = {
  shape: null,
  img: null,
  curANG: 0,
  dec: 1,
  turn: true,
  speed: 0.2,
  spINC: 0,
  runTotal: Math.PI / 2,
  incr: Math.PI / 2,
  match: false,
  handle: true,
  threshold: 0.06,
  decAMNT: 0.99,
  sides: ["hey", "gimmel", "nun", "shin"],
  lights: [
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 0],
  ],
};
function preload() {
  spin.shape = loadModel("dreidel.obj", true);
  spin.img = loadImage("Dreidel.png");
}
function setup() {
  const myCanvas = createCanvas(300, 300, WEBGL);
  myCanvas.parent("#canvasDiv");
  describe("A dreidel");
  window.addEventListener("click", () => {
    spin.turn = true;
    spin.match = false;
    spin.dec = 1;
    spin.handle = true;
  });
  window.addEventListener("dblclick", () => {
    spin.turn = true;
    spin.match = false;
    spin.dec = 0.9;
    spin.speed *= 1.1;
    spin.handle = true;
  });
}
function draw() {
  background(158, 228, 255);
  noStroke();
  camera(0, 0, 800, 0, 0, 0);
  {
    push();
    const c = color(255);
    spin.lights.forEach(([x, y]) => {
      const v = createVector(x, y, -0.3).normalize();
      directionalLight(c, v.x, v.y, v.z);
    });
    texture(spin.img);
    rotateZ(PI);
    scale(-1, 1);
    if (spin.turn) {
      if (!spin.match) {
        spin.spINC = spin.speed * spin.dec;
        spin.curANG += spin.spINC;
        spin.dec *= spin.decAMNT;
        if (spin.curANG > spin.runTotal) spin.runTotal += spin.incr;
        if (spin.dec < 0.01) spin.match = true;
      } else {
        const d1 = spin.runTotal - spin.curANG;
        const d2 = d1 - spin.incr;
        const dist = Math.abs(d2) < Math.abs(d1) ? d2 : d1;
        spin.curANG +=
          Math.sign(dist) * Math.min(Math.abs(dist * spin.dec), spin.spINC);
        if (Math.abs(dist) < spin.threshold) {
          spin.turn = false;
          spin.match = false;
          if (spin.handle) {
            handle(spin.curANG);
            spin.handle = false;
          }
        }
      }
    } else spin.speed = 0.2;
    rotateY(spin.curANG);
    model(spin.shape);
    pop();
  }
  {
    push();
    ambientLight(255);
    ambientMaterial(0, 97, 133);
    translate(0, 100, 0);
    rotateX(HALF_PI);
    plane(500, 600);
    pop();
  }
}
function handle(angle) {
  const num = Math.round(angle / (Math.PI / 2)) % spin.sides.length;
  const result = spin.sides[num];
  gameState.result = result;
  console.log(result);
  //other functions to do stuff
}

const app = Vue.createApp({
  data() {
    return {
    result: gameState.result
    }
  }
}).mount("#vue_app")
