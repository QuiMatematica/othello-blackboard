import Square from "./square";

export const EMPTY = 0;
export const WHITE = 1;
export const BLACK = -1;

export default class Position {

    grid;
    turn;
    comment;
    played;
    flipped;
    gameOver;
    passCount;
    nextPosition;
    prevPosition;
    moveNumber;

    constructor(grid, turn) {
        this.grid = grid;
        this.turn = turn;
        this.gameOver = false;
        this.passCount = 0;
        this.checkValidMoves();
        this.comment = null;
        this.moveNumber = 0;
    }

    static buildGrid() {
        const grid = [];
        for (let x = 0; x < 8; x++) {
            const row = [];
            grid.push(row);
            for (let y = 0; y < 8; y++) {
                row.push(EMPTY);
            }
        }
        return grid;
    }
    
    static getEmptyPosition() {
        return new Position(this.buildGrid(), BLACK)
    }

    static getStartingPosition() {
        const grid = this.buildGrid();
        grid[3][3] = WHITE;
        grid[4][4] = WHITE;
        grid[3][4] = BLACK;
        grid[4][3] = BLACK;
        return new Position(grid, BLACK)
    }
    
    static readPosition() {
        // Parse URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const b = urlParams.get('b');
        const w = urlParams.get('w');
        console.log("black", b, "white", w)

        // If 'b' and 'w' parameters are not present, return starting position
        if (!b || !w) {
            return this.getStartingPosition();
        }

        const blackBits = BigInt("0x" + b);
        const whiteBits = BigInt("0x" + w);

        // Parse the position from 'b' and 'w' parameters
        const grid = this.buildGrid();
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {

                const pos = BigInt(x * 8 + y);

                if ((blackBits & (1n << pos)) !== 0n) {
                    grid[x][y] = BLACK;
                } else if ((whiteBits & (1n << pos)) !== 0n) {
                    grid[x][y] = WHITE;
                }
            }
        }
        // Determine turn (default to BLACK)
        const turn = urlParams.get('t') === '2' ? WHITE : BLACK;

        const thisPosition = new Position(grid, turn);

        const sequence = urlParams.get('s').replace(/-/g, "+").replace(/_/g, "/");
        if (sequence) {
            let position = thisPosition;

            const BASE64 =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

            for (let i = 0; i < sequence.length; i++) {
                const char = sequence[i];
                const value = BASE64.indexOf(char);
                let x = Math.floor(value / 8);
                let y = value % 8;
                position = position.playStone(new Square(x, y));
            }
        }

