// game logic (movement, game over...)

import { boardWidth, boardHeight } from "./global.js";

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

let currPieceType, currPieceX, currPieceY, currPieceRotation;
let nextPieceType;

let piecesCache = {};
let fullSquares = []; // {x, y}

(() => {
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
})();

console.log(piecesCache); // TEMP

/**
 * main function for positioning pieces
 * @param {number} x - X position of the most top left block
 * @param {number} y - y position of the most top left block
 * @returns {boolean} false if placement is not possible
 */
function placePieceAt(x, y, pieceType, rotation) {
    if (!(pieceType in piecesTemplate) || rotations.includes(rotation) == false){
        return false;
    }

    const shape = piecesCache[pieceType][rotation];
    let width = shape.length, height = shape[0].length;
    if (x < 0 || x+width > boardWidth || y < 0 || y+height > boardHeight){
        return false;
    }

    // TODO: detect collision with other pieces

    return true;
}