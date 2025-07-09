document.addEventListener("DOMContentLoaded", function () {
  const rows = document.querySelectorAll(".player-row");
  const clickSound = new Audio("assets/sounds/click.mp3");

  rows.forEach(row => {
    row.style.cursor = "pointer";

    row.addEventListener("click", () => {
      const name = row.dataset.name;
      const wins = parseInt(row.dataset.wins);
      const losses = parseInt(row.dataset.losses);
      const lastGame = row.dataset.last;
      const total = wins + losses;

      // Efecto visual al presionar
      row.style.transition = "filter 0.2s ease";
      row.style.filter = "brightness(70%)";

      clickSound.currentTime = 0;
      clickSound.play();

      setTimeout(() => {
        row.style.filter = "brightness(100%)";        

        // Cargar datos en el modal
        document.getElementById("playerName").textContent = name;
        document.getElementById("wins").textContent = "Partidas Ganadas: " + wins;
        document.getElementById("losses").textContent = "Partidas Perdidas: " + losses;
        document.getElementById("total").textContent = "Partidas Totales: " + total;
        document.getElementById("lastGame").textContent = "Última partida: " + lastGame;

        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById("playerModal"));
        modal.show();
      }, 150);
    });
  });
});