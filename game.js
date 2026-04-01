import { boardWidth, boardHeight, stepTimeSec } from "./global.js";

const boardEl = document.querySelector(".board");

let stepTimer = 0.0;
const piecesTemplate = {
  O: [
    "00",
    "00"
],
  I: ["0000"],
  T: [
    "000",
    " 0 "
],
  L: [
    "00 ",
    " 0 ",
    " 0 "
],
  Z: [
    "00 ",
    " 00"
],
};

const rotations = [
    0, 90, 180, 270,
]
const types = [
    "O", "I", "T", "L", "Z"
]

let currPieceType, currPieceX, currPieceY, currPieceRotation;
let nextPieceType;

let piecesCache = {};
let fullSquares = []; // {x, y}

// setup
(() => {
    // setup cells
    for (let i = 0; i < boardWidth * boardHeight; i++){
        boardEl.insertAdjacentHTML("beforeend", `<div class="cell"></div>`);
    }

    // cache all possible rotations of all pieces so we don't recalculate it
    function rotate90(current) {
        const rowLen = current.length;
        const colLen = current[0].length;

        const result = [];

        for (let c = 0; c < colLen; c++) {
            const newRow = [];
            for (let r = rowLen - 1; r >= 0; r--) {
                newRow.push(current[r][c]);
            }
            result.push(newRow);
        }

        return result;
    }

    
    for (const [name, shape] of Object.entries(piecesTemplate)) {
        let current = shape.map((line) => line.split(""));

        piecesCache[name] = {};
        for (const rot of rotations) {
            piecesCache[name][rot] = current;
            current = rotate90(current);
        }
    }
    console.log(piecesCache); // TEMP

    // start game
    spawnNextPiece();
})();


/**
 * main function for positioning pieces
 * @param {number} x - X position of the most top left block
 * @param {number} y - y position of the most top left block
 * @param {string} pieceType - type (O, I, L etc...)
 * @param {number} rotation - 90 degrees interval
 * @returns {boolean} false if placement is not possible
 */
function placePieceAt(x, y, pieceType, rotation) {
    if (!(pieceType in types) || rotations.includes(rotation) == false){
        // bad args
        return false;
    }

    const shape = piecesCache[pieceType][rotation];
    let width = shape.length, height = shape[0].length;
    if (x < 0 || x+width > boardWidth || y < 0 || y+height > boardHeight){
        // out of bounds
        return false;
    }

    // collision with other pieces
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (shape[row][col] !== " ") {
                const boardX = x + col;
                const boardY = y + row;

                let blocked = false;
                for (full of fullSquares){
                    if (full.x === boardX && full.y === boardY){
                        return false;
                    }
                }
            }
        }
    }

    // render to dom
    const cells = boardEl.children;
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (shape[row][col] !== " ") {
                const boardX = x + col;
                const boardY = y + row;

                const index = boardY * boardWidth + boardX;
                cells[index].classList.add("active");
            }
        }
    }

    return true;
}

function spawnNextPiece(){
    if (nextPieceType === null){ // true on first call
        nextPieceType = types[Math.floor(Math.random() * types.length)]
    }

    currPieceType = nextPieceType;
    currPieceRotation = 0;
    currPieceX = boardWidth/2;
    currPieceY = 0;

    nextPieceType = types[Math.floor(Math.random() * types.length)]

    // TODO: send event to menus.js to draw next piece
}

function eraseCurrentPiece() {
    const shape = piecesCache[currPieceType][currPieceRotation];
    const cells = boardEl.children;
    const height = shape.length;
    const width = shape[0].length;

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (shape[row][col] !== " ") {
                const boardX = currPieceX + col;
                const boardY = currPieceY + row;
                const index = boardY * boardWidth + boardX;

                cells[index].classList.remove("active");
            }
        }
    }
}

// game loop
window.requestAnimationFrame(update)

function update(timestamp){
    stepTimer += timestamp;
    if (stepTimer < stepTimeSec){
        window.requestAnimationFrame(update);
        return;
    }
    stepTimer = 0.0;
    
    // curr piece y+1
    let moved = placePieceAt(currPieceX, currPieceY+1, currPieceType, currPieceRotation);
    if (moved == false){
        // hit the floor
        spawnNextPiece();

        // add to fullSquares
        const shape = piecesCache[currPieceType][currPieceRotation];
        const height = shape.length;
        const width = shape[0].length;
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                if (shape[row][col] !== " ") {
                    const boardX = currPieceX + col;
                    const boardY = currPieceY + row;

                    fullSquares.push({ x: boardX, y: boardY });
                }
            }
        }

        // TODO: code for winning and loosing
    } else {
        eraseCurrentPiece();
    }

    // TODO: apply controls

    window.requestAnimationFrame(update);
}