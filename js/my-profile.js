document.addEventListener("DOMContentLoaded", function () {
  // Verificar si el usuario ha iniciado sesión
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    window.location.href = "login.html";
    return;
  }

  // Elementos del DOM
  const profileForm = document.getElementById("profile-form");
  const userInfoSpan = document.getElementById("user-info");
  const logoutLink = document.getElementById("logout-link");
  const modoOscuroSwitch = document.getElementById("modo-oscuro");
  const profileImageInput = document.getElementById("profile-image-input");
  const profileImage = document.getElementById("profile-image");
  userInfoSpan.textContent = loggedInUser;

  // Cargar los datos del perfil guardados y la preferencia de modo oscuro
  loadProfileData();
  loadDarkModePreference();

  updateCartBadge(); //Agrega el badge!

  // Event listeners
  profileForm.addEventListener("submit", handleProfileSubmit);
  logoutLink.addEventListener("click", handleLogout);
  modoOscuroSwitch.addEventListener("change", toggleDarkMode);
  profileImageInput.addEventListener("change", handleProfileImageChange);

  // Validación del formulario con Bootstrap
  (function () {
    "use strict";
    var forms = document.querySelectorAll(".needs-validation");
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add("was-validated");
        },
        false
      );
    });
  })();

  // Cargar los datos guardados en localStorage
  function loadProfileData() {
    const profileData =
      JSON.parse(localStorage.getItem(`${loggedInUser}_profileData`)) || {};
    document.getElementById("nombre").value = profileData.nombre || "";
    document.getElementById("segundo-nombre").value =
      profileData.segundoNombre || "";
    document.getElementById("apellido").value = profileData.apellido || "";
    document.getElementById("segundo-apellido").value =
      profileData.segundoApellido || "";
    document.getElementById("email").value = profileData.email || loggedInUser; //Para poner el nombre de usuario como email por defecto
    document.getElementById("telefono").value = profileData.telefono || "";

    if (profileData.imagenPerfil) {
      profileImage.src = profileData.imagenPerfil;
    }
  }

  // Manejar el envío del formulario
  function handleProfileSubmit(event) {
    if (!profileForm.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      profileForm.classList.add("was-validated");
      return;
    }

    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const profileData = {
      nombre: document.getElementById("nombre").value,
      segundoNombre: document.getElementById("segundo-nombre").value,
      apellido: document.getElementById("apellido").value,
      segundoApellido: document.getElementById("segundo-apellido").value,
      email: document.getElementById("email").value,
      telefono: document.getElementById("telefono").value,
      imagenPerfil: profileImage.src,
    };

    // Guardar los datos en localStorage usando el nombre de usuario como clave
    localStorage.setItem(
      `${loggedInUser}_profileData`,
      JSON.stringify(profileData)
    );

    const successModal = new bootstrap.Modal(
      document.getElementById("profile-success-modal")
    );
    successModal.show();

    setTimeout(() => {
      successModal.hide();
    }, 2000); // Cerrar después de 3 segundos
  }

  // Manejar el cierre de sesión
  function handleLogout(event) {
    event.preventDefault();
    if (logoutLink) {
      localStorage.removeItem("loggedInUser"); // Eliminar la sesión del usuario
      window.location.href = "login.html"; // Redirigir a la página de inicio de sesión
    } else {
      console.error("Error: no se encontró el enlace de logout");
    }
  }

  // Cargar la preferencia del modo oscuro
  function loadDarkModePreference() {
    const isDarkMode =
      localStorage.getItem(`${loggedInUser}_darkMode`) === "true";
    modoOscuroSwitch.checked = isDarkMode;
    applyDarkMode(isDarkMode); // Aplicar el modo oscuro o claro según la preferencia
  }

  // Cambiar el modo oscuro
  function toggleDarkMode() {
    const isDarkMode = modoOscuroSwitch.checked;
    localStorage.setItem(`${loggedInUser}_darkMode`, isDarkMode); // Guardar la preferencia por usuario
    applyDarkMode(isDarkMode);
  }

  // Aplicar la clase correcta al body para el modo oscuro
  function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
      document.body.classList.add("bg-dark", "text-white");

      // Aplicar estilos oscuros al formulario y sus campos
      document.querySelectorAll("form, input, textarea").forEach((el) => {
        el.classList.add("bg-dark", "text-white");
      });

      // Aplicar modo oscuro a la tarjeta del formulario
      document.querySelectorAll(".card-body").forEach((el) => {
        el.classList.add("bg-dark", "text-white");
      });
    } else {
      document.body.classList.remove("bg-dark", "text-white");

      // Revertir estilos cuando se desactiva el modo oscuro
      document.querySelectorAll("form, input, textarea").forEach((el) => {
        el.classList.remove("bg-dark", "text-white");
      });

      // Revertir estilos de la tarjeta del formulario
      document.querySelectorAll(".card-body").forEach((el) => {
        el.classList.remove("bg-dark", "text-white");
      });
    }

    document
      .querySelectorAll(".card, .modal-content, .form-control")
      .forEach((el) => {
        el.classList.toggle("bg-dark", isDarkMode);
        el.classList.toggle("text-white", isDarkMode);
        el.classList.toggle("border-secondary", isDarkMode);
      });
  }

  // Desafíate - Manejar el cambio de imagen de perfil
  function handleProfileImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      // Limitamos el tamaño de la imagen 1 MB
      if (file.size > 1024 * 1024) {
        alert("La imagen supera el tamaño permitido de 1 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        // Previsualizamos y guardamos en el localStorage
        profileImage.src = e.target.result;
        const profileData =
          JSON.parse(localStorage.getItem(`${loggedInUser}_profileData`)) || {};
        profileData.imagenPerfil = e.target.result;
        localStorage.setItem(
          `${loggedInUser}_profileData`,
          JSON.stringify(profileData)
        );
      };
      reader.readAsDataURL(file);
    }
  }
});

function updateCartBadge() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const cartItems =
    JSON.parse(localStorage.getItem(`${loggedInUser}_cartProducts`)) || [];
  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
  const badge = document.getElementById("cart-badge");
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "inline" : "none";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  updateCartBadge();
});
