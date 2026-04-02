import { boardWidth, boardHeight, stepTimeSec, scoreIncrement } from "./global.js";

const boardEl = document.querySelector(".board");

let isPaused = false;
let stepTimer = 0.0;
let lastTime = 0.0;
const piecesTemplate = {
  O:[
        "00",
        "00"
    ],
  I:["0000"],
  T:[
        "000",
        " 0 "
    ],
  L:[
        "  0",
        "000"
    ],
  Z:[
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
 * check if piece can be placed at X,Y
 * @param {number} x - X position of the most top left block
 * @param {number} y - y position of the most top left block
 * @param {string} pieceType - type (O, I, L etc...)
 * @param {number} rotation - 90 degrees interval
 * @returns {boolean} false if placement is not possible
 */
function canPlacePieceAt(x, y, pieceType, rotation){
    if (!types.includes(pieceType) || !rotations.includes(rotation)) {
        // bad args
        return false;
    }

    const shape = piecesCache[pieceType][rotation];
    let height = shape.length, width = shape[0].length;
    
    // collision with other pieces
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (shape[row][col] !== " ") {
                const boardX = x + col;
                const boardY = y + row;

                if (x < 0 || x+width > boardWidth || y < 0 || y+height > boardHeight){
                    // out of bounds
                    return false;
                }

                let blocked = false;
                for (let full of fullSquares){
                    if (full.x === boardX && full.y === boardY){
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

/**
 * main function for positioning pieces, make sure to call `canPlacePieceAt` first
 * @param {number} x - X position of the most top left block
 * @param {number} y - y position of the most top left block
 * @param {string} pieceType - type (O, I, L etc...)
 * @param {number} rotation - 90 degrees interval
 */
function placePieceAt(x, y, pieceType, rotation) {
    // render to dom
    const shape = piecesCache[pieceType][rotation];
    let height = shape.length, width = shape[0].length;
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
}

/**
 * spawns a random piece at the top based on `nextPieceType`
 */
function spawnNextPiece(){
    if (nextPieceType === undefined){ // true on first call
        nextPieceType = types[Math.floor(Math.random() * types.length)];
    }
    
    currPieceType = nextPieceType;
    currPieceRotation = 0;
    currPieceY = 0;

    const shapeWidth = piecesCache[currPieceType][currPieceRotation][0].length;
    currPieceX = Math.round((boardWidth - shapeWidth) / 2); // middle of board
    

    nextPieceType = types[Math.floor(Math.random() * types.length)];

    // TODO: send event to menus.js to draw next piece in UI
    
    // render
    if (canPlacePieceAt(currPieceX, currPieceY, currPieceType, currPieceRotation) == false){
        // TODO: game lost, -1 life
        console.log("GAME OVER");
    } else {
        placePieceAt(currPieceX, currPieceY, currPieceType, currPieceRotation);
    }
}

/**
 * "undo" render of current piece, used for animating a fall
 */
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

/**
 * find all lines that are horizontaly completed (all cells full)
 * @returns {Array} a list of indexes of Y lines that are complete
 */
function getCompletedLines(){
    let ret = [];

    const cells = boardEl.children;
    for (let y = 0; y < boardHeight; y++) {
        let completed = 0;
        for (let x = 0; x < boardWidth; x++) {
            const index = y * boardWidth + x;
            if (cells[index].classList.contains("active")) {
                completed++;
            }
        }

        if (completed == boardWidth){
            ret.push(y);
        }
    }

    return ret;
}

// game loop
requestAnimationFrame(update);

/**
 * game logic, runs every `stepTimeSec`
 */
function update(timestamp){
    if (isPaused){
        lastTime = timestamp;
        requestAnimationFrame(update);
        return;
    }

    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    stepTimer += delta;

    window.dispatchEvent(new CustomEvent('game-time-increment', {detail: {delta:delta}}));

    if (stepTimer < stepTimeSec){
        requestAnimationFrame(update);
        return;
    }
    stepTimer = 0.0;
    
    // curr piece y+1
    if (canPlacePieceAt(currPieceX, currPieceY+1, currPieceType, currPieceRotation) == false){ // hit the floor
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

        // check completed lines
        const completed = getCompletedLines();
        const cells = boardEl.children;
        for (let y of completed){
            for (let x = 0; x < boardWidth; x++){
                const index = y * boardWidth + x;
                cells[index].classList.remove("active");
                fullSquares.splice(fullSquares.findIndex(cell => cell.x === x && cell.y === y), 1);
            }
        }
        window.dispatchEvent(new CustomEvent('game-score-increment', {detail: {score:scoreIncrement * completed.length}}));
        // TODO: shift all lines above down

        spawnNextPiece();
    } else {
        eraseCurrentPiece();
        currPieceY++;
        placePieceAt(currPieceX, currPieceY, currPieceType, currPieceRotation);
    }

    requestAnimationFrame(update);
}

// events

addEventListener("keydown", (ev) => {
    console.log(ev.key);
    switch (ev.key){
        case "ArrowUp":
            const newRot = rotations[(rotations.indexOf(currPieceRotation) + 1) % rotations.length]; // next rotation
            if (canPlacePieceAt(currPieceX, currPieceY, currPieceType, newRot)){
                eraseCurrentPiece();
                currPieceRotation = newRot;
                placePieceAt(currPieceX, currPieceY, currPieceType, currPieceRotation);
            }
            break;

        case "ArrowDown":
            break;

        case "ArrowLeft":
            if (canPlacePieceAt(currPieceX-1, currPieceY, currPieceType, currPieceRotation)){
                eraseCurrentPiece();
                currPieceX -= 1;
                placePieceAt(currPieceX, currPieceY, currPieceType, currPieceRotation);
            }
            break;

        case "ArrowRight":
            if (canPlacePieceAt(currPieceX+1, currPieceY, currPieceType, currPieceRotation)){
                eraseCurrentPiece();
                currPieceX += 1;
                placePieceAt(currPieceX, currPieceY, currPieceType, currPieceRotation);
            }
            break;

        case " ":
            break;
    }
});

addEventListener("menu-pause", (ev) => {
    isPaused = ev.detail.isPaused;
});