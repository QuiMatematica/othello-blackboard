import {WHITE} from './position.js';
import {BLACK} from './position.js';
import {createStone, setAnimatingFlip, xmlns} from "./page";
import Blackboard from "./blackboard";

const evalFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    signDisplay: 'always' // Forces + for positive and 0, - for negative
});

export default class Board {

    gameBoard;
    grid = [];

    letters = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', ''];

    arrows = 0;

    constructor() {
        const gameBoardContainer = document.createElement('div');
        gameBoardContainer.classList.add('game-board-container')
        document.getElementById('board').appendChild(gameBoardContainer)

        this.gameBoard = document.createElement('div');
        this.gameBoard.classList.add('gameBoard');
        gameBoardContainer.appendChild(this.gameBoard)

        this.createBoard()
    }

    createBoard() {
        // Prima riga: riferimenti
        for (let x = 0; x < 10; ++x) {
            const div = document.createElement('div');
            div.classList.add('boardBorder');
            div.classList.add('reference-container');
            if (x > 0 && x < 9) div.classList.add('north');
            div.innerHTML = this.letters[x];
            this.gameBoard.appendChild(div);
        }

        for (let y = 0; y < 8; ++y) {
            const row = [];
            this.grid.push(row);

            const firstDiv = document.createElement('div');
            firstDiv.classList.add('boardBorder');
            firstDiv.classList.add('reference-container');
            firstDiv.classList.add('west');
            firstDiv.innerHTML = y + 1;
            this.gameBoard.appendChild(firstDiv);

            for (let x = 0; x < 8; ++x) {
                // Create a square element.
                const div = document.createElement('div');
                div.classList.add('square');
                div.classList.add('stone-container');

                // Store the grid coordinates on the element.
                div.dataset.x = x;
                div.dataset.y = y;

                // When the flip animation ends, update the flip state and mark the valid
                // moves for the next player.
                div.addEventListener('animationend', () => {
                    setAnimatingFlip(false);
                });

                // Add the stone itself, which will not show up until a black or white
                // class is added to the square.
                div.appendChild(createStone());

                const ann = document.createElement('div');
                ann.className = 'annotation';
                ann.id = `annotation-${63 - (x + y * 8)}`;
                div.appendChild(ann);

                // Add the square to the DOM and to the 2D array.
                this.gameBoard.appendChild(div);
                row.push(div);
            }

            const lastDiv = document.createElement('div');
            lastDiv.classList.add('boardBorder');
            lastDiv.classList.add('reference-container');
            lastDiv.classList.add('east');
            lastDiv.innerHTML = y + 1;
            this.gameBoard.appendChild(lastDiv);
        }

        // Ultima riga: riferimenti
        for (let x = 0; x < 10; ++x) {
            const div = document.createElement('div');
            div.classList.add('boardBorder');
            div.classList.add('reference-container');
            if (x > 0 && x < 9) div.classList.add('south');
            div.innerHTML = this.letters[x];
            this.gameBoard.appendChild(div);
        }

        // Add the spots on the inner board corners.
        for (let x = 0; x < 4; ++x) {
            const spot = document.createElement('div');
            spot.classList.add('spot');
            spot.id = 'spot-' + x;
            this.gameBoard.appendChild(spot);
        }
    }

    resetLast() {
        for (const div of this.gameBoard.querySelectorAll('.last')) {
            div.classList.remove('last');
        }
    }

    resetGame() {
        for (const div of this.gameBoard.querySelectorAll('.square')) {
            div.classList.remove('black');
            div.classList.remove('white');
            div.classList.remove('flip');
            div.classList.remove('last');
        }
    }

    setStone(x, y, color) {
        if (color === WHITE) {
            this.grid[y][x].classList.add('white');
        } else if (color === BLACK) {
            this.grid[y][x].classList.add('black');
        }
    }

