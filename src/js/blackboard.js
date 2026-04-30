import Position, {BLACK, EMPTY, WHITE} from "./position";
import Board from "./board";
import Square from "./square";
import {isAnimatingFlip} from "./page";
import PlayMode from "./play-mode";

export default class Blackboard {

    senseiOn = false;
    senseiApi;
    currentPosition;
    playMode;
    editMode;
    currentMode;
    board;

    isDragging = false;
    lastCell = null;

    constructor(senseiApi) {
        this.senseiApi = senseiApi;
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
        console.log("Blackboard: Click on " + e.currentTarget.dataset.x + " " + e.currentTarget.dataset.y);
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
        this.board.cleanEvaluations();
        this.board.setPosition(nextPosition);
    }

    play(nextPosition) {
        this.currentPosition = nextPosition;
        this.board.cleanEvaluations();
        this.board.playPosition(nextPosition);
    }

    updateEvaluations(threadId, finished, move) {
        // 2. Fetch the new evaluation array from C++
        const children = this.senseiApi.getChildrenEvaluations(threadId);
        if (!children || children.length === 0) return;

        this.board.updateEvaluations(threadId, finished, move, children);
        // 6. Continue evaluating if not finished
        if (!finished) {
            this.senseiApi.evaluate();
        }
    };


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
            this.board.playMode.moveHistory.reset();
        });
        document.getElementById('white-turn').addEventListener('change', () => {
            let position = this.board.currentPosition;
            position = position.changeTurn(WHITE);
            this.board.update(position);
            this.board.playMode.update();
            this.board.playMode.moveHistory.reset();
        });

        document.getElementById('reset-position').addEventListener('click', () => {
            const position = Position.getStartingPosition();
            this.board.update(position);
            this.board.playMode.update();
            this.board.playMode.moveHistory.reset();
            this.update();
        });

        document.getElementById('empty-position').addEventListener('click', () => {
            const position = Position.getEmptyPosition();
            this.board.update(position);
            this.board.playMode.update();
            this.board.playMode.moveHistory.reset();
            this.update();
        });

    }

    onClick(x, y) {
        console.log("EditMode: Click on " + x + " " + y);
        const square = new Square(parseInt(x), parseInt(y));
        let position = this.board.currentPosition;
        position = position.setStone(square, this.currentColor);
        this.board.update(position);
        this.board.playMode.update();
        this.board.playMode.moveHistory.reset();
        this.update();
        // Sensei
        if (this.currentColor === BLACK) {
            console.log("Set black stone : " + (square.x + square.y * 8));
            this.board.senseiApi.setBlackSquare(square.x + square.y * 8);
        } else if (this.currentColor === WHITE) {
            console.log("Set black stone : " + (square.x + square.y * 8));
            this.board.senseiApi.setWhiteSquare(square.x + square.y * 8);
        } else {
            console.log("Set black stone : " + (square.x + square.y * 8));
            this.board.senseiApi.setEmptySquare(square.x + square.y * 8);
        }
        this.board.senseiApi.evaluate();
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

class DrawMode {

}

class LessonsMode {

}