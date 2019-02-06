export default function setUpPermalinkButton() {

  const handleClick = () => {
    const stringEntryBox = document.querySelector('#stringEntry');
    const stringInput = stringEntryBox.value.replace(/[^0-9]/gi, '0');

    if (stringInput.length === 81 && Number.isInteger(+stringInput) && +stringInput >= 0) {
      history.pushState(null, null, `?${document.querySelector('#stringEntry').value}`);
    }
  };

  const permalink = document.querySelector('#permalink');

  permalink.addEventListener('click', handleClick);
}