    setPosition(position) {
        this.resetGame();
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const color = position.grid[y][x];
                if (color === WHITE) {
                    this.grid[y][x].classList.add('white');
                } else if (color === BLACK) {
                    this.grid[y][x].classList.add('black');
                }
            }
        }
        if (position.played != null) {
            const playSquare = this.grid[position.played.y][position.played.x];
            playSquare.classList.add('last');
        }
    }

    playPosition(position) {
        this.resetLast();

        // Place the stone by adding the relevant color class.
        const playSquare = this.grid[position.played.y][position.played.x];
        playSquare.classList.add(Board.getColor(position.prevPosition.turn));
        playSquare.classList.add('last');

        for (const flipped of position.flipped) {
            const div = this.grid[flipped.y][flipped.x];
            div.classList.add('flip');
            div.classList.add(Board.getColor(position.prevPosition.turn));
            div.classList.remove(Board.getColor(-position.prevPosition.turn));
        }

        // Set this flag to indicate that we're animating the flip now.
        setAnimatingFlip(true);
    }

    static getColor(positionColor) {
        if (positionColor === WHITE) {
            return 'white';
        } else if (positionColor === BLACK) {
            return 'black';
        }
        return null;
    }

    // Returns the opposite of a player's color.
    static oppositeColor(color) {
        return color === 'white' ? 'black' : 'white';
    }

    // True if the square is empty.
    static isEmpty(div) {
        return !div.classList.contains('black') && !div.classList.contains('white');
    }

    // True if the square belongs to that player.
    static isColor(div, color) {
        return div.classList.contains(color);
    }

    addBSquares() {
        this.addLetter(0, 3, "B");
        this.addLetter(3, 0, "B");
        this.addLetter(0, 4, "B");
        this.addLetter(3, 7, "B");
        this.addLetter(7, 3, "B");
        this.addLetter(4, 0, "B");
        this.addLetter(7, 4, "B");
        this.addLetter(4, 7, "B");
    }

    addASquares() {
        this.addLetter(0, 2, "A");
        this.addLetter(2, 0, "A");
        this.addLetter(0, 5, "A");
        this.addLetter(2, 7, "A");
        this.addLetter(7, 2, "A");
        this.addLetter(5, 0, "A");
        this.addLetter(7, 5, "A");
        this.addLetter(5, 7, "A");
    }

    addCSquares() {
        this.addLetter(0, 1, "C");
        this.addLetter(1, 0, "C");
        this.addLetter(0, 6, "C");
        this.addLetter(1, 7, "C");
        this.addLetter(7, 1, "C");
        this.addLetter(6, 0, "C");
        this.addLetter(7, 6, "C");
        this.addLetter(6, 7, "C");
    }

    addXSquares() {
        this.addLetter(1, 1, "X");
        this.addLetter(1, 6, "X");
        this.addLetter(6, 1, "X");
        this.addLetter(6, 6, "X");
    }

    addLetter(x, y, letter) {
        const square = this.grid[y][x];

        const textNode = document.createTextNode(letter); // last/deepest child

        const textElement = document.createElementNS(xmlns, 'text'); // first/deepest parent

        if (Board.isColor(square, "black")) {
            textElement.setAttributeNS(null, 'fill', 'white');
            textElement.setAttributeNS(null, 'stroke', 'white');
        } else {
            textElement.setAttributeNS(null, 'fill', 'black');
            textElement.setAttributeNS(null, 'stroke', 'black');
        }
        textElement.setAttributeNS(null, 'x', '50');
        textElement.setAttributeNS(null, 'y', '55');
        textElement.setAttributeNS(null, 'alignment-baseline', "middle");
        textElement.setAttributeNS(null, 'text-anchor', "middle");
        if (letter.length === 1) {
            textElement.setAttributeNS(null, 'font-size', 80);
        } else {
            textElement.setAttributeNS(null, 'font-size', 60);
        }
        textElement.append(textNode);
        square.firstChild.append(textElement); // append deepest child to first parent
    }

    removeLetter(x, y) {
        const square = this.grid[y][x];
        square.getElementsByTagName("text").item(0).remove();
    }

    addRect(xa, ya, xb, yb, color) {
        const delta_x = (xb - xa + 1);
        const delta_y = (yb - ya + 1);
        const left = xa + 1;
        const top = ya + 1;

        this.addSvgRect(left, top, delta_x, delta_y, color, true);
    }

    addBorder(xa, ya, xb, yb, color) {
        const padding = .15
        const delta_x = xb - xa + 1 + padding * 2;
        const delta_y = yb - ya + 1 + padding * 2;
        const left = xa + 1 - padding;
        const top = ya + 1 - padding;

        this.addSvgRect(left, top, delta_x, delta_y, color, false);
    }

    addArrow(startX, startY, endX, endY, color) {
        const divNode = document.createElement('div');
        divNode.style.position = 'absolute';
        divNode.style.display = 'block';
        divNode.style.left = '0';
        divNode.style.top = '0';
        divNode.style.width = 'calc(var(--square-size)*10)';
        divNode.style.height = 'calc(var(--square-size)*10)';

        const svg = document.createElementNS(xmlns, 'svg');
        svg.setAttribute('viewBox', '0 0 1000 1000');

        const arrowLen = 6
        const arrowWid = 4

        const defs = document.createElementNS(xmlns, "defs");
        const marker = document.createElementNS(xmlns, "marker");
        marker.setAttribute("id", "arrowhead" + this.arrows);
        marker.setAttribute("markerWidth", String(arrowLen));
        marker.setAttribute("markerHeight", String(arrowWid));
        marker.setAttribute("refX", String(arrowLen));
        marker.setAttribute("refY", String(arrowWid / 2));
        marker.setAttribute("orient", "auto");

        const polygon = document.createElementNS(xmlns, "polygon");
        polygon.setAttribute("points", "0 0, " + arrowLen + " " + arrowWid / 2 + ", 0 " + arrowWid);
        polygon.setAttribute("fill", color);

        marker.appendChild(polygon);
        defs.appendChild(marker);
        svg.appendChild(defs);

        const line = document.createElementNS(xmlns, 'line');
        line.setAttribute("x1", String(startX));
        line.setAttribute("y1", String(startY));
        line.setAttribute("x2", String(endX));
        line.setAttribute("y2", String(endY));
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "10");
        line.setAttribute("marker-end", "url(#arrowhead" + this.arrows + ")");

        svg.appendChild(line);
        divNode.appendChild(svg);
        this.gameBoard.appendChild(divNode);

        this.arrows++;
    }

    addLine(startX, startY, endX, endY, color) {
        const divNode = document.createElement('div');
        divNode.style.position = 'absolute';
        divNode.style.display = 'block';
        divNode.style.left = '0';
        divNode.style.top = '0';
        divNode.style.width = 'calc(var(--square-size)*10)';
        divNode.style.height = 'calc(var(--square-size)*10)';

        const svg = document.createElementNS(xmlns, 'svg');
        svg.setAttribute('viewBox', '0 0 1000 1000');

        const line = document.createElementNS(xmlns, 'line');
        line.setAttribute("x1", String(startX));
        line.setAttribute("y1", String(startY));
        line.setAttribute("x2", String(endX));
        line.setAttribute("y2", String(endY));
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", "10");

        svg.appendChild(line);
        divNode.appendChild(svg);
        this.gameBoard.appendChild(divNode);
    }

    addSvgRect(left, top, delta_x, delta_y, color, to_fill) {
        const divNode = document.createElement('div');
        divNode.style.position = 'absolute';
        divNode.style.display = 'block';
        divNode.style.left = 'calc(var(--square-size)* ' + left + ')';
        divNode.style.top = 'calc(var(--square-size)* ' + top + ')';
        divNode.style.width = 'calc(var(--square-size)* ' + delta_x + ')';
        divNode.style.height = 'calc(var(--square-size)* ' + delta_y + ')';

        const svg = document.createElementNS(xmlns, 'svg');
        svg.setAttribute('viewBox', '0 0 ' + (100 * delta_x) + ' ' + (100 * delta_y));

        const rect = document.createElementNS(xmlns, 'rect');
        rect.setAttribute('width', String(100 * delta_x - 20));
        rect.setAttribute('height', String(100 * delta_y - 20));
        rect.setAttribute('x', '10');
        rect.setAttribute('y', '10');
        rect.setAttribute('rx', '45');
        rect.setAttribute('ry', '45');
        if (to_fill) {
            rect.setAttribute('fill', color);
            rect.setAttribute('opacity', '60%');
        } else {
            rect.setAttribute('fill', 'none');
            rect.setAttribute('stroke', color);
            rect.setAttribute('stroke-width', '15');
        }

        svg.appendChild(rect);
        divNode.appendChild(svg);
        this.gameBoard.appendChild(divNode);
    }

    cleanEvaluations() {
        for (let i = 0; i < 64; i++) {
            const annotation = document.getElementById(`annotation-${i}`);
            if (annotation) {
                annotation.innerText = '';
                annotation.classList.remove('optimal');
            }
        }
    }

    updateEvaluations(threadId, finished, move, children) {
        // 1. Clear all old annotations from the board
        this.cleanEvaluations();

        // 3. First loop: compute the best evaluation
        let bestEval = -Infinity;
        let nVisited = 0n;
        let nVisitedBook = 0n;
        let seconds = 0.0;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const displayEval = -child.median_eval;
            nVisited += child.descendants;
            nVisitedBook += child.descendants_book;
            seconds += child.seconds;
            if (displayEval > bestEval) {
                bestEval = displayEval;
            }
        }

        // 4. Second loop: paint the annotations
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const displayEval = -child.median_eval;
            for (let j = 0; j < child.num_moves; ++j) {
                const moveId = `annotation-${child.moves[j]}`;
                const annElement = document.getElementById(moveId);

                if (annElement) {
                    annElement.innerText = evalFormatter.format(displayEval);

                    if (Math.abs(displayEval - bestEval) <= 1.0) {
                        annElement.classList.add('optimal');
                    } else {
                        annElement.classList.remove('optimal');
                    }
                }
            }
        }

        // 5. Positions Text
        // const totalPositions = nVisited + nVisitedBook;
        // document.getElementById('stat-positions').innerText =
        //     totalPositions > 0n ? `Positions: ${compactFormatter.format(totalPositions)}` : '';

        // Positions Per Second Text
        // document.getElementById('stat-pos-sec').innerText =
        //     seconds > 0 ? `Pos / sec: ${compactFormatter.format(Number(nVisited) / seconds)}` : '';

        // Time / Book Status Text
        // let timeStatusText = '';
        // if (nVisitedBook > 0n) {
        //     timeStatusText = nVisited > 0 ? 'Book + Evaluate' : 'Book';
        // } else if (nVisited > 0n) {
        //     timeStatusText = `Time: ${seconds.toFixed(1)} sec`;
        // }
        // document.getElementById('stat-time').innerText = timeStatusText;
    }

}
