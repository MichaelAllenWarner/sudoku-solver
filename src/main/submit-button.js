export default function setUpSubmitButton(solveWorker) {

  const handleClick = () => {
    const allManualInputs = document.querySelectorAll('.manualInput');
    const inputValArray = [];
    allManualInputs.forEach(input => {
      if (input.value) {
        inputValArray.push(input.value);
      } else {
        inputValArray.push(0);
      }
    });

    const boardString = inputValArray.join('');

    const stringEntryBox = document.querySelector('#stringEntry');
    stringEntryBox.value = boardString;

    const solutionBox = document.querySelector('#solution');
    solutionBox.value = 'Loading...';

    solveWorker.postMessage(boardString);
  };

  const submit = document.querySelector('#submit');

  submit.addEventListener('click', handleClick);
}
