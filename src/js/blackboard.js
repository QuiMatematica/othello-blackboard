import Position, {WHITE} from "./position";
import Board from "./board";
import Square from "./square";
import {isAnimatingFlip} from "./page";

let theBoard;

export default class Blackboard {

    currentPosition;
    currentMode;
    board;

    constructor() {
        theBoard = this;

        this.currentPosition = Position.getStartingPosition();

        this.board = new Board(onClick);
        this.board.setPosition(this.currentPosition);

        this.currentMode = new PlayMode(this);
        this.currentMode.update();
    }

    onClick(x, y) {
        this.currentMode.onClick(x, y);
    }

    update(nextPosition) {
        this.currentPosition = nextPosition;
        this.board.setPosition(nextPosition);
    }

    play(nextPosition) {
        this.currentPosition = nextPosition;
        this.board.playPosition(nextPosition);
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
    scoreElements = {};
    turnElement;
    first;
    next;
    prev;
    last;

    constructor(board) {
        this.board = board;
        this.scoreElements.black = document.querySelector('#black-score');
        this.scoreElements.white = document.querySelector('#white-score');
        this.turnElement = document.querySelector('#turn');

        this.first = document.querySelector('#first');
        this.first.addEventListener('click', () => {
            let curPosition = this.board.currentPosition;
            let prevPosition = curPosition.prevPosition;
            if (prevPosition != null) {
                while (prevPosition != null) {
                    curPosition = prevPosition;
                    prevPosition = curPosition.prevPosition;
                }
                this.board.update(curPosition);
                this.update();
            }
        })
        this.prev = document.querySelector('#prev');
        this.prev.addEventListener('click', () => {
            const prevPosition = this.board.currentPosition.prevPosition;
            if (prevPosition != null) {
                this.board.update(prevPosition);
                this.update();
            }
        })
        this.next = document.querySelector('#next');
        this.next.addEventListener('click', () => {
            const nextPosition = this.board.currentPosition.nextPosition;
            if (nextPosition != null) {
                this.board.play(nextPosition);
                this.update();
            }
        })
        this.last = document.querySelector('#last');
        this.last.addEventListener('click', () => {
            let curPosition = this.board.currentPosition;
            let nextPosition = curPosition.nextPosition;
            if (nextPosition != null) {
                while (nextPosition != null) {
                    curPosition = nextPosition;
                    nextPosition = curPosition.nextPosition;
                }
                this.board.update(curPosition);
                this.update();
            }
        })
    }

    onClick(x, y) {
        const square = new Square(parseInt(x), parseInt(y));
        const nextPosition = this.board.currentPosition.playStone(square, false);
        // If the play was valid, update the views.
        if (nextPosition != null) {
            this.board.play(nextPosition);
            this.update();
        }
    }

    update() {
        this.updateScore();
        this.updateTurn();
        this.updateButtons();
    }

    updateScore() {
        const scores = this.board.currentPosition.countStones();
        for (const color in scores) {
            this.scoreElements[color].innerHTML = scores[color];
        }
    }

    updateTurn() {
        this.turnElement.classList.remove('bi-caret-left-fill');
        this.turnElement.classList.remove('bi-caret-right');
        this.turnElement.classList.remove('bi-sign-stop');
        const position = this.board.currentPosition;
        if (position.gameOver) {
            this.turnElement.classList.add('bi-sign-stop');
        } else if (position.turn === WHITE) {
            this.turnElement.classList.add('bi-caret-right');
        } else {
            this.turnElement.classList.add('bi-caret-left-fill');
        }

    }

    updateButtons() {
        const position = this.board.currentPosition;
        this.first.disabled = (position.prevPosition == null);
        this.prev.disabled = (position.prevPosition == null);
        this.next.disabled = (position.nextPosition == null);
        this.last.disabled = (position.nextPosition == null);
    }

}

class SetMode {

}

class DrawMode {

}

class LessonsMode {

}