let cols, rows;
let w = 1450;
let h = 720;
let scl = 20;

let flying = 0;

function setup() {
  createCanvas(w, h);
  cols = w / scl;
  rows = h / scl;

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
  fill("#4BC2FF") //("#317EF7") //("#DBA01F")  //("#FFE577");
  textSize(100);
  textAlign(CENTER, CENTER);
  text("THE BATTLESHIP GAME", width / 2, height / 2 -100);

  fill("#8AFFFF");
  textSize(60);
  textAlign(CENTER, CENTER);
  text("Make' em sink!!", width / 2, height / 2);

  button = createButton("Let's go!");
  button.class("go-button")
  button.position(width / 2 -100, 500)
  button.mousePressed(goToNextPage);
  
}

function goToNextPage() {
    window.location.href = "./game-index.html";
  }



