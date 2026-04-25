import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/othello.css';

import Blackboard from "./blackboard";
import {SenseiAPI} from '../sensei_api.js';

const senseiApi = new SenseiAPI();
new Blackboard(senseiApi);
console.log('Blackboard loaded');

const evalFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always' // Forces + for positive and 0, - for negative
});

// Formats large numbers like Flutter's prettyPrintDouble (e.g., 1.5M, 24K)
const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
});

window.onSetBoard = (data) => {
    console.log("onSetBoard: ", data);
};

// This is called every time we have a new evaluation (by default every second).
window.onUpdateAnnotations = (threadId, finished, move) => {
    console.log("onUpdateAnnotations: ", move);
    // 1. Clear all old annotations from the board
    for (let i = 0; i < 64; i++) {
        const annotation = document.getElementById(`annotation-${i}`);
        if (annotation) {
            annotation.innerText = '';
            annotation.classList.remove('optimal');
        }
    }

    // 2. Fetch the new evaluation array from C++
    const children = senseiApi.getChildrenEvaluations(threadId);
    if (!children || children.length === 0) return;

    // 3. First loop: compute the best evaluation
    let bestEval = -Infinity;
    let nVisited = 0n;
    let nVisitedBook = 0n;
    let seconds = 0.0;

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const displayEval = -child.eval;
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
        const displayEval = -child.eval;
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

    // 6. Continue evaluating if not finished
    if (!finished) {
        senseiApi.evaluate();
    }
};

(async () => {
    senseiApi.init(window.onSetBoard, window.onUpdateAnnotations).then(() => {
        console.log("Engine Ready");
    });
})()
