export default function setUpBadInputWarning() {
  const allInputBoxes = document.querySelectorAll('.manualInput');
  allInputBoxes.forEach(box => {
    box.addEventListener('animationend', function() {
      this.classList.remove('warning'); 
    });
  });
}
