export default (setUpBoard, setUpBadInputWarning) => {

  const handleClick = () => {
    const board = document.querySelector('table');
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }

    setUpBoard();
    setUpBadInputWarning();

    const stringEntryBox = document.querySelector('#stringEntry');
    stringEntryBox.value = stringEntryBox.defaultValue;

    const solutionStringBox = document.querySelector('#solution');
    solutionStringBox.value = solutionStringBox.defaultValue;

    history.pushState(null, null, window.location.href.split('?')[0]);

    const permalink = document.querySelector('#permalink');
    permalink.setAttribute('disabled', '');
  };

  const clear = document.querySelector('#clear');
  clear.addEventListener('click', handleClick);
};
