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
    "0", "90", "180", "270",
]

let currPieceType, currPieceX, currPieceY, currPieceRotation;
let nextPieceType;
