import Position, {BLACK, EMPTY, WHITE} from "./position";
import Square from "./square";

export default class EditMode {

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