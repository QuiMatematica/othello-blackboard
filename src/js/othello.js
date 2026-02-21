import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Blackboard from "./blackboard";

let container = document.querySelector('.board');
new Blackboard(container);
console.log('Blackboard loaded');