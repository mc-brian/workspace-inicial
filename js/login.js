document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inicio').addEventListener('click', () => {
      let usuario = document.getElementById('usuario').value;
      let clave = document.getElementById('password').value;

      if (usuario !== "" && clave !== "") {
          // Usamos el nombre de usuario como userID
          localStorage.setItem('loggedInUser', usuario);
          localStorage.setItem(`${usuario}_preferences`, JSON.stringify({}));
          location.href = "index.html";
      } else {
          alert("Falta usuario o contraseña");
      }
  });
});