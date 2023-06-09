let cols, rows;
let w = 1450;
let h = 720;
let scl = 20;

let flying = 0;

function setup() {
  createCanvas(w, h);
  cols = w / scl;
  rows = h / scl;

  button = createButton("Play again");
  button.class("play-again-button")
  button.mousePressed(playAgain);
}

function draw() {
  background(0);
  stroke(255); 
  noFill();

  flying += 0.015;

  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let c = map(noise(xoff, yoff, flying), 0, 1, -1, 4);
      fill(c * 50, c * 130, c * 255); // 50, 130, 255
      noStroke();
      rect(x * scl, y * scl, scl, scl);
      xoff += 0.1;
    }
    yoff += 0.1;
  }
  stroke("black")
  strokeWeight(7)
  fill("#4BC2FF") 
  textSize(100);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2 -100);
  
}

function playAgain() {
    window.location.href = "./game-index.html";
  }