import Position from "./position";
import Board from "./board";
import Square from "./square";
import {isAnimatingFlip} from "./page";

let theBoard;

export default class Blackboard {

    currentPosition;
    currentMode;
    board;

    constructor(container) {
        theBoard = this;

        this.currentPosition = Position.getStartingPosition();

        this.currentMode = new PlayMode(this);

        this.board = new Board(container, onClick);
        this.board.setPosition(this.currentPosition);
    }

    onClick(x, y) {
        this.currentMode.onClick(x, y);
    }

}

function onClick(event) {
    if (isAnimatingFlip()) {
        return;
    }

    const div = event.currentTarget;
    const {x, y} = div.dataset;  // NOTE: strings, not ints
    theBoard.onClick(x, y);
}

class PlayMode {

    board;

    constructor(board) {
        this.board = board;
    }

    onClick(x, y) {
        const square = new Square(parseInt(x), parseInt(y));
        const nextPosition = this.board.currentPosition.playStone(square, false);
        // If the play was valid, update the views.
        if (nextPosition != null) {
            this.board.currentPosition = nextPosition;
            this.board.board.playPosition(nextPosition);
            // this.score.takeScore(this.currentPosition);
            // this.controls.update(this.currentPosition);
        }
    }

}

class SetMode {

}

class DrawMode {

}

class LessonsMode {

}