class Player {
  constructor(username, index, total) {
    this.username = username;
    this.total = total;
    this.turn = false;
    this.index = index;
  }
}
const gameState = Vue.reactive({ result: "-" });
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
  decreasing: false,
  lights: [
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 0],
  ],
};
function preload() {
  spin.shape = loadModel("dreidel.obj", true); //load model here
  spin.img = loadImage("Dreidel.png");
}
function setup() {
  const myCanvas = createCanvas(300, 300, WEBGL);
  myCanvas.parent("#canvasDiv");
  describe("A dreidel");
}
function draw() {
  background(158, 228, 255);
  noStroke();
  camera(0, -120, 800, 0, 0, 0);
  {
    push();
    const c = color(255);
    spin.lights.forEach(([x, y]) => {
      const v = createVector(x, y, -0.3).normalize();
      directionalLight(c, v.x, v.y, v.z);
    });
    texture(spin.img); //texture here
    rotateZ(PI);
    scale(-1, 1);
    if (spin.turn) {
      if (!spin.match) {
        spin.spINC = spin.speed * spin.dec;
        spin.curANG += spin.spINC;
        if (spin.decreasing) {
          spin.dec *= spin.decAMNT;
          spin.speed = 0.2;
        } else spin.speed = 0.05;
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
}
function spinDreidel() {
  spin.turn = true;
  spin.match = false;
  spin.dec = 1;
  spin.decreasing = true;
  spin.handle = true;
}
const app = Vue.createApp({
  data() {
    return {
      result: gameState,
      currencies: ["Chocolate Chips", "Tokens", "Coins", "$100 Bills"],
      currency: "Chocolate Chips",
      players: [],
      newUserName: "",
      playersLeft: [],
      playersRight: [],
      round: 1,
      pot: 0,
      winner: null,
      currencyChosen: "",
      title: "Chanukah Dreidel",
    };
  },
  methods: {
    addUser() {
      if (this.newUserName != "") {
        this.players.push(
          new Player(
            this.newUserName,
            this.players.length,
            this.randmNum(10, 15)
          )
        );
        this.newUserName = "";
      }
    },
    deletePlayer(i) {
      this.players.splice(i, 1);
    },
    startGame() {
      document.querySelector(".openScreen").classList.add("off");
      this.players.forEach((e, i) => {
        if (i % 2 === 0) this.playersLeft.push(e);
        if (i % 2 === 1) this.playersRight.push(e);
      });
      this.currencyChosen = this.currency;
      this.turn(0);
    },
    turn(index) {
      this.players.forEach((e, i) => {
        e.turn = index === i ? true : false;
      });
    },
    randmNum(max, min) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
  },
}).mount("#vue_app");
