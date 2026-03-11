import {BLACK} from "./position";

export default class MoveHistory {

    history;
    event;

    constructor(event) {
        this.history = document.getElementById("move-history");
        this.event = event;
    }

    reset() {
        this.removeMoves(0, 1);
    }

    play(position) {
        const lineIndex = 0; // linea principale, per ora l'unica
        const number = position.moveNumber;
        this.removeMoves(lineIndex, number);

        const text = number + '. ' + position.played;
        const color = position.prevPosition.turn === BLACK ? 'black' : 'white';
        this.addMove(lineIndex, number, text, color);
    }

    removeMoves(lineIndex, number) {
        const row = document.querySelector(`.move-row[data-line="${lineIndex}"]`);
        while (row.children.length > number - 1) {
            row.children[number - 1].remove();
        }
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
        if (cell == null) {
            this.history.scrollLeft = 0;
        } else {
            cell.classList.add('current');
            cell.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center"
            });
        }
    }

}