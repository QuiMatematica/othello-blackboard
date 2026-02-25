import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/othello.css';
import Blackboard from "./blackboard";

new Blackboard();
console.log('Blackboard loaded');

document.addEventListener("DOMContentLoaded", function () {

    const btn = document.getElementById("btnFullscreen");

    function isPWA() {
        return window.matchMedia('(display-mode: standalone)').matches
            || window.matchMedia('(display-mode: fullscreen)').matches
            || window.navigator.standalone === true;
    }

    function isFullscreen() {
        return document.fullscreenElement !== null;
    }

    function updateButtonVisibility() {
        if (!isPWA() && !isFullscreen()) {
            btn.classList.remove("d-none");
        } else {
            btn.classList.add("d-none");
        }
    }

    btn.addEventListener("click", function () {
        document.documentElement.requestFullscreen();
    });

    document.addEventListener("fullscreenchange", updateButtonVisibility);

    updateButtonVisibility();
});