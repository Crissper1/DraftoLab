document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("playersTableBody");
  const editModal = new bootstrap.Modal(document.getElementById("editPlayerModal"));
  const editForm = document.getElementById("editPlayerForm");

  let currentRow = null;

  // Delegar eventos para botones dentro de la tabla
  tableBody.addEventListener("click", function (e) {
    const target = e.target;
    const button = target.closest("button");
    if (!button) return;

    const row = button.closest("tr");
    if (!row) return;

    // Borrar jugador con confirmación
    if (button.classList.contains("btn-delete")) {
      const playerName = row.dataset.name;
      if (confirm(`¿Estás seguro de que deseas borrar a ${playerName}?`)) {
        row.remove();
      }
      e.stopPropagation();
    }

    // Editar jugador: abre modal para editar datos
    if (button.classList.contains("btn-edit")) {
      currentRow = row;

      // Obtener datos actuales
      const playerName = row.dataset.name;
      const password = row.dataset.password;
      const score = row.querySelector(".player-score").textContent;

      // Completar formulario
      document.getElementById("editPlayerName").value = playerName;
      document.getElementById("editPlayerPassword").value = password;
      document.getElementById("editPlayerScore").value = parseInt(score);

      editModal.show();
      e.stopPropagation();
    }
  });

  // Guardar cambios en el modal editar jugador
  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!currentRow) return;

    const newName = document.getElementById("editPlayerName").value.trim();
    const newPassword = document.getElementById("editPlayerPassword").value.trim();
    const newScore = parseInt(document.getElementById("editPlayerScore").value);

    currentRow.dataset.name = newName;
    currentRow.dataset.password = newPassword;
    currentRow.querySelector(".player-name").textContent = newName;
    currentRow.querySelector(".player-score").textContent = newScore;

    editModal.hide();
  });
});
