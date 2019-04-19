let canvas = document.querySelector(".canvas");

canvas.width = innerWidth;
canvas.height = innerHeight;

let ctx = canvas.getContext("2d");

let g = ctx.createLinearGradient(0, 0, 0, canvas.height); //createlineargradient

g.addColorStop(0, "#1C004D");
g.addColorStop(1, "#1C004D");

const accelarationScalingFactor = 2; // controll the spead of the objects;

const numberOfBalls = Math.floor((Math.random() + 0.3) * 6 + 1);
const friction = 0.99;

// const mouse = {
//   x: 0,
//   y: 0
// };

// canvas3.addEventListener("mousemove", mousemoveFn);
// function mousemoveFn(e) {
//   mouse.x = e.offsetX;
//   mouse.y = e.offsetY;
// }

class Mover {
  constructor(x, y, r, color, vx = 0, vy = 0) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.velocity = {
      x: vx,
      y: vy
    };
    this.accelaration = {
      x: 0,
      y: 0
    };
    this.color = color;
    this.friction = 0.9;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.shadowColor = "#FFDA00";
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
  }
  move() {
    // console.log(mover, mouse, diff);

    if (
      this.x + this.r + this.velocity.x > canvas.width ||
      this.x - this.r < 0
    ) {
      this.velocity.x = -this.velocity.x * friction;
    }
    if (
      this.y + this.r + this.velocity.y > canvas.height ||
      this.y - this.r < 0
    ) {
      this.velocity.y = -this.velocity.y * friction;
    } else {
      this.velocity.x += this.accelaration.x;
      this.velocity.y += this.accelaration.y;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
}

let moverArr = [];
for (let i = 0; i < numberOfBalls; i++) {
  // let r = Math.random() * 46 + 4;
  let r = Math.floor((Math.random() + 0.5) * 20);
  let x = Math.max(50, Math.random() * canvas.width);
  let y = Math.max(50, Math.random() * canvas.height);

  moverArr.push(
    new Mover(
      x,
      y,
      r,
      makeColor(),
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    )
  );
}
console.log(moverArr);
// const mover = new Mover(canvas3.width / 2, canvas3.height / 2, 20, "red");

// console.log(mover.x, mover.y);

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  moverArr.forEach(one => {
    one.accelaration.x = 0;
    one.accelaration.y = 0;
  });
  moverArr.forEach((one, index, moverArr) => {
    while (++index < moverArr.length) {
      calcAcceloration(one, moverArr[index]);
    }
  });

  moverArr.forEach(one => one.move());
}

animate();
// console.log(moverArr);

// utils function

function add(v1, v2) {
  const vector = {
    x: undefined,
    y: undefined
  };

  vector.x = v1.x + v1.y;
  vector.y = v2.x + v2.y;
  return vector;
}

function sub(v1, v2) {
  const vector = {
    x: undefined,
    y: undefined
  };

  vector.x = v1.x - v2.x;
  vector.y = v1.y - v2.y;
  vector.x = vector.x / Math.abs(vector.x);
  vector.y = vector.y / Math.abs(vector.y);
  console.log(vector);
  // its return the directon of the acceleration vector
  return vector;
}

function distance(obj1, obj2) {
  const xdis = obj2.x - obj1.x;
  const ydis = obj2.y - obj1.y;
  return Math.sqrt(Math.pow(xdis, 2) + Math.pow(ydis, 2));
}

function toPolar(cartesian) {
  var x = cartesian.x;
  var y = cartesian.y;

  return {
    // Distance
    d: x === 0 ? Math.abs(y) : y === 0 ? Math.abs(x) : Math.sqrt(x * x + y * y),
    // Angle
    a: Math.atan2(x, y)
  };
}

function toCartesian(polar) {
  var d = polar.d;
  var a = polar.a;

  return {
    x: Math.sin(a) * d,
    y: Math.cos(a) * d
  };
}

function accelarationFromDistance(decay, distance) {
  return decay / Math.pow(distance, 2);
}

window.toPolar = toPolar;
window.toCartesian = toCartesian;

function calcAcceloration(obj1, obj2) {
  const accelarationVector1 = sub(obj2, obj1); // THIS IS THE SUB VECTOR

  const accelarationVector2 = sub(obj1, obj2);

  const distance = dist(obj1, obj2);

  const mass1 = Math.pow(obj1.r, 3) / 10000; // the distance is huge so /10000 is good
  const mass2 = Math.pow(obj2.r, 3) / 10000;
  const gravityForce =
    (accelarationScalingFactor * mass1 * mass2) / Math.sqrt(distance, 2);

  if (distance > obj1.r + obj2.r) {
    // put things together
    (obj1.accelaration.x += accelarationVector1.x * gravityForce),
      (obj1.accelaration.y += accelarationVector1.y * gravityForce),
      (obj2.accelaration.x += accelarationVector2.x * gravityForce),
      (obj2.accelaration.y += accelarationVector2.y * gravityForce);
  }
}

function makeColor() {
  let hex = "#";
  const colorHex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
  for (let i = 0; i < 6; i++) {
    let random = colorHex[Math.floor(Math.random() * 16)];

    hex += random;
  }

  return hex;
}

// console.log(accelarationFromDistance(1, 1, -1));
// console.log(accelarationFromDistance(1, 1, 1));

function randomNumInrange(min, max) {
  let arr = [];
  //   return Math.floor(Math.random() * (max - min + 1) + 1);
  for (let i = min; i <= max; i++) {
    arr.push(i);
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

function dist(diff) {
  return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2));
}
