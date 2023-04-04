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

// is it players turn
let playersGo 


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
    playersGo = true
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
 


 // start button event listener
const startButton = document.querySelector(".start-button")
startButton.addEventListener("click", click => startGame())
 
//start the game if users ships are placed
function startGame(){
    if(shipsPlacedByPlayer.length !== 5){
    gameInfo.innerText = "Place all of your ships on the left board first!"
} else {
    const computersBoardBlocks = document.querySelectorAll(".computers-board div")
    computersBoardBlocks.forEach(block => {
        block.addEventListener("click", playerGuess, true)
    })
    gameInfo.innerText = "Guess computer's ship positions on the left board!"
}
}

//store hit elements by each
let playerHits = []
let computerHits = []

// ships sunk by player (of computer)
const playerSunkShips = []
// ships sunk by computer (of player)
const computerSunkShips = []

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
            //check score
            checkHits("player", playerHits, playerSunkShips)
        }

        if(!gameOver) { 
        
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
        },1000)
    }
    }
    
}
//------------------------------------------------------------------------------------------------------------------------------
 // decide on next move based on previously hit
//strategic logic
let guess
let hitInLastMove
let lastGuess
let doubleSuccess

console.log(guess)


// creates an array of future guesses when one ship is hit
function nextStrategicMove(lastSuccesfullGuess){
    const allPlayersBlocks = document.querySelectorAll(".players-board div")
    let nextStrategicSteps = []

    if( 
        !allPlayersBlocks[lastSuccesfullGuess + 1].classList.contains("empty") &&
         !allPlayersBlocks[lastSuccesfullGuess + 1].classList.contains("hit")
          ){
            nextStrategicSteps.push(lastSuccesfullGuess + 1)
    }
    if( 
        (lastSuccesfullGuess - 1) > 0 && !allPlayersBlocks[lastSuccesfullGuess - 1].classList.contains("empty") &&
         !allPlayersBlocks[lastSuccesfullGuess - 1].classList.contains("hit")
          ){
            nextStrategicSteps.push(lastSuccesfullGuess - 1)
    }
    if( 
        !allPlayersBlocks[lastSuccesfullGuess + 10].classList.contains("empty") &&
         !allPlayersBlocks[lastSuccesfullGuess + 10].classList.contains("hit")
          ){
            nextStrategicSteps.push(lastSuccesfullGuess + 10)
    }
    if( 
        (lastSuccesfullGuess - 1) > 0 && !allPlayersBlocks[lastSuccesfullGuess - 10].classList.contains("empty") &&
         !allPlayersBlocks[lastSuccesfullGuess - 10].classList.contains("hit")
          ){
            nextStrategicSteps.push(lastSuccesfullGuess - 10)
    }
    return nextStrategicSteps

}

function getStrategicGuess(lastGuessID){
    
    nextStrategicStepsArray = nextStrategicMove(lastGuessID)
    let oneStrategicGuessPosition = Math.floor(Math.random() * nextStrategicStepsArray.length)

    const allPlayersBlocks = document.querySelectorAll(".players-board div")
    if (
      !allPlayersBlocks[nextStrategicStepsArray[oneStrategicGuessPosition]].classList.contains("empty") &&
      !allPlayersBlocks[nextStrategicStepsArray[oneStrategicGuessPosition]].classList.contains("hit")
    ){ 
    return nextStrategicStepsArray[oneStrategicGuessPosition]
    } 
    else {getStrategicGuess(lastGuessID)
    }
}

//------------------------------------------------------------------------------------------------------------------------------
// computer guesses players ship position
function computerGuess(){
    if(!gameOver){
    
        setTimeout(()=> {

            let guess
            if (hitInLastMove === false || lastGuess === undefined) {
                guess = Math.floor(Math.random() * 100)
            } 
            if (hitInLastMove === true && lastGuess !== undefined){
                guess = getStrategicGuess(lastGuess)
            }


            const allPlayersBlocks = document.querySelectorAll(".players-board div")
            if (allPlayersBlocks[guess].classList.contains("empty") ||
                allPlayersBlocks[guess].classList.contains("hit")){
                computerGuess()
                return
            }

            // handle computer hitting players ship, ship gets added to computerHits array
            else if (allPlayersBlocks[guess].classList.contains("busy") && 
            !allPlayersBlocks[guess].classList.contains("hit")) {
                allPlayersBlocks[guess].classList.add("hit")
                gameInfo.innerText = "Computer hit your ship, sad times..."
                let hitShipsClasses = Array.from(allPlayersBlocks[guess].classList)
                hitShipsClasses = hitShipsClasses.filter(className => className !== "busy")
                hitShipsClasses = hitShipsClasses.filter(className => className !== "hit")
                computerHits.push(...hitShipsClasses)

                //strategic logic
                hitInLastMove = true
                lastGuess = guess


                //check score
                checkHits("computer", computerHits, computerSunkShips)

            } 
            // if computer misses
            else {
                gameInfo.innerText = "Computer missed, lucky you!"
                allPlayersBlocks[guess].classList.add("empty")

                //strategic logic
                hitInLastMove = false
                  
            }
        },1000)
   
        //let player know its their turn
        if(!gameOver){
        setTimeout(()=> {
            gameInfo.innerText = "Your turn!"
        }, 3000)
        }

        // add event listener to computers board and player can guess again
             setTimeout(() => {
                 playersGo = true
                 //gameInfo.innerText = "Your turn!"
                 const computersBoardBlocks = document.querySelectorAll(".computers-board div")
                 computersBoardBlocks.forEach(block => {
                 block.addEventListener("click", playerGuess, true)
                 })
        })
        
    }
}

// check what was hit playerHits/ computerHits arrays, elements are removed and stored in userSunkShips
function checkHits(user, userHits, userSunkShips) {

    //if all element of a ship are in 
    function checkShip(shipName, shipLength){
        if (userHits.filter(storedShipName =>
            storedShipName === shipName).length === shipLength){
                gameInfo.innerText = `${shipName[0].toUpperCase() + shipName.slice(1, shipName.length)} was sunk!`
                if (user === "player"){
                    playerHits = userHits.filter(storedShipName => storedShipName !==shipName)
                }
                if (user === "computer"){
                    computerHits = userHits.filter(storedShipName => storedShipName !==shipName)
                }
                userSunkShips.push(shipName)
            }
            
    }
    // check If any of the ships was already hit
    checkShip("carrier", 6)
    checkShip("battleship", 5)
    checkShip("cruiser", 4)
    checkShip("submarine", 3)
    checkShip("destroyer", 2)


    //loosing/winning logic
    if (computerSunkShips.length === 5){
        gameInfo.innerText = "All of your ships were sunk! You LOST!"
        gameOver = true

        setTimeout(()=> {
          window.location.href = "./over.html"
        }, 8000)


    }
    if (playerSunkShips.length === 5){
        gameInfo.innerText = "All computer's ships sunk! You are the WINNER!"
        gameOver = true


        setTimeout(()=> {
          window.location.href = "./over.html"
        }, 8000)

    }

}










  



