import solve from './solve.js';

onmessage = function(event) {
  const solutionArray = solve(event.data);
  postMessage({
    boardString: event.data,
    solutionArray
  });
};
