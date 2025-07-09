 window.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("btnOpenModal");
    const image = document.getElementById("imgPlay");
    const soundClick = new Audio("assets/sounds/click.mp3");
    button.addEventListener("mousedown", function () {
      image.src = "assets/images/play_button_pressed.png";
      soundClick.currentTime = 0;
      soundClick.play();
    });

    button.addEventListener("mouseup", function () {
      image.src = "assets/images/play_button.png";
    });

  });