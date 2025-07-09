document.addEventListener("DOMContentLoaded", () => {
  const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'), {
    backdrop: 'static',
    keyboard: false
  });
  passwordModal.show();

  const btnCheck = document.getElementById('btnCheckPassword');
  const inputPassword = document.getElementById('adminPassword');
  const errorMsg = document.getElementById('passwordError');
  const mainContent = document.getElementById('mainContent');

  btnCheck.addEventListener('click', () => {
    if (inputPassword.value === 'admin') {
      passwordModal.hide();
      mainContent.style.display = 'block';
      errorMsg.style.display = 'none';
    } else {
      errorMsg.style.display = 'block';
    }
  });

  inputPassword.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
      btnCheck.click();
    }
  });
});
