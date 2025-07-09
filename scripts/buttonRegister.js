window.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("btnRegister");
  const image = document.getElementById("imgRegister");
  const soundClick = new Audio("assets/sounds/click.mp3");
  button.addEventListener("mousedown", function () {
    image.src = "assets/images/register_button_pressed.png";
    soundClick.currentTime = 0;
    soundClick.play();
  });

  button.addEventListener("mouseup", function () {
    image.src = "assets/images/register_button.png";
  });
});
