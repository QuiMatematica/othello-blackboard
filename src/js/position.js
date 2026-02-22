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

    errors;

    constructor(grid, turn) {
        this.grid = grid;
        this.turn = turn;
        this.gameOver = false;
        this.passCount = 0;
        this.checkValidMoves();
        this.comment = null;
        this.errors = [];
    }

    static getStartingPosition() {
        const grid = [];
        for (let x = 0; x < 8; x++) {
            const row = [];
            grid.push(row);
            for (let y = 0; y < 8; y++) {
                row.push(EMPTY);
            }
        }
        grid[3][3] = WHITE;
        grid[4][4] = WHITE;
        grid[3][4] = BLACK;
        grid[4][3] = BLACK;
        return new Position(grid, BLACK)
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
        const scores = { black: 0, white: 0 };

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

    playStone(square, isError) {
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
                for (const [nx,ny] of Position.scanDirection(x, y, dx, dy)) {
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
        const nextTurn = - this.turn;

        // Build the next position.
        let next = new Position(nextGrid, nextTurn);
        // Save the played position
        next.played = new Square(x, y);
        // Save the flipped stones
        next.flipped = flipped;
        // Link the next position to this one.
        next.prevPosition = this;

        if (isError) {
            // Add this position as error
            this.errors.push(next);
        }
        else {
            // Link this position to the next
            this.nextPosition = next;
        }

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

    // A generator that yields board squares starting at x,y and moving in the
    // direction dx,dy, excluding the starting position at x,y.
    static *scanDirection(x, y, dx, dy) {
        x += dx;
        y += dy;

        for (; y >= 0 && y <= 7 && x >= 0 && x <= 7; y += dy, x += dx) {
            yield [x, y];
        }
    }

    static *allDirections() {
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