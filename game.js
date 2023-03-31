//my consts
const playersBoard = document.querySelector(".players-board")
const computersBoard = document.querySelector(".computers-board")
const flipButton = document.querySelector(".flip-button")


const allShips = document.querySelectorAll(".ship-dock > div")
const carrier = document.querySelector(".carrier")
const battleship = document.querySelector(".battleship")
const cruiser = document.querySelector(".cruiser")
const submarine = document.querySelector(".submarine")
const destroyer = document.querySelector(".destroyer")


// puts 100 game fielsd into each board
for (let i = 1; i <= 100; i++) {
    playersBoard.innerHTML += `<div class="${i}"></div>`
    computersBoard.innerHTML += `<div class="${i}"></div>`
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



////DRAG

function placeShipOnBoard(battleship){ 
let shipInitialX = 0
let shipInitialY = 0
let movingShipX = 0
let movingShipY = 0
let isDragging = false;

allShips.forEach(ship => {
    ship.addEventListener("mousedown",dragStart)
})

function dragStart(event){

    shipInitialX = event.clientX - movingShipX;
    shipInitialY = event.clientY - movingShipY;

    if (event.target === battleship) {
        isDragging = true;
        document.addEventListener('mousemove', dragProcess);
        document.addEventListener('mouseup', dragStop);
      }
}

function dragProcess(event) {

    if (isDragging) {
        movingShipX = event.clientX - shipInitialX;
        movingShipY = event.clientY - shipInitialY;
    
        battleship.style.transform = `translate(${movingShipX}px, ${movingShipY}px)`;
      }   
}
function dragStop(event){
    shipInitialX = movingShipX;
    shipInitialY = movingShipY;

    isDragging = false;

    document.removeEventListener('mousemove', dragStart);
    document.removeEventListener('mouseup', dragStop);
} 
}
allShips.forEach(ship => {
    placeShipOnBoard(ship)
})
//


//DROP THE SHIP
// const individualBoardBlock = document.querySelector(".players-board > div")
// BELOW DOES NOT WORK
document.querySelectorAll(".players-board > div").forEach(ship => {
    ship.addEventListener("mouseup",dropShip)
})

function dropShip(){
    console.log("dropped")
}

// Problems:
// it is not possible to place flipped ships




