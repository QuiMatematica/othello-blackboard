import Position, {BLACK, EMPTY, WHITE} from "./position";
import Board from "./board";
import Square from "./square";
import {isAnimatingFlip} from "./page";

let theBoard;

export default class Blackboard {

    currentPosition;
    playMode;
    editMode;
    currentMode;
    board;

    constructor() {
        theBoard = this;

        this.currentPosition = Position.getStartingPosition();

        this.board = new Board((event) => {
            if (isAnimatingFlip()) {
                return;
            }

            const div = event.currentTarget;
            const {x, y} = div.dataset;  // NOTE: strings, not ints
            this.currentMode.onClick(x, y);
        });
        this.board.setPosition(this.currentPosition);

        this.playMode = new PlayMode(this);
        this.playMode.update();

        this.editMode = new EditMode(this);

        this.currentMode = this.playMode;

        document.getElementById('play-tab').addEventListener('click', () => {
            this.currentMode = this.playMode;
            console.log("Play mode");
        });
        document.getElementById('set-tab').addEventListener('click', () => {
            this.currentMode = this.editMode;
            console.log("Edit mode");
        })
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

class EditMode {

    board;
    currentColor;

    constructor(board) {
        this.board = board;
        this.currentColor = BLACK;

        document.getElementById('black-stone').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.currentColor = BLACK;
            }
        });
        document.getElementById('white-stone').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.currentColor = WHITE;
            }
        });
        document.getElementById('empty-square').addEventListener('change', (e) => {
            if (e.target.checked) {
                this.currentColor = EMPTY;
            }
        });

        document.getElementById('black-turn').addEventListener('change', (e) => {
            let position = this.board.currentPosition;
            position = position.changeTurn(BLACK);
            this.board.update(position);
            this.board.playMode.update();
        });
        document.getElementById('white-turn').addEventListener('change', (e) => {
            let position = this.board.currentPosition;
            position = position.changeTurn(WHITE);
            this.board.update(position);
            this.board.playMode.update();
        });

        document.getElementById('reset-position').addEventListener('click', () => {
            const position = Position.getStartingPosition();
            this.board.update(position);
            this.board.playMode.update();
            this.update();
        });

        document.getElementById('empty-position').addEventListener('click', () => {
            const position = Position.getEmptyPosition();
            this.board.update(position);
            this.board.playMode.update();
            this.update();
        });

    }

    onClick(x, y) {
        const square = new Square(parseInt(x), parseInt(y));
        let position = this.board.currentPosition;
        position = position.setStone(square, this.currentColor);
        this.board.update(position);
        this.board.playMode.update();
    }

    update() {
        this.board.currentPosition.turn === BLACK ? document.getElementById('black-turn').checked = true : document.getElementById('white-turn').checked = true;
    }

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
        this.scoreElements.black = document.getElementById('black-score');
        this.scoreElements.white = document.getElementById('white-score');
        this.turnElement = document.getElementById('turn');

        this.first = document.getElementById('first');
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
        this.prev = document.getElementById('prev');
        this.prev.addEventListener('click', () => {
            const prevPosition = this.board.currentPosition.prevPosition;
            if (prevPosition != null) {
                this.board.update(prevPosition);
                this.update();
            }
        })
        this.next = document.getElementById('next');
        this.next.addEventListener('click', () => {
            const nextPosition = this.board.currentPosition.nextPosition;
            if (nextPosition != null) {
                this.board.play(nextPosition);
                this.update();
            }
        })
        this.last = document.getElementById('last');
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
            this.board.editMode.update();
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