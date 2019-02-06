export default function setUp81DigitEntry() {

  // on page load, look for 'query param' in URL bar:
  if (location.search) {
    const stringInput = location.search.substring(1).replace(/[^0-9]/gi, '0');

    // if 'query param' is a valid 81-digit string, fill the board and try to solve
    if (inputIsGood(stringInput)) {
      fillBoard(stringInput);

      const submit = document.querySelector('#submit');
      submit.click();
    }

    // if 'query param' is NOT a valid 81-digit string, clear the 'query param'
    else {
      history.pushState(null, null, window.location.href.split('?')[0]);
    }
  }

  const stringEntryBox = document.querySelector('#stringEntry');

  stringEntryBox.addEventListener('input', handleInput);
  stringEntryBox.addEventListener('keyup', handleKeyup);

  function handleInput() {
    // disable permalink button and clear 'query param'
    const permalink = document.querySelector('#permalink');
    permalink.setAttribute('disabled', '');
    history.pushState(null, null, window.location.href.split('?')[0]);

    const stringInput = this.value.replace(/[^0-9]/gi, '0');

    // if input is a valid 81-digit-string...
    if (inputIsGood(stringInput)) {

      // ... reformat stringEntryBox (probably not necessary but might be) ...
      this.value = stringInput;

      // ... and fill in board (but don't try to solve)
      fillBoard(stringInput);
    }
  }

  function inputIsGood(stringInput) {
    return (stringInput.length === 81
      && Number.isInteger(+stringInput)
      && +stringInput >= 0);
  }

  function fillBoard(stringInput, fromUrlBarOrStringEntry) {
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
  }

  function handleKeyup(event) {
    if (event.key === 'Enter') {
      const submit = document.querySelector('#submit');
      submit.click();
    }
  }
}
