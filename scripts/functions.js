import { boardWidth, boardHeight, stepTimeSec, scoreIncrement, boardEl, piecesTemplate, rotations, types, setGameState, getGameState, highScoreEl, stats, piecesCache, currPiece, nextPiece, fullCells } from "./globals.js";

export function flushCellClass(cell){
    cell.classList.remove(...types);
}

function isCellEmpty(cell){
    return types.every(t => !cell.classList.contains(t));
}

// setup
export function setupBoard() {
    window.dispatchEvent(new CustomEvent('game-lives-decrement', {detail: {lives:stats.livesLeft}}));

    // setup cells
    for (let i = 0; i < boardWidth * boardHeight; i++){
        boardEl.insertAdjacentHTML("beforeend", `<div class="cell"></div>`);
    }

    // cache all possible rotations of all pieces so we don't recalculate it
    for (const [name, shape] of Object.entries(piecesTemplate)) {
        let current = shape.map((line) => line.split(""));

        piecesCache[name] = {};
        for (const rot of rotations) {
            piecesCache[name][rot] = current;
            current = rotate90(current);
        }
    }
    // console.log(piecesCache); // TEMP

    // next piece
    nextPiece.type = types[Math.floor(Math.random() * types.length)];
    window.dispatchEvent(new CustomEvent('game-next-piece-chosen', {detail: {pieceType:nextPiece.type, piece:piecesCache[nextPiece.type][0]}}));

    // start game
    spawnNextPiece();
}

function rotate90(current) {
    const width = current.length;
    const height = current[0].length;

    const result = [];

    for (let c = 0; c < height; c++) {
        const newRow = [];
        for (let r = width - 1; r >= 0; r--) {
            newRow.push(current[r][c]);
        }
        result.push(newRow);
    }

    return result;
}


/**
 * check if piece can be placed at X,Y
 * @param {number} x - X position of the most top left block
 * @param {number} y - y position of the most top left block
 * @param {string} pieceType - type (O, I, L etc...)
 * @param {number} rotation - 90 degrees interval
 * @returns {boolean} false if placement is not possible
 */
export function canPlacePieceAt(x, y, pieceType, rotation){
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

                for (let full of fullCells){
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
export function placePieceAt(x, y, pieceType, rotation, isShadow) {
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
                if (isShadow) {
                    if (cells[index].classList.length === 1) {
                        cells[index].classList.add('ghost');
                    }
                } else {
                    cells[index].classList.add(pieceType);
                }
            }
        }
    }
}

/**
 * spawns a random piece at the top based on `nextPiece.type`
 */
function spawnNextPiece(){
    currPiece.type = nextPiece.type;
    currPiece.Rotation = 0;
    currPiece.Y = 0;

    const shapeWidth = piecesCache[currPiece.type][currPiece.Rotation][0].length;
    currPiece.X = Math.round((boardWidth - shapeWidth) / 2); // middle of board
    
    nextPiece.type = types[Math.floor(Math.random() * types.length)];
    window.dispatchEvent(new CustomEvent('game-next-piece-chosen', {detail: {pieceType:nextPiece.type, piece:piecesCache[nextPiece.type][0]}}));
    
    // render
    if (canPlacePieceAt(currPiece.X, currPiece.Y, currPiece.type, currPiece.Rotation) == false){
        stats.livesLeft--;
        window.dispatchEvent(new CustomEvent('game-lives-decrement', {detail: {lives:stats.livesLeft}}));

        if (stats.livesLeft === 0){
            // game over, no more lives
            setGameState("prompt-over");
            window.dispatchEvent(new CustomEvent('game-over'));
            return;
        } else {
            // try again
            fullCells.length = 0; // fullCells = [];
            setGameState("clear-all");
            return;
        }
    } else {
        placePieceAt(currPiece.X, currPiece.Y, currPiece.type, currPiece.Rotation);
    }
}

/**
 * "undo" render of current piece, used for animating a fall
 */
