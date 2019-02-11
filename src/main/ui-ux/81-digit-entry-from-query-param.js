import isStringAPuzzle from '../utils/is-string-a-puzzle';
import fillBoardFromString from '../utils/fill-board-from-string';

export default () => {

  // on page load, look for 'query param' in URL bar:
  if (location.search) {
    const stringInput = location.search.substring(1);

    // if 'query param' is a valid puzzle, fill the board and try to solve
    if (isStringAPuzzle(stringInput)) {

      const stringWithZeroes = stringInput.replace(/[^0-9]/gi, '0');
      history.pushState(null, null, '?' + stringWithZeroes);

      fillBoardFromString(stringWithZeroes);

      const submit = document.querySelector('#submit');
      submit.click();
    }

    // if 'query param' is NOT a valid 81-digit string, clear the 'query param'
    else {
      history.pushState(null, null, window.location.href.split('?')[0]);
    }
  }
};
