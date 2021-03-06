export default () => {

  // serve ES6+ worker if browser supports modules, ES5 worker if it doesn't
  const testScript = document.createElement('script');
  const filename = ('noModule' in testScript) ? 'js/worker.js' : 'js/es5-worker.js';

  const solveWorker = new Worker(filename);

  solveWorker.onmessage = function(event) {
    const solutionBox = document.querySelector('#solution');

    const solutionArray = event.data.solutionArray;
    const puzzleIsSolved = solutionArray ? true : false;

    if (puzzleIsSolved) {

      // fill board with solution
      for (const [index, cellVal] of solutionArray.entries()) {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const inputBox = document.querySelector(`#row${row}col${col}input`);
        if (!inputBox.value) {
          inputBox.classList.add('generated');
          inputBox.value = cellVal;
        }
      }

      const solutionString = solutionArray.join('');
      solutionBox.value = solutionString;
    } else {
      solutionBox.value = 'There are no solutions.';
    }

    // if 'query param' exists and doesn't match input boardString, clear it
    const boardString = event.data.boardString;
    if (location.search && location.search.substring(1) !== boardString) {
      history.pushState(null, null, window.location.href.split('?')[0]);
    }

    // enable permalink button
    const permalink = document.querySelector('#permalink');
    permalink.removeAttribute('disabled');
  };

  return solveWorker;
};
