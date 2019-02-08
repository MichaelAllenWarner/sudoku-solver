const solveWorker = new Worker('js/worker.js');

// any changes made below must also be made in 'es5-worker.js'

solveWorker.onmessage = function(event) {
  const solutionBox = document.querySelector('#solution');

  const solutionArray = event.data.solutionArray;
  const puzzleIsSolved = solutionArray ? true : false;

  if (puzzleIsSolved) {
    // fill board with solution
    solutionArray.forEach((cellVal, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      const inputBox = document.querySelector(`#row${row}col${col}input`);
      if (!inputBox.value) {
        inputBox.classList.add('generated');
        inputBox.value = cellVal;
      }
    });

    const solutionString = solutionArray.join('');
    solutionBox.value = solutionString;
  } else {
    solutionBox.value = 'There are no solutions.';
  }

  // if 'query param' in URL bar doesn't match input boardString,
  // clear it and enable permalink button
  const boardString = event.data.boardString;
  if (location.search.substring(1) !== boardString) {
    history.pushState(null, null, window.location.href.split('?')[0]);

    const permalink = document.querySelector('#permalink');
    permalink.removeAttribute('disabled');
  }
};

export { solveWorker };
