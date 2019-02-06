import solve from './solve.js';

onmessage = function(event) {
  const solutionArray = solve(event.data);
  postMessage(solutionArray);
}
