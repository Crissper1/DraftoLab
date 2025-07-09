window.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("btnScrollUp");
  const soundClick = new Audio("assets/sounds/click.mp3");

  button.addEventListener("mousedown", function () {
    button.style.filter = "brightness(70%)";
    soundClick.currentTime = 0;
    soundClick.play();
  });

  button.addEventListener("mouseup", function () {
    button.style.filter = "brightness(100%)";
    setTimeout(function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 150); 
  });

  button.addEventListener("mouseleave", function () {
    button.style.filter = "brightness(100%)";
  });
});