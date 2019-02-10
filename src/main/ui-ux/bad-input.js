export default () => {
  const allInputBoxes = document.querySelectorAll('.manualInput');
  for (const box of allInputBoxes) {
    box.addEventListener('animationend', function() {
      this.classList.remove('warning'); 
    });
  }
};
