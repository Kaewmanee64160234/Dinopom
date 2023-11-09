let board;
let boardWidth = 800;
let boardHeight = 400;
let context;
let dino;
let dinoWidth = 70;
let dinoHeight = 75;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImage;

dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

//obstrucle
let cactusArray = [];
let cactusWidth = 34;
let cactusWidth2 = 69;
let cactusWidth3 = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactusImage1;
let cactusImage2;
let cactusImage3;

//physics
let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d"); //used for drawing on the board

  dinoImage = new Image();
  dinoImage.src = "./img/dino.png";
  dinoImage.onload = function () {
    context.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
  };

  cactusImage1 = new Image();
  cactusImage1.src = "./img/cactus1.png";

  cactusImage2 = new Image();
  cactusImage2.src = "./img/cactus2.png";

  cactusImage3 = new Image();
  cactusImage3.src = "./img/cactus3.png";

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
  document.addEventListener("keydown", moveDino);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    bool = confirm("Game Over! Play again?");
    if (bool) {
      gameOver = false;
      location.reload();
      return
    } if(!bool) {
      gameOver = true;
      window.close();
      return;
    }

  }
  context.clearRect(0, 0, board.width, board.height);

  //dino
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
  context.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);

  //cactus
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectCollision(dino, cactus)) {
      gameOver = true;
      dinoImage.src = "./img/dino-dead.png";
      dinoImage.onload = function () {
        context.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
      };
    }
  }

  //score
  context.fillStyle = "black";
  context.font = "20px courier";
  score++;
  context.fillText(score, 5, 20);
}

function moveDino(e) {
  if (gameOver) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    //jump
    velocityY = -10;
  } else if (e.code == "ArrowDown" && dino.y == dinoY) {
    //duck
  }
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  //place cactus
  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
  };

  let placeCactusChance = Math.random(); //0 - 0.9999...

  if (placeCactusChance > 0.9) {
    //10% you get cactus3
    cactus.img = cactusImage3;
    cactus.width = cactusWidth3;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    //30% you get cactus2
    cactus.img = cactusImage2;
    cactus.width = cactusWidth2;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.5) {
    //50% you get cactus1
    cactus.img = cactusImage1;
    cactus.width = cactusWidth;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 5) {
    cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}