        return thisPosition;
    }

    setStone(square, color) {
        const x = square.x;
        const y = square.y;

        // Copy the grid.
        const nextGrid = this.copyGrid();

        // Place the stone in the new grid.
        nextGrid[y][x] = color;

        // Build the next position.
        return new Position(nextGrid, this.turn);
    }

    changeTurn(color) {
        // Copy the grid.
        const nextGrid = this.copyGrid();

        // Build the next position.
        return new Position(nextGrid, color);
    }

    countStones() {
        const scores = {black: 0, white: 0};

        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                if (this.grid[y][x] === BLACK) {
                    scores.black += 1;
                }

                if (this.grid[y][x] === WHITE) {
                    scores.white += 1;
                }
            }
        }
        return scores;
    }

    checkValidMoves() {
        const scores = this.countStones();

        // If someone is out of pieces, the game is over.
        if (scores.black === 0 || scores.white === 0) {
            this.gameOver = true;
            return;
        }

        // If both players had to pass, nobody can move and the game is over.
        if (this.passCount >= 2) {
            this.gameOver = true;
            return;
        }

        const foundAValidMove = this.findAValidMove()

        // If there are no valid moves, then the current player must pass.
        if (foundAValidMove) {
            this.passCount = 0;
        } else {
            this.passCount++;
            this.onPass();
        }
    }

    findAValidMove() {
        // Find and mark all the valid moves in the game board.
        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                if (this.isValidPlay(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }

    onPass() {
        this.turn *= -1;
        this.checkValidMoves();
    }

    playStone(square) {
        const x = square.x;
        const y = square.y;
        // Don't play if game is over.
        if (this.gameOver) {
            return null;
        }

        // Don't play if the move is invalid.
        if (!this.isValidPlay(x, y)) {
            return null;
        }

        // Copy the grid.
        const nextGrid = this.copyGrid();

        // Place the stone in the new grid.
        nextGrid[y][x] = this.turn;

        const flipped = [];

        // Flip over the opponent's pieces in every valid direction.
        for (const [dx, dy] of Position.allDirections()) {
            if (this.isValidInDirection(x, y, dx, dy)) {
                for (const [nx, ny] of Position.scanDirection(x, y, dx, dy)) {
                    // Stop on your own color.
                    if (this.grid[ny][nx] === this.turn) {
                        break;
                    }
                    nextGrid[ny][nx] = this.turn;
                    flipped.push(new Square(nx, ny));
                }
            }
        }

        // Change turn; it will be checked by the new position constructor.
        const nextTurn = -this.turn;

        // Build the next position.
        let next = new Position(nextGrid, nextTurn);
        // Save the played position
        next.played = new Square(x, y);
        next.moveNumber = this.moveNumber + 1;
        // Save the flipped stones
        next.flipped = flipped;
        // Link the next position to this one.
        next.prevPosition = this;
        this.nextPosition = next;

        return next;
    }

    isValidPlay(x, y) {
        // If it's not empty, it's not a valid play.
        if (this.grid[y][x] !== EMPTY) {
            return false;
        }

        // A valid play at x,y must be able to flip stones in some direction.
        for (const [dx, dy] of Position.allDirections()) {
            if (this.isValidInDirection(x, y, dx, dy)) {
                return true;
            }
        }
        return false;
    }

    copyGrid() {
        const nextGrid = [];
        for (let x = 0; x < 8; x++) {
            const row = [];
            nextGrid.push(row);
            for (let y = 0; y < 8; y++) {
                row.push(this.grid[x][y])
            }
        }
        return nextGrid;
    }

    isValidInDirection(x, y, dx, dy) {
        let first = true;

        for (const [nx, ny] of Position.scanDirection(x, y, dx, dy)) {
            // If the first square in direction dx,dy is not the opposite player's,
            // then this is not a valid play based on that direction.
            if (first) {
                if (this.grid[ny][nx] !== -this.turn) {
                    return false;
                }

                first = false;
            }

            // If the next square is empty, we failed to find another stone in our
            // color, so this is not a valid play based on that direction.
            if (this.grid[ny][nx] === EMPTY) {
                return false;
            }

            // Once we find a stone of our own color after some number of the
            // opponent's stones, this is a valid play in this direction.
            if (this.grid[ny][nx] === this.turn) {
                return true;
            }
        }

        // If we reach the end of the board without finding our own color, this is
        // not a valid play based on that direction.
        return false;
    }

    toSenseiStr() {
        let str = "";
        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 8; ++x) {
                if (this.grid[y][x] === BLACK) {
                    str += "X";
                } else if (this.grid[y][x] === WHITE) {
                    str += "O";
                } else {
                    str += "-";
                }
            }
        }
        str += " ";
        if (this.turn === BLACK) {
            str += "X";
        } else {
            str += "O";
        }
        return str;
    }

    // A generator that yields board squares starting at x,y and moving in the
    // direction dx,dy, excluding the starting position at x,y.
    static* scanDirection(x, y, dx, dy) {
        x += dx;
        y += dy;

        for (; y >= 0 && y <= 7 && x >= 0 && x <= 7; y += dy, x += dx) {
            yield [x, y];
        }
    }

    static* allDirections() {
        for (const dx of [-1, 0, 1]) {
            for (const dy of [-1, 0, 1]) {
                // Never yield direction [0, 0] (in place)
                if (dx || dy) {
                    yield [dx, dy];
                }
            }
        }
    }

}