document.addEventListener('DOMContentLoaded',()=>{

    document.getElementById('inicio').addEventListener('click',()=>{
        let usuario = document.getElementById('usuario').value;
        let clave = document.getElementById('password').value;

        if (usuario !== "" && clave !== "") {
            localStorage.setItem('loggedInUser', usuario);
            location.href = "index.html";
          } else {
            alert("Falta usuario o contraseña");
          }
    })
})