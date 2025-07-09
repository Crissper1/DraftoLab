document.addEventListener("DOMContentLoaded", function () {
  const btnHome = document.getElementById("btnHome");
  const soundClick = new Audio("assets/sounds/click.mp3");

  btnHome.addEventListener("click", function (e) {
    e.preventDefault();

    btnHome.style.filter = "brightness(70%)";

    soundClick.currentTime = 0;
    soundClick.play();

    setTimeout(() => {
      btnHome.style.filter = "brightness(100%)";
      window.location.href = "index.html";
    }, 300);
  });
});