export function eraseCurrentPiece() {
    const shape = piecesCache[currPiece.type][currPiece.Rotation];
    const cells = boardEl.children;
    const height = shape.length;
    const width = shape[0].length;

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (shape[row][col] !== " ") {
                const boardX = currPiece.X + col;
                const boardY = currPiece.Y + row;
                const index = boardY * boardWidth + boardX;

                flushCellClass(cells[index]);
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

    for (let y = 0; y < boardHeight; y++) {
        let completed = 0;
        for (let x = 0; x < boardWidth; x++) {
            if (fullCells.some(cell => cell.x === x && cell.y === y)) { // just check if not instead
                completed++;
            }
        }

        if (completed == boardWidth){
            ret.push(y);
        }
    }

    console.log("Completed Lines: ", ret);
    return ret;
}

// ****************************************

function eraseShadow() {
    document.querySelectorAll('.cell').forEach(e => e.classList.remove('ghost'))
}

function placeShadow() {
    eraseShadow();
    let shadowY = currPiece.Y;
    while(canPlacePieceAt(currPiece.X, shadowY + 1, currPiece.type, currPiece.Rotation)) {
        shadowY++;
    }
    placePieceAt(currPiece.X, shadowY, currPiece.type, currPiece.Rotation, true);
}

// ****************************************

/**
 * move the current piece down by one step
 */
export function fall(){
    if (canPlacePieceAt(currPiece.X, currPiece.Y+1, currPiece.type, currPiece.Rotation) == false){ // hit the floor
        // add to fullCells
        const shape = piecesCache[currPiece.type][currPiece.Rotation];
        const height = shape.length;
        const width = shape[0].length;
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                if (shape[row][col] !== " ") {
                    const boardX = currPiece.X + col;
                    const boardY = currPiece.Y + row;

                    fullCells.push({ x: boardX, y: boardY, type:currPiece.type });
                }
            }
        }

        // check completed lines
        const completed = getCompletedLines();
        const cells = boardEl.children;
        for (let y of completed){
            for (let x = 0; x < boardWidth; x++){
                // clear line
                const index = y * boardWidth + x;
                flushCellClass(cells[index]);
                fullCells.splice(fullCells.findIndex(cell => cell.x === x && cell.y === y), 1);
            }
        }

        // shift all lines above down
        for (let cell of fullCells) {
            let shift = 0;
            for (let clearedY of completed) {
                if (cell.y < clearedY){
                    shift++;
                }
            }

            cell.y += shift;
        }

        // redraw board
        for (let i = 0; i < cells.length; i++) {
            flushCellClass(cells[i]);
        }
        for (let cell of fullCells) {
            const index = cell.y * boardWidth + cell.x;
            cells[index].classList.add(cell.type);
        }

        window.dispatchEvent(new CustomEvent('game-score-increment', {detail: {score:scoreIncrement * completed.length}}));

        spawnNextPiece();
    } else {
        eraseCurrentPiece();
        currPiece.Y++;
        placePieceAt(currPiece.X, currPiece.Y, currPiece.type, currPiece.Rotation);
    }
}



/**
 * game logic, runs every `stepTimeSec`
 */
export function update(timestamp){
    if (stats.isPaused){
        stats.lastTime = timestamp;
        requestAnimationFrame(update);
        return;
    }

    let gameState = getGameState();
    
    if (gameState === "game"){
        const delta = (timestamp - stats.lastTime) / 1000;
        stats.lastTime = timestamp;
        stats.stepTimer += delta;
    
        window.dispatchEvent(new CustomEvent('game-time-increment', {detail: {delta:delta}}));
    
        if (stats.stepTimer >= stepTimeSec){
            // move current piece +1Y
            stats.stepTimer = 0.0;
            fall();
        }
    }

    else if (gameState === "clear-all"){
        const cells = boardEl.children;
        let erased = false;
        
        outerLoop: for (let row = 0; row < boardHeight; row++) {
            for (let col = 0; col < boardWidth; col++) {
                const index = row * boardWidth + col;

                if (isCellEmpty(cells[index]) === false){
                    flushCellClass(cells[index]);
                    erased = true;
                    break outerLoop;
                }
            }
        }
        if (erased === false){
            // all erased, back to game
            setGameState("game");
        }
    }

    placeShadow(); //
    requestAnimationFrame(update);
}

export function setHighscore(){
    if (Number(highScoreEl.textContent) < stats.score){
        highScoreEl.textContent = stats.score;
        localStorage.setItem("highScore", stats.score);
    }
}