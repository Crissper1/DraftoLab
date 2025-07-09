document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.getElementById('btnPlayStart');
  const clickSound = new Audio("assets/sounds/click.mp3");

  playButton.addEventListener('click', function (e) {
    e.preventDefault(); 
    playButton.style.filter = "brightness(70%)";
    clickSound.currentTime = 0;
    clickSound.play();
    setTimeout(() => {
      playButton.style.filter = "brightness(100%)";
      window.location.href = 'board.html';
    }, 300); 
  });

  const playerCountSelect = document.getElementById("playerCount");
  const playerFieldsContainer = document.getElementById("playerNames");

  function updatePlayerFields() {
    const count = parseInt(playerCountSelect.value);
    playerFieldsContainer.innerHTML = "";

    for (let i = 1; i <= count; i++) {
      const group = document.createElement("div");
      group.classList.add("mb-2");

      const label = document.createElement("label");
      label.textContent = `JUGADOR ${i}`;
      group.appendChild(label);

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.classList.add("form-control", "mb-1");
      nameInput.placeholder = `Nombre jugador ${i}`;
      group.appendChild(nameInput);

      const passwordInput = document.createElement("input");
      passwordInput.type = "password";
      passwordInput.classList.add("form-control");
      passwordInput.placeholder = `Contraseña jugador ${i}`;
      group.appendChild(passwordInput);

      playerFieldsContainer.appendChild(group);
    }
  }

  updatePlayerFields();
  playerCountSelect.addEventListener("change", updatePlayerFields);
});
