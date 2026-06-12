import Position from "./position";
import Board from "./board";
import {isAnimatingFlip} from "./page";
import PlayMode from "./play-mode";
import EditMode from "./edit-mode";

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
            this.playMode.updateEvaluation();
            console.log("Play mode");
        });
        document.getElementById('set-tab').addEventListener('click', () => {
            this.board.cleanEvaluations();
            if (this.senseiOn) {
                this.senseiApi.stop();
            }
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