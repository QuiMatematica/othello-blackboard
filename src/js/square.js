const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8']

const FROM_LETTERS = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7}
const FROM_NUMBERS = {'1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7}

export default class Square {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return LETTERS[this.x] + NUMBERS[this.y];
    }

    static fromString(str) {
        const x = FROM_LETTERS[str.charAt(0)];
        const y = FROM_NUMBERS[str.charAt(1)];
        return new Square(x, y);
    }

}