const controls = document.querySelectorAll('.control');
controls.forEach((control) => {
  const progressBarContainer = control.querySelector('.control-range');
  const progress = control.querySelector('.control-range-bar');
  const uiValue = control.querySelector('.control-value');

  // Function to set progress based on click position
  let clickX = 0;
  function setProgress(event) {
    const containerWidth = progressBarContainer.offsetWidth;
    clickX = event.offsetX; // Position of the click

    let newProgress = (clickX / containerWidth) * 100; // Calculate percentage
    if (newProgress > 100) newProgress = 100;
    if (newProgress < 0) newProgress = 0;
    progress.style.width = `${newProgress}%`;
    console.log(parseInt(newProgress));
    // update number on UI
    uiValue.textContent = parseInt(newProgress) + '%';
  }

  // Add event listener for dragging
  let isDragging = false;
  function draging(event) {
    if (isDragging) {
      setProgress(event);
    }
  }

  progressBarContainer.addEventListener('mousedown', () => (isDragging = true));
  document.addEventListener('mouseup', () => (isDragging = false));
  document.addEventListener('mousemove', (event) => draging(event));
});
