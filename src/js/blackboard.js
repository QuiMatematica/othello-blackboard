import Position from "./position";
import Board from "./board";

export default class Blackboard {

    currentPosition;
    board;

    constructor(container) {
        this.currentPosition = Position.getStartingPosition();
        this.board = new Board(container, null)
    }

}