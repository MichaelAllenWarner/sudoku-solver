export default stringInput => {
  stringInput.split('').forEach((valToInsert, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const cellInputBox = document.querySelector(`#row${row}col${col}input`);
    cellInputBox.classList.remove('generated');
    cellInputBox.value = (+valToInsert === 0) ? '' : valToInsert;
  });

  // enable permalink button
  const permalink = document.querySelector('#permalink');
  permalink.removeAttribute('disabled');
};
