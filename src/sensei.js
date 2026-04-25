import { SenseiAPI } from './sensei_api.js';
const senseiApi = new SenseiAPI();

(async () => {
    senseiApi.init(window.onSetBoard, window.onUpdateAnnotations).then(() => {
      console.log("Engine Ready");
    });
})()

window.onSetBoard = (data) => {
    console.log("onSetBoard: ", data);
}

// This is called every time we have a new evaluation (by default every second).
window.onUpdateAnnotations = (threadId, finished, move) => {
  // Use thread 0 for the primary evaluation
  const evaluation = senseiApi.getCurrentEvaluation(threadId);

  // Format the score (assuming it's a float/int from the engine)
  const formattedScore = (evaluation.eval > 0 ? "+" : "") + evaluation.eval.toFixed(2);
  evaluationVal.innerText = formattedScore;
  if (!finished) {
    senseiApi.evaluate();
  }
};
