export default (row, col) => {
  const cellToFocusOn = document.querySelector(`#row${row}col${col}input`);
  cellToFocusOn.focus();
};
