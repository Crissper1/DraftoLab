document.addEventListener("DOMContentLoaded", function () {
  const closeButton = document.querySelectorAll(".btn-close-modal");
  const soundClick = new Audio("assets/sounds/click.mp3");

  closeButton.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = button.closest(".modal");

      button.style.transition = "filter 0.2s ease";
      button.style.filter = "brightness(70%)";

      soundClick.currentTime = 0;
      soundClick.play();

      setTimeout(() => {
        button.style.filter = "brightness(100%)";

        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }, 150); 
    });
  });
});
