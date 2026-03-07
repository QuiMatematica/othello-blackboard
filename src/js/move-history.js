import {BLACK} from "./position";

export default class MoveHistory {

    history;
    event;

    constructor(event) {
        this.history = document.getElementById("move-history");
        this.event = event;
    }

    play(position) {
        const lineIndex = 0; // per ora mettiamoli tutti sulla principale
        const number = position.moveNumber;
        const text = number + '. ' + position.played;
        const color = position.prevPosition.turn === BLACK ? 'black' : 'white';
        this.addMove(lineIndex, number, text, color);
    }

    addMove(lineIndex, number, text, color) {
        for (const div of document.querySelectorAll('.move.current')) {
            div.classList.remove('current');
        }

        const column = number - 1;
        const row = document.querySelector(`.move-row[data-line="${lineIndex}"]`);

        while (row.children.length < column) {
            const empty = document.createElement("div");
            empty.className = "move empty";
            row.appendChild(empty);
        }

        const cell = document.createElement("div");
        cell.className = "move current " + color;
        cell.textContent = text;
        cell.dataset.number = number;
        cell.addEventListener('click', this.event);

        row.appendChild(cell);

        this.history.scrollLeft = this.history.scrollWidth;
    }

    updateCurrent(number) {
        for (const div of document.querySelectorAll('.move.current')) {
            div.classList.remove('current');
        }
        const cell = document.querySelector(`.move[data-number="${number}"]`);
        if (cell != null) cell.classList.add('current');
    }

    updateScrollView() {
        const cell = document.querySelector('.move.current');
        if (cell == null) {
            this.history.scrollLeft = 0;
        }
        else {
            this.history.scrollLeft = cell.offsetLeft - this.history.clientWidth / 2 + cell.clientWidth / 2;
        }
    }

}