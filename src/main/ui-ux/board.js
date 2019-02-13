import {
  generateCellInputHandler,
  generateCellKeydownHandler
} from '../utils/cell-event-handlers';


export default () => {

  const board = document.querySelector('table');

  for (let i = 0; i < 9; i++) {
    const currRow = board.insertRow(-1);
    const rowClass = (i % 3 === 0) ? 'top' : (i % 3 === 2) ? 'bottom' : null;

    for (let j = 0; j < 9; j++) {
      const currCell = currRow.insertCell(-1);
      const colClass = (j % 3 === 0) ? 'left' : (j % 3 === 2) ? 'right' : null;

      if (rowClass) {
        currCell.classList.add(rowClass);
      }

      if (colClass) {
        currCell.classList.add(colClass);
      }

      const inputBox = document.createElement('input');
      inputBox.setAttribute('type', 'number');
      inputBox.setAttribute('min', '1');
      inputBox.setAttribute('max', '9');
      inputBox.classList.add('manualInput');
      inputBox.id = `row${i}col${j}input`;

      const handleInput = generateCellInputHandler(i, j);
      const handleKeydown = generateCellKeydownHandler(i, j);

      inputBox.addEventListener('input', handleInput);
      inputBox.addEventListener('keydown', handleKeydown);

      currCell.appendChild(inputBox);
    }
  }
};
