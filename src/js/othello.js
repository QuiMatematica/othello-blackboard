import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Blackboard from "./blackboard";

let container = document.querySelector('.board');
new Blackboard(container);
console.log('Blackboard loaded');