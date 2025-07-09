window.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("btnResults");
  const image = document.getElementById("imgResults");
  const soundClick = new Audio("assets/sounds/click.mp3");
    button.addEventListener("mousedown", function () {
      image.src = "assets/images/results_button.png";
      soundClick.currentTime = 0;
      soundClick.play();
    });

    button.addEventListener("mouseup", function () {
      image.src = "assets/images/results_button_pressed.png";
        setTimeout(function () {
      window.location.href = "results.html";
    }, 150);
  });

  });