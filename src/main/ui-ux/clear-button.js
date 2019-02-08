export default (setUpBoard, setUpBadInputWarning) => {

  const handleClick = () => {
    const allRows = document.querySelectorAll('tr');
    allRows.forEach(row => {
      row.remove();
    });

    setUpBoard();
    setUpBadInputWarning();

    const stringEntryBox = document.querySelector('#stringEntry');
    stringEntryBox.value = stringEntryBox.defaultValue;

    const solutionStringBox = document.querySelector('#solution');
    solutionStringBox.value = solutionStringBox.defaultValue;

    history.pushState(null, null, window.location.href.split('?')[0]);
    document.querySelector('#permalink').setAttribute('disabled', '');
  };

  const clear = document.querySelector('#clear');

  clear.addEventListener('click', handleClick);
};
