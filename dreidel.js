"use strict";
class Player {
  constructor(username, index, total) {
    this.username = username;
    this._total = total;
    this.turn = false;
    this.index = index;
    this.gain = 0;
    this.went = false;
  }
  get total() {
    return this._total;
  }
  set total(v) {
    const self = this;
    this.gain = v - this._total;
    this._total = v;
    setTimeout(() => (self.gain = 0), 1500);
  }
}
const gameState = Vue.reactive({ result: "-" });
const spinnable = Vue.reactive({ canSpin: false });
const spin = {
  shape: null,
  img: null,
  curANG: 0,
  dec: 1,
  turn: true,
  speed: 0.5,
  spINC: 0,
  runTotal: Math.PI / 2,
  incr: Math.PI / 2,
  match: false,
  handle: true,
  threshold: 0.06,
  decAMNT: 0.99,
  sides: ["hei", "gimmel", "nun", "shin"],
  decreasing: false,
  lights: [
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 0],
  ],
  endCallBack: function () {},
};
Object.freeze(spin.sides);
Object.freeze(spin.lights);
function preload() {
  spin.shape = loadModel("dreidel.obj", true); //load model here
  spin.img = loadImage("Dreidel.png");
}
function setup() {
  const myCanvas = createCanvas(300, 300, WEBGL);
  myCanvas.parent("#place");
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
  const num = Math.abs(Math.round(angle / (Math.PI / 2)) % spin.sides.length);
  const result = spin.sides[num];
  gameState.result = result;
  spin.endCallBack();
}
const app = Vue.createApp({
  async created() {
    const file = await (await fetch("symbols.json")).json();
    this.symbols = file;
  },
  data() {
    return {
      gameState: gameState,
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
      spinnable: spinnable,
      randomStartVal: Math.floor(Math.random() * (15 - 10)) + 10,
      symbols: null,
      currentSymbol: null,
      currentPlayer: null,
      footerText: "By: Remy Serbinenko, Jo, and Mo — December 21st, 2025",
    };
  },
  methods: {
    addUser() {
      if (this.newUserName != "") {
        this.players.push(
          new Player(this.newUserName, this.players.length, this.randomStartVal)
        );
        this.newUserName = "";
      }
    },
    deletePlayer(i) {
      this.players.splice(i, 1);
    },
    async startGame() {
      document.querySelector(".openScreen").classList.add("off");
      this.players.forEach((e, i) => {
        if (i % 2 === 0) this.playersLeft.push(e);
        if (i % 2 === 1) this.playersRight.push(e);
      });
      this.currencyChosen = this.currency;
      await this.wait(2000);
      this.gameLoop();
    },
    async gameLoop() {
      let i = 0;
      this.giveOne();
      await this.wait(1600);
      while (this.players.length > 1) {
        this.currentSymbol = null;
        const currentPlayer = this.players[i];
        this.currentPlayer = currentPlayer.username;
        this.turn(i);
        this.giveOne();
        await this.wait(1600);
        if (currentPlayer.total <= 0) {
          this.removeAndBuild(i);
          continue;
        }
        const waitPress = new Promise((res) => (spin.endCallBack = res));
        this.spinnable.canSpin = true;
        await waitPress;
        this.Game(currentPlayer, this.gameState.result);
        await this.wait(1600);
        if (currentPlayer.total <= 0) {
          this.removeAndBuild(i);
          continue;
        }
        // currentPlayer.total--;
        // this.pot++;
        await this.wait(2600);
        this.returnNormal();
        if (currentPlayer.total <= 0) {
          this.removeAndBuild(i);
          continue;
        }
        i = (i + 1) % this.players.length;
        currentPlayer.went = true;
        if (this.players.every((e) => e.went === true)) {
          this.round++;
          this.players.forEach((e) => (e.went = false));
        }
      }
      this.winner = this.players?.[0]?.username;
    },
    turn(index) {
      this.players.forEach((e, i) => (e.turn = index === i ? true : false));
    },
    spinDreidel() {
      spinnable.canSpin = false;
      spin.turn = true;
      spin.match = false;
      spin.dec = 1;
      spin.decreasing = true;
      spin.handle = true;
    },
    returnNormal() {
      spin.decreasing = false;
      spin.turn = true;
      spin.match = false;
      spin.dec = 1;
      spin.handle = true;
      this.gameState.result = "-";
    },
    wait(t) {
      return new Promise((resolve) => setTimeout(resolve, t));
    },
    giveOne() {
      this.players.forEach((e) => (e.total--, this.pot++));
    },
    Game(currentPlayer, state) {
      switch (state) {
        case "hei":
          const half = Math.ceil(this.pot / 2);
          this.pot -= half;
          currentPlayer.total += half;
          break;
        case "gimmel":
          currentPlayer.total += this.pot;
          this.pot = 0;
          break;
        case "nun":
          break;
        case "shin":
          currentPlayer.total--;
          this.pot++;
          break;
      }
      this.currentSymbol = this.symbols.find((e) => e.name === state);
    },
    removeAndBuild(i) {
      this.players.splice(i, 1);
      this.playersLeft.length = 0;
      this.playersRight.length = 0;
      this.players.forEach((e, i) => {
        if (i % 2 === 0) this.playersLeft.push(e);
        if (i % 2 === 1) this.playersRight.push(e);
      });
    },
  },
}).mount("#vue_app");
