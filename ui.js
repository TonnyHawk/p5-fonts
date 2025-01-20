(function () {
  // Custom progress bars
  // const controls = document.querySelectorAll('.control');
  // controls.forEach((control) => {
  //   const progressBarContainer = control.querySelector('.control-range');
  //   if (progressBarContainer) {
  //     const progress = control.querySelector('.control-range-bar');
  //     const uiValue = control.querySelector('.control-value');

  //     // Function to set progress based on click position
  //     let clickX = 0;
  //     function setProgress(event) {
  //       const containerWidth = progressBarContainer.offsetWidth;
  //       clickX = event.offsetX; // Position of the click

  //       let newProgress = (clickX / containerWidth) * 100; // Calculate percentage
  //       if (newProgress > 100) newProgress = 100;
  //       if (newProgress < 0) newProgress = 0;
  //       progress.style.width = `${newProgress}%`;
  //       console.log(parseInt(newProgress));
  //       // update number on UI
  //       uiValue.textContent = parseInt(newProgress) + '%';
  //     }
  //     // Add event listener for dragging
  //     let isDragging = false;
  //     function draging(event) {
  //       if (isDragging) {
  //         setProgress(event);
  //       }
  //     }

  //     progressBarContainer.addEventListener(
  //       'mousedown',
  //       () => (isDragging = true)
  //     );
  //     document.addEventListener('mouseup', () => (isDragging = false));
  //     document.addEventListener('mousemove', (event) => draging(event));
  //   }
  // });

  // progress bars
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach((slider) => {
    const valueScreen = slider.parentElement.querySelector('.control-value');
    valueScreen.textContent = slider.value;
    slider.addEventListener('input', function () {
      valueScreen.textContent = slider.value;
    });
  });
  // background color buttons
  const backgroundBtns = document.querySelectorAll('.buttons');
  backgroundBtns.forEach((group) => {
    const buttons = group.querySelectorAll('.button');
    buttons.forEach((button) => {
      button.addEventListener('click', function () {
        const color = this.dataset.color;
        buttons.forEach((btn) => {
          btn.classList.remove('is-active');
          btn.style.removeProperty('background');
        });
        this.style.background = color;
        this.classList.add('is-active');
      });
    });
  });

  const switches = document.querySelectorAll('.switch');
  switches.forEach((el) => {
    el.addEventListener('click', function () {
      this.classList.toggle('is-active');
      const display = this.parentElement.querySelector('.control-name span');
      display.textContent = Array.from(this.classList).includes('is-active')
        ? 'On'
        : 'Off';
    });
  });

  function placeTheBoard() {
    const board = document.querySelector('#artboard');
    const boardPlaceholder = document.querySelector('#artboard-placeholder');
    board.style.width = boardPlaceholder.clientWidth + 'px';
  }
  placeTheBoard();
  window.addEventListener('resize', placeTheBoard);
})();
