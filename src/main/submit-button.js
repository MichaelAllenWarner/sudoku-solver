export default function setUpSubmitButton() {
  const solveWorker = new Worker('js/worker.js');
  document.querySelector('#submit').addEventListener('click', () => {
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
    document.querySelector('#stringEntry').value = boardString;
    document.querySelector('#solution').value = 'Loading...';
    solveWorker.postMessage(boardString);
    solveWorker.onmessage = function(event) {
      const solutionArray = event.data;
      if (solutionArray) {
        solutionArray.forEach((cellVal, index) => {
          const inputBox = document.querySelector(`#row${Math.floor(index / 9)}col${index % 9}input`);
          if (!inputBox.value) {
            inputBox.classList.add('generated');
            inputBox.value = cellVal;
          }
        });
        document.querySelector('#solution').value = solutionArray.join('');
      } else {
        document.querySelector('#solution').value = 'There are no solutions.'
      }
      if (location.search.substring(1) !== boardString) {
        history.pushState(null, null, window.location.href.split('?')[0]);
        document.querySelector('#permalink').removeAttribute('disabled');
      }
    }
  });
}
