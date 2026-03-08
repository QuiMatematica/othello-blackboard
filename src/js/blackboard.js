import Position, {BLACK, EMPTY, WHITE} from "./position";
import Board from "./board";
import Square from "./square";
import {isAnimatingFlip} from "./page";
import MoveHistory from "./move-history";

export default class Blackboard {

    currentPosition;
    playMode;
    editMode;
    currentMode;
    board;

    isDragging = false;
    lastCell = null;

    constructor() {
        this.currentPosition = Position.getStartingPosition();

        this.board = new Board();
        this.board.setPosition(this.currentPosition);

        const cells = this.board.gameBoard.querySelectorAll('.stone-container');
        cells.forEach(cell => {
            cell.addEventListener('click', this.onClick.bind(this));
            cell.addEventListener('pointerdown', this.onPointerDown.bind(this));
            cell.addEventListener('pointermove', this.onPointerMove.bind(this));
        })
        document.addEventListener('pointerup', this.onPointerUp.bind(this));

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

    onClick(e) {
        if (isAnimatingFlip()) {
            return;
        }

        const div = e.currentTarget;
        const {x, y} = div.dataset;  // NOTE: strings, not ints
        this.currentMode.onClick(x, y);
    }

    onPointerDown(e) {
        this.isDragging = true;
        const cell = e.currentTarget;
        this.lastCell = cell;
        const {x, y} = cell.dataset;
        this.currentMode.onPointerDown(x, y);
    }

    onPointerMove(e) {
        if (!this.isDragging) return;

        const el = document.elementFromPoint(e.clientX, e.clientY);
        const cell = el?.closest('.stone-container');

        if (cell === this.lastCell) return;
        this.lastCell = cell;

        const {x, y} = cell.dataset;
        this.currentMode.onPointerMove(x, y);
    }

    onPointerUp() {
        this.isDragging = false;
        this.lastCell = null;
        this.currentMode.onPointerUp();
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

        document.getElementById('black-turn').addEventListener('change', () => {
            let position = this.board.currentPosition;
            position = position.changeTurn(BLACK);
            this.board.update(position);
            this.board.playMode.update();
        });
        document.getElementById('white-turn').addEventListener('change', () => {
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
        this.update();
    }

    onPointerDown(x, y) {
        this.onClick(x, y);
    }

    onPointerMove(x, y) {
        this.onClick(x, y);
    }

    onPointerUp() {
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
    moveHistory;
    variationSwitchContainer;
    variationSwitch;

    constructor(board) {
        this.board = board;
        this.scoreElements.black = document.getElementById('black-score');
        this.scoreElements.white = document.getElementById('white-score');
        this.turnElement = document.getElementById('turn');
        this.variationSwitchContainer = document.getElementById('variation-switch-container');
        this.variationSwitch = document.getElementById('variation-switch');
        this.moveHistory = new MoveHistory((e) => {
            const target = e.currentTarget;
            const number = Number(target.dataset.number);
            let currentPosition = this.board.currentPosition;
            if (number === currentPosition.moveNumber) {
                return;
            }
            if (number === currentPosition.moveNumber + 1) {
                this.board.play(currentPosition.nextPosition);
            }
            else {
                while (currentPosition.moveNumber !== number) {
                    if (number < currentPosition.moveNumber) {
                        currentPosition = currentPosition.prevPosition;
                    } else {
                        currentPosition = currentPosition.nextPosition;
                    }
                }
                this.board.update(currentPosition);
            }
            this.update();
            this.updateHistory();
        });

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
                this.updateHistory();
            }
        })
        this.prev = document.getElementById('prev');
        this.prev.addEventListener('click', () => {
            const prevPosition = this.board.currentPosition.prevPosition;
            if (prevPosition != null) {
                this.board.update(prevPosition);
                this.update();
                this.updateHistory();
            }
        })
        this.next = document.getElementById('next');
        this.next.addEventListener('click', () => {
            const nextPosition = this.board.currentPosition.nextPosition;
            if (nextPosition != null) {
                this.board.play(nextPosition);
                this.update();
                this.updateHistory();
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
                this.updateHistory();
            }
        })
    }

    onClick(x, y) {
        const mainLine = !this.variationSwitch.checked;
        const square = new Square(parseInt(x), parseInt(y));
        const nextPosition = this.board.currentPosition.playStone(square, mainLine);
        // If the play was valid, update the views.
        if (nextPosition != null) {
            this.board.play(nextPosition);
            this.moveHistory.play(nextPosition, mainLine);
            this.update();
            this.board.editMode.update();
            this.variationSwitchContainer.classList.remove('d-none');
        }
    }

    onPointerDown(x, y) {
    }

    onPointerMove(x, y) {
    }

    onPointerUp() {
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
        this.turnElement.classList.remove('bi-caret-right-fill');
        this.turnElement.classList.remove('bi-sign-stop');
        const position = this.board.currentPosition;
        if (position.gameOver) {
            this.turnElement.classList.add('bi-sign-stop');
            this.turnElement.style.color = 'black';
        } else if (position.turn === WHITE) {
            this.turnElement.classList.add('bi-caret-right-fill');
            this.turnElement.style.color = 'white';
        } else {
            this.turnElement.classList.add('bi-caret-left-fill');
            this.turnElement.style.color = 'black';
        }

    }

    updateButtons() {
        const position = this.board.currentPosition;
        this.first.disabled = (position.prevPosition == null);
        this.prev.disabled = (position.prevPosition == null);
        this.next.disabled = (position.nextPosition == null);
        this.last.disabled = (position.nextPosition == null);
    }

    updateHistory() {
        const position = this.board.currentPosition;
        this.moveHistory.updateCurrent(position.moveNumber);
    }

}

class DrawMode {

}

class LessonsMode {

}