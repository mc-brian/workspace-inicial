document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html";
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html";
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html";
    });

    // Verificar si el usuario ha iniciado sesión
    if (!localStorage.getItem('loggedInUser')) {
        location.href = "login.html";
    }

    // Manejo del cierre de sesión
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }

    function handleLogout(event) {
        event.preventDefault();
        localStorage.removeItem('loggedInUser'); // Eliminar la sesión del usuario
        window.location.href = 'login.html';    // Redirigir a la página de inicio de sesión
    }

    updateCartBadge(); //Agrega el badge! 
});

function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem("cartProducts")) || [];
    const totalItems = cartItems.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
    );
    const badge = document.getElementById("cart-badge");
    
    if (totalItems > 0) {
        badge.textContent = totalItems; // Muestra la cantidad
        badge.style.display = "inline"; // Asegura que el badge esté visible
    } else {
        badge.style.display = "none"; // Oculta el badge si no hay productos
    }
}
