import isStringAPuzzle from '../utils/is-string-a-puzzle';

export default () => {
  const permalink = document.querySelector('#permalink');
  permalink.addEventListener('click', handleClick);

  function handleClick() {
    const stringEntryBox = document.querySelector('#stringEntry');
    const stringInput = stringEntryBox.value;

    if (isStringAPuzzle(stringInput)) {
      history.pushState(null, null, `?${stringInput}`);
    }
  }
};
