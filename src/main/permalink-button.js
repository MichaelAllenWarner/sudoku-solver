export default function setUpPermalinkButton() {
  document.querySelector('#permalink').addEventListener('click', () => {
    const stringInput = document.querySelector('#stringEntry').value.replace(/[^0-9]/gi, '0');
    if (stringInput.length === 81 && Number.isInteger(+stringInput) && +stringInput >= 0) {
      history.pushState(null, null, `?${document.querySelector('#stringEntry').value}`);
    }
  });
}
