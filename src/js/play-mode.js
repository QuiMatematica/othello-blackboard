import MoveHistory from "./move-history";
import {WHITE} from "./position";
import Square from "./square";

export default class PlayMode {

    blackboard;
    scoreElements = {};
    turnElement;
    first;
    next;
    prev;
    last;
    moveHistory;
    senseiSwitch;

    constructor(blackboard) {
        this.blackboard = blackboard;
        this.scoreElements.black = document.getElementById('black-score');
        this.scoreElements.white = document.getElementById('white-score');
        this.turnElement = document.getElementById('turn');
        this.moveHistory = new MoveHistory((e) => {
            const target = e.currentTarget;
            const number = Number(target.dataset.number);
            let currentPosition = this.blackboard.currentPosition;
            if (number === currentPosition.moveNumber) {
                return;
            }
            if (number === currentPosition.moveNumber + 1) {
                this.blackboard.play(currentPosition.nextPosition);
            } else {
                while (currentPosition.moveNumber !== number) {
                    if (number < currentPosition.moveNumber) {
                        currentPosition = currentPosition.prevPosition;
                    } else {
                        currentPosition = currentPosition.nextPosition;
                    }
                }
                this.blackboard.update(currentPosition);
            }
            this.update();
            this.updateHistory();
        });

        this.reset();

        this.first = document.getElementById('first');
        this.first.addEventListener('click', () => {
            let curPosition = this.blackboard.currentPosition;
            let prevPosition = curPosition.prevPosition;
            if (prevPosition != null) {
                while (prevPosition != null) {
                    curPosition = prevPosition;
                    prevPosition = curPosition.prevPosition;
                }
                this.blackboard.update(curPosition);
                this.update();
                this.updateHistory();
            }
        })
        this.prev = document.getElementById('prev');
        this.prev.addEventListener('click', () => {
            const prevPosition = this.blackboard.currentPosition.prevPosition;
            if (prevPosition != null) {
                this.blackboard.update(prevPosition);
                this.update();
                this.updateHistory();
            }
        })
        this.next = document.getElementById('next');
        this.next.addEventListener('click', () => {
            const nextPosition = this.blackboard.currentPosition.nextPosition;
            if (nextPosition != null) {
                this.blackboard.play(nextPosition);
                this.update();
                this.updateHistory();
            }
        })
        this.last = document.getElementById('last');
        this.last.addEventListener('click', () => {
            let curPosition = this.blackboard.currentPosition;
            let nextPosition = curPosition.nextPosition;
            if (nextPosition != null) {
                while (nextPosition != null) {
                    curPosition = nextPosition;
                    nextPosition = curPosition.nextPosition;
                }
                this.blackboard.update(curPosition);
                this.update();
                this.updateHistory();
            }
        });

        this.senseiSwitch = document.getElementById('senseiSwitch');
        this.senseiSwitch.addEventListener('change', (e) => {
            const checked = e.target.checked;
            console.log("Sensei switch: " + checked);
            this.updateEvaluation();
        })
    }

    reset() {
        this.moveHistory.reset();
        let position = this.blackboard.currentPosition;
        while (position.nextPosition != null) {
            position = position.nextPosition;
            this.moveHistory.play(position);
        }
        this.moveHistory.updateCurrent(this.blackboard.currentPosition.moveNumber);
    }

    onClick(x, y) {
        const current = this.blackboard.currentPosition;

        const square = new Square(parseInt(x), parseInt(y));
        const nextPosition = current.playStone(square);
        // If the play was valid, update the views.
        if (nextPosition != null) {
            this.blackboard.play(nextPosition);
            this.moveHistory.play(nextPosition);
            this.update();
            this.blackboard.editMode.update();
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
        this.updateEvaluation();
    }

    updateScore() {
        const scores = this.blackboard.currentPosition.countStones();
        for (const color in scores) {
            this.scoreElements[color].innerHTML = scores[color];
        }
    }

    updateTurn() {
        this.turnElement.classList.remove('bi-caret-left-fill');
        this.turnElement.classList.remove('bi-caret-right-fill');
        this.turnElement.classList.remove('bi-sign-stop');
        const position = this.blackboard.currentPosition;
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
        const position = this.blackboard.currentPosition;
        this.first.disabled = (position.prevPosition == null);
        this.prev.disabled = (position.prevPosition == null);
        this.next.disabled = (position.nextPosition == null);
        this.last.disabled = (position.nextPosition == null);
    }

    updateHistory() {
        const position = this.blackboard.currentPosition;
        this.moveHistory.updateCurrent(position.moveNumber);
    }

    updateEvaluation() {
        const senseiActive = this.senseiSwitch.checked;
        if (senseiActive && this.blackboard.currentMode === this) {
            const position = this.blackboard.currentPosition;
            const senseiStr = position.toSenseiStr();
            console.log("Sensei str: " + senseiStr);
            this.blackboard.senseiApi.pasteBoard(senseiStr);
            this.blackboard.senseiApi.evaluate();
        }
        else {
            if (this.blackboard.senseiOn) {
                this.blackboard.senseiApi.stop();
                this.blackboard.board.cleanEvaluations();
            }
        }
    }
}
