export default solveWorker => {

  const submit = document.querySelector('#submit');
  submit.addEventListener('click', handleClick);

  function handleClick() {

    // create a boardString to send to solveWorker
    const allManualInputs = document.querySelectorAll('.manualInput');
    const inputValArray = [];

    for (const input of allManualInputs) {
      if (input.value) {
        inputValArray.push(input.value);
      } else {
        inputValArray.push(0);
      }
    }

    const boardString = inputValArray.join('');

    // make sure the string entry box has the right 81-digit string
    // (needed if puzzle was imported from 'query param')
    const stringEntryBox = document.querySelector('#stringEntry');
    stringEntryBox.value = boardString;

    const solutionBox = document.querySelector('#solution');
    solutionBox.value = 'Loading...';

    // solve!
    solveWorker.postMessage(boardString);
  }
};
