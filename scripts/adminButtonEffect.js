document.addEventListener("DOMContentLoaded", function () {
  const enterButton = document.getElementById("btnCheckPassword");
  const clickSound = new Audio("assets/sounds/click.mp3");

  if (enterButton) {
    enterButton.addEventListener("click", function () {
            
      enterButton.style.transition = "filter 0.2s ease";  
      enterButton.style.filter = "brightness(70%)";
   
      clickSound.currentTime = 0;
      clickSound.play();

      setTimeout(() => {
        enterButton.style.filter = "brightness(100%)";
      }, 200);
    });
  }
});
