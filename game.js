//my consts
const playersBoard = document.querySelector(".players-board")
const computersBoard = document.querySelector(".computers-board")
const flipButton = document.querySelector(".flip-button")
const allShips = document.querySelectorAll(".ship-dock > div")

// puts 100 game fielsd into each board
for (let i = 1; i <= 100; i++) {
    playersBoard.innerHTML += `<div id=${i} class=""></div>`
    computersBoard.innerHTML += `<div id=${i} class=""></div>`
}

// flip ships in the doc function
flipButton.addEventListener("click", click => {
    flipShip()
})

allShips.forEach(ship => {
    ship.style.transform = "none"
})

function flipShip() {
    allShips.forEach(ship => {
        ship.style.transform === "none" ? ship.style.transform = "rotate(90deg)" : ship.style.transform = "none"
    })
}

//CREATE A SHIP FOR COMPUTER
class Ship {
    constructor (name, length){
        this.name = name,
        this.length =length
    }
}
const carrier = new Ship("carrier", 6)
const battleship = new Ship("battleship", 5)
const cruiser = new Ship("cruiser", 4)
const submarine = new Ship("submarine", 3)
const destroyer = new Ship("destroyer", 2)

const shipsArray = [carrier, battleship, cruiser, submarine, destroyer]

// COPMUTER PLACE SHIPS RANDOMLY
function computerPlaceShip(ship) {
    const computersBoardBlocks = document.querySelectorAll(".computers-board div");
    const randomBoolean = Math.random() < 0.5;
    const isHorizontal = randomBoolean;
    let randomStartIndex = Math.floor(Math.random() * 100);
  
    let goodStartIndex;
    if (isHorizontal) {
      // Calculate goodStartIndex for horizontal placement
      goodStartIndex = randomStartIndex <= 100 - ship.length ? randomStartIndex : 100 - ship.length;
    } else {
      // Calculate goodStartIndex for vertical placement
      goodStartIndex = randomStartIndex <= 100 - 10 * ship.length ? randomStartIndex : randomStartIndex % 10;
    }
  
    // create array of board blocks busy with computer's ships
    const shipBlocks = [];
    for (let i = 0; i < ship.length; i++) {
      if (isHorizontal) {
        shipBlocks.push(computersBoardBlocks[Number(goodStartIndex) + i]);
      } else {
        shipBlocks.push(computersBoardBlocks[Number(goodStartIndex) + i * 10]);
      }
    }
  
    // prevent overflowing of computer's ships  
    let noOverflow = true;
    if (isHorizontal) {
      noOverflow = shipBlocks.every((_shipBlock, index) => {
        const lastBlock = shipBlocks[shipBlocks.length - 1];
        return lastBlock.id % 10 >= index + 1 && !lastBlock.classList.contains("busy");
      });
    } else {
      noOverflow = shipBlocks.every((_shipBlock, index) => {
        const lastBlock = shipBlocks[shipBlocks.length - 1];
        return lastBlock.id <= 90 + (index + 1) * 10 && !lastBlock.classList.contains("busy");
      });
    }
  
    // prevent stacking ships on top of each other
    const notBusy = shipBlocks.every(shipBlock => !shipBlock.classList.contains("busy"));
  
    // computer place random ships if no overflow
    if (noOverflow && notBusy) {
      shipBlocks.forEach(shipBlock => {
        shipBlock.classList.add(ship.name);
        shipBlock.classList.add("busy");
      });
    } else {
      computerPlaceShip(ship);
    }
}
  
// COPMUTER PLACE EACHE SHIP ON THE BOARD
shipsArray.forEach(ship => {
computerPlaceShip(ship) 
})








