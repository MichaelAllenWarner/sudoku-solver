export default function setUpStringEntry() {
  if (location.search) {
    const stringInput = location.search.substring(1).replace(/[^0-9]/gi, '0');
    if (stringInput.length === 81 && Number.isInteger(+stringInput) && +stringInput >= 0) {
      stringInput.split('').forEach((valToInsert, index) => {
        const cellInputBox = document.querySelector(`#row${Math.floor(index / 9)}col${index % 9}input`);
        cellInputBox.classList.remove('generated');
        cellInputBox.value = (+valToInsert === 0) ? '' : valToInsert;
      });
      document.querySelector('#submit').click();
    } else {
      history.pushState(null, null, window.location.href.split('?')[0]);
    }
  }
  document.querySelector('#stringEntry').addEventListener('input', function() {
    document.querySelector('#permalink').setAttribute('disabled', '');
    history.pushState(null, null, window.location.href.split('?')[0]);
    const stringInput = this.value.replace(/[^0-9]/gi, '0');
    if (stringInput.length === 81 && Number.isInteger(+stringInput) && +stringInput >= 0) {
      stringInput.split('').forEach((valToInsert, index) => {
        this.value = stringInput;
        const cellInputBox = document.querySelector(`#row${Math.floor(index / 9)}col${index % 9}input`);
        cellInputBox.classList.remove('generated');
        cellInputBox.value = (+valToInsert === 0) ? '' : valToInsert;
      });
      document.querySelector('#permalink').removeAttribute('disabled');
    }
  });
  document.querySelector('#stringEntry').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      document.querySelector('#submit').click();
    }
  });
  // following commented out b/c select() may be problematic on mobile
  // document.querySelector('#stringEntry').addEventListener('focus', function() {
  //   this.select();
  // });
  // document.querySelector('#stringEntry').addEventListener('click', function() {
  //   this.select();
  // });
  // document.querySelector('#solution').addEventListener('focus', function() {
  //   this.select();
  // });
  // document.querySelector('#solution').addEventListener('click', function() {
  //   this.select();
  // });
}
