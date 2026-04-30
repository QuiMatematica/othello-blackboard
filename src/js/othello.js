import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/othello.css';

import Blackboard from "./blackboard";
import {SenseiAPI} from '../sensei_api.js';

const senseiApi = new SenseiAPI();
const blackboard = new Blackboard(senseiApi);
console.log('Blackboard loaded');

window.onSetBoard = (data) => {
    console.log("onSetBoard: ", data);
};

// This is called every time we have a new evaluation (by default every second).
window.onUpdateAnnotations = (threadId, finished, move) => {
    console.log("onUpdateAnnotations: ", move);
    blackboard.updateEvaluations(threadId, finished, move);
};

(async () => {
    senseiApi.init(window.onSetBoard, window.onUpdateAnnotations).then(() => {
        console.log("Engine Ready");
        document.getElementById('senseiLoading').style.display = 'none';
        document.getElementById('sensei').classList.remove("d-none");
        blackboard.senseiOn = true;
    });
})()
