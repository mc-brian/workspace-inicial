document.addEventListener("DOMContentLoaded", function () {
    loadDarkModePreference();
    fetchExchangeRate(); // Modificamos para llamar primero al tipo de cambio
    updateCartBadge(); //Para agregar el badge!
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

  let exchangeRate = 0; // Variable global para el tipo de cambio
  
  // Función para obtener el tipo de cambio actualizado
  async function fetchExchangeRate() {
      try {
          const response = await fetch("https://uy.dolarapi.com/v1/cotizaciones");
          const data = await response.json();
          // Tomamos el valor de venta para la conversión de dólar a peso uruguayo
          exchangeRate = data.find(item => item.moneda === 'USD')?.venta || 0; 
          console.log(`Tipo de cambio obtenido: ${exchangeRate}`);
          loadCart(); // Cargamos el carrito después de obtener el tipo de cambio
      } catch (error) {
          console.error("Error al obtener el tipo de cambio:", error);
          exchangeRate = 0; // En caso de error, dejamos el tipo de cambio en 0
      }
  }
  
  function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem("cartProducts")) || [];
    const cartContainer = document.getElementById("cart-items");
    const loggedInUser = localStorage.getItem("loggedInUser");
    const isDarkMode =
      localStorage.getItem(`${loggedInUser}_darkMode`) === "true";
  
    if (cartItems.length === 0) {
      cartContainer.innerHTML = `
              <div class="alert ${isDarkMode ? "alert-dark" : "alert-info"}">
                  No hay productos en el carrito.
              </div>`;
      updateSubtotal(0);
      return;
    }
  
    let cartHTML = "";
    cartItems.forEach((item, index) => {
      // Calculamos el precio en pesos si es en dólares
      const priceInPesos = item.currency === 'USD' 
        ? (item.cost * exchangeRate).toFixed(2) 
        : item.cost;
  
      cartHTML += `
              <div class="card mb-3 ${
                isDarkMode ? "bg-dark text-white border-secondary" : ""
              }">
                  <div class="row g-0">
                      <div class="col-md-2 d-flex align-items-center justify-content-center p-2">
                          <div class="img-container" style="height: 150px; display: flex; align-items: center;">
                              <img src="${item.images[0]}" 
                                   class="img-fluid rounded" 
                                   alt="${item.name}"
                                   style="max-height: 100%; object-fit: contain;">
                          </div>
                      </div>
                      <div class="col-md-10">
                          <div class="card-body">
                              <div class="d-flex justify-content-between">
                                  <h5 class="card-title">${item.name}</h5>
                                  <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
                                      <i class="fas fa-trash"></i>
                                  </button>
                              </div>
                              <p class="card-text">
                                  Precio: ${item.currency} ${item.cost}
                                  ${item.currency === 'USD' ? `(UYU ${priceInPesos})` : ''}
                              </p>
                              <div class="d-flex align-items-center">
                                  <label class="me-2">Cantidad:</label>
                                  <input type="number" 
                                         class="form-control quantity-input ${
                                           isDarkMode
                                             ? "bg-dark text-white border-secondary"
                                             : ""
                                         }" 
                                         style="width: 100px"
                                         min="1" 
                                         step="1"
                                         value="${item.quantity || 1}"
                                         data-index="${index}"
                                         data-price="${item.cost}"
                                         data-original-currency="${item.currency}"
                                         onchange="validateAndUpdateQuantity(this)"
                                         onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                              </div>
                              <p class="card-text mt-2">
                                  Subtotal: ${
                                    item.currency
                                  } <span class="item-subtotal">
                                      ${calculateItemSubtotal(item)}
                                  </span>
                                  ${item.currency === 'USD' 
                                    ? `(UYU ${calculateItemSubtotalInPesos(item)})` 
                                    : ''}
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          `;
    });
  
    cartContainer.innerHTML = cartHTML;
    updateTotalSubtotal();
  }
  
  function calculateItemSubtotal(item) {
    return (item.cost * (item.quantity || 1)).toFixed(2);
  }
  
  function calculateItemSubtotalInPesos(item) {
    return item.currency === 'USD' 
      ? (item.cost * exchangeRate * (item.quantity || 1)).toFixed(2) 
      : item.cost;
  }
  
  function updateTotalSubtotal() {
    const cartItems = JSON.parse(localStorage.getItem("cartProducts")) || [];
    
    // Calculamos subtotal en pesos uruguayos
    const totalInPesos = cartItems.reduce((sum, item) => {
      const itemPesos = item.currency === 'USD' 
        ? item.cost * exchangeRate * (item.quantity || 1)
        : item.cost * (item.quantity || 1);
      return sum + itemPesos;
    }, 0);
  
    document.getElementById("subtotal").textContent = totalInPesos.toFixed(2);
  }
  
  function validateAndUpdateQuantity(input) {
    let value = parseInt(input.value);
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    input.value = value;
    updateQuantity(input.dataset.index, value);
  }
  
  function updateQuantity(index, newQuantity) {
    const cartItems = JSON.parse(localStorage.getItem("cartProducts"));
    cartItems[index].quantity = parseInt(newQuantity);
    localStorage.setItem("cartProducts", JSON.stringify(cartItems));
  
    const itemSubtotalElement = document.querySelectorAll(".item-subtotal")[index];
    itemSubtotalElement.textContent = calculateItemSubtotal(cartItems[index]);
  
    updateTotalSubtotal();
  }
  
  function removeFromCart(index) {
    const cartItems = JSON.parse(localStorage.getItem("cartProducts"));
    cartItems.splice(index, 1);
    localStorage.setItem("cartProducts", JSON.stringify(cartItems));
    loadCart();
    updateCartBadge();
  }
  
  function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem("cartProducts")) || [];
    const totalItems = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    const badge = document.getElementById("cart-badge");
    if (badge) {
      badge.textContent = totalItems;
    }
  }
  
  function loadDarkModePreference() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const isDarkMode =
      localStorage.getItem(`${loggedInUser}_darkMode`) === "true";
    applyDarkMode(isDarkMode);
  }
  
  function applyDarkMode(isDarkMode) {
    // Lógica de modo oscuro previa
    document.body.classList.toggle("bg-dark", isDarkMode);
    document.body.classList.toggle("text-white", isDarkMode);
  
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.toggle("bg-dark", isDarkMode);
      card.classList.toggle("text-white", isDarkMode);
      card.classList.toggle("border-secondary", isDarkMode);
    });
  
    document.querySelectorAll(".form-control").forEach((input) => {
      input.classList.toggle("bg-dark", isDarkMode);
      input.classList.toggle("text-white", isDarkMode);
      input.classList.toggle("border-secondary", isDarkMode);
    });
  
    const summaryContainer = document.getElementById("summary-container");
    if (summaryContainer) {
      summaryContainer.classList.toggle("bg-dark", isDarkMode);
      summaryContainer.classList.toggle("text-white", isDarkMode);
    }
  }
