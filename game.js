//my consts
const playersBoard = document.querySelector(".players-board")
const computersBoard = document.querySelector(".computers-board")
const flipButton = document.querySelector(".flip-button")
const allShips = document.querySelectorAll(".ship-dock > div")
const dock = document.querySelector(".ship-dock")
const gameInfo = document.querySelector(".game-info")


// puts 100 game fielsd into each board
for (let i = 1; i <= 100; i++) {
    playersBoard.innerHTML += `<div id=${i}></div>`
    computersBoard.innerHTML += `<div id=${i}></div>`
}

// flip ships in the doc function
let shipAngle  = 0
function flipShip() {
    shipAngle = shipAngle === 0 ? 90 : 0
    allShips.forEach(ship => {
         ship.style.transform = `rotate(${shipAngle}deg)`
    })
}
flipButton.addEventListener("click", flipShip)

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
let notPlaced

function getValidity(boardBlocks, isHorizontal, startIndex, ship) {

    let goodStartIndex;
    if (isHorizontal) {
      // Calculate goodStartIndex for horizontal placement
      goodStartIndex = startIndex <= 100 - ship.length ? startIndex : 100 - ship.length;
    } else {
      // Calculate goodStartIndex for vertical placement
      goodStartIndex = startIndex <= 100 - 10 * ship.length ? startIndex : startIndex % 10;
    }
  
    // create array of board blocks busy with computer's ships
    const shipBlocks = [];
    for (let i = 0; i < ship.length; i++) {
      if (isHorizontal) {
        shipBlocks.push(boardBlocks[Number(goodStartIndex) + i]);
      } else {
        shipBlocks.push(boardBlocks[Number(goodStartIndex) + i * 10]);
      }
    }

  
    // prevent overflowing of ships  
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
  
    return {shipBlocks, noOverflow, notBusy}
}


// COPMUTER PLACE SHIPS RANDOMLY / PLAYER DROPS SHIPS
function placeShip(user, ship, startId) {
    const boardBlocks = document.querySelectorAll(`.${user}s-board div`);
    const randomBoolean = Math.random() < 0.5;
    const isHorizontal = user === "player" ? shipAngle === 0 : randomBoolean;
    let randomStartIndex = Math.floor(Math.random() * 100);

    let startIndex = startId ? startId : randomStartIndex

    const { shipBlocks, noOverflow, notBusy } = getValidity(boardBlocks, isHorizontal, startIndex, ship)
    // assign classes to board blocks if no overflow and not busy
    if (noOverflow && notBusy) {
      shipBlocks.forEach(shipBlock => {
        shipBlock.classList.add(ship.name);
        shipBlock.classList.add("busy");
      });
    } else {
        if (user === "computer") placeShip(user, ship, startId)
        if (user === "player") notPlaced = true
    }
}
  
// COPMUTER PLACE EACHE SHIP ON THE BOARD
shipsArray.forEach(ship => placeShip("computer", ship))

// DRAG PLAYERS SHIPS
let draggedPlayersShip;
const playersShipsArray = Array.from(allShips);
let shipsPlacedByPlayer =[]

// add event listener for each ship
playersShipsArray.forEach(optionShip => optionShip.addEventListener("dragstart", dragStart));

const playersBoardElements = document.querySelectorAll(".players-board > div");

playersBoardElements.forEach(boardBlock => {
  boardBlock.addEventListener("dragover", dragOver);
  boardBlock.addEventListener("drop", droppShip);
});

function dragStart(event){
  notPlaced = false;
  draggedPlayersShip = event.target;
}

function dragOver(event){
  event.preventDefault();
}

function droppShip(event){
    const dropStartId = event.target.id
    const ship = shipsArray[draggedPlayersShip.id]
    placeShip("player", ship, dropStartId)
    if (!notPlaced){
      shipsPlacedByPlayer.push(draggedPlayersShip)
      draggedPlayersShip.remove()

    }
  }



//LOGIC
  let gameOver = false
  let playersGo 


 // start button event listener
const startButton = document.querySelector(".start-button")
startButton.addEventListener("click", click => startGame())
 
//start the game if users ships are placed
function startGame(){
    if(shipsPlacedByPlayer.length !== 5){
    gameInfo.innerText = "Place all of your ships first!"
} else {
    const computersBoardBlocks = document.querySelectorAll(".computers-board div")
    computersBoardBlocks.forEach(block => {
        block.addEventListener("click", playerGuess, true)
    })
    gameInfo.innerText = "Guess computers ships positions!"
}
}

//store hit elements by each
let playerHits = []
let computerHits = []


// player can click on computers board and guess where the ships are
function playerGuess(event){
    if(!gameOver) {
        //hit is successful
        if(event.target.classList.contains("busy")){
            event.target.classList.add("hit")
            gameInfo.innerText = "You hit computers ship!"
            let hitShipsClasses = Array.from(event.target.classList)
            hitShipsClasses = hitShipsClasses.filter(className => className !== "busy")
            hitShipsClasses = hitShipsClasses.filter(className => className !== "hit")
            playerHits.push(...hitShipsClasses)
        }
        //player missed the ship
        if(!event.target.classList.contains("busy")) {
            gameInfo.innerText = "You missed!"
            event.target.classList.add("empty")
        }
        playersGo = false
        // remove the event listener from computers board as it"s computers turn now
        const computersBoardBlocks = document.querySelectorAll(".computers-board div")
        computersBoardBlocks.forEach(block => block.removeEventListener("click", playerGuess, true))
        setTimeout(()=>{
            gameInfo.innerText = "It's computers go!"
            computerGuess()
        },2000)
        
    }
}
// computer guesses players ship position
function computerGuess(){
    if(!gameOver){
        setTimeout(()=> {
            let guess = Math.floor(Math.random() * 100)
            const allPlayersBlocks = document.querySelectorAll(".players-board div")
            if (allPlayersBlocks[guess].classList.contains("busy") &&
                allPlayersBlocks[guess].classList.contains("hit")){
                computerGuess()
                return
            }
            else if (allPlayersBlocks[guess].classList.contains("busy") && 
            !allPlayersBlocks[guess].classList.contains("hit")) {
                allPlayersBlocks[guess].classList.add("hit")
                gameInfo.innerText = "Computer hit your ship!"
            }

        },2000)

    }
}







  



