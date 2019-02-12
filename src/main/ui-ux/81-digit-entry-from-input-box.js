import isStringAPuzzle from '../utils/is-string-a-puzzle';
import fillBoardFromString from '../utils/fill-board-from-string';

export default () => {
  const stringEntryBox = document.querySelector('#stringEntry');
  stringEntryBox.addEventListener('input', handleInput);
  stringEntryBox.addEventListener('keyup', handleKeyup);

  function handleInput() {

    // disable permalink button (if valid puzzle, will be re-enabled in fillBoardFromString below)
    const permalink = document.querySelector('#permalink');
    permalink.setAttribute('disabled', '');

    // clear 'query param' (b/c if they matched before, they don't now)
    history.pushState(null, null, window.location.href.split('?')[0]);

    const stringInput = this.value;

    if (isStringAPuzzle(stringInput)) {
      const stringWithZeroes = stringInput.replace(/[^0-9]/gi, '0');

      this.value = stringWithZeroes;
      fillBoardFromString(stringWithZeroes);
    }
  }

  function handleKeyup(event) {
    if (event.key === 'Enter') {
      const submit = document.querySelector('#submit');
      submit.click();
    }
  }
};
