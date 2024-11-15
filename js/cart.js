document.addEventListener("DOMContentLoaded", function () {
  loadDarkModePreference();
  fetchExchangeRate(); // Obtener tipo de cambio
  updateCartBadge(); // Actualizar badge!

  // Event listeners para los formularios de los modales
  const shippingForm = document.getElementById("shipping-form");
  const addressForm = document.getElementById("address-form");
  const paymentForm = document.getElementById("payment-form");

  document
    .getElementById("finalize-button")
    .addEventListener("click", function () {
      const cartItems =
        JSON.parse(
          localStorage.getItem(
            `${localStorage.getItem("loggedInUser")}_cartProducts`
          )
        ) || [];
      if (cartItems.length === 0) {
        alert(
          "El carrito está vacío. Añade productos antes de finalizar la compra."
        );
        return;
      }
      const shippingModal = new bootstrap.Modal(
        document.getElementById("shippingModal")
      );
      shippingModal.show();
    });

  document
    .getElementById("shipping-type")
    .addEventListener("change", updateShippingCost);

  if (shippingForm) {
    shippingForm.addEventListener("submit", validateShipping);
  }

  if (addressForm) {
    addressForm.addEventListener("submit", validateAddress);
  }

  if (paymentForm) {
    paymentForm.addEventListener("submit", validatePayment);
  }

  // Event listener para cambios en la selección del departamento
  const departmentSelect = document.getElementById("department");
  if (departmentSelect) {
    departmentSelect.addEventListener("change", loadLocalities);
  }

  // Event listener para cambio de método de pago
  const paymentMethodSelect = document.getElementById("payment-method");
  if (paymentMethodSelect) {
    paymentMethodSelect.addEventListener("change", displayPaymentFields);
  }

  // Event listener para guardar la factura
  const saveInvoiceButton = document.getElementById("save-invoice");
  if (saveInvoiceButton) {
    saveInvoiceButton.addEventListener("click", saveInvoice);
  }
});

// Verificar si el usuario ha iniciado sesión
if (!localStorage.getItem("loggedInUser")) {
  location.href = "login.html";
}

// Manejo del cierre de sesión
const logoutLink = document.getElementById("logout-link");
if (logoutLink) {
  logoutLink.addEventListener("click", handleLogout);
}

function handleLogout(event) {
  event.preventDefault();
  localStorage.removeItem("loggedInUser"); // Eliminar la sesión del usuario
  window.location.href = "login.html"; // Redirigir a la página de inicio de sesión
}

let exchangeRate = 0; // Variable global para el tipo de cambio

// Función para obtener el tipo de cambio actualizado
async function fetchExchangeRate() {
  try {
    const response = await fetch("https://uy.dolarapi.com/v1/cotizaciones");
    const data = await response.json();
    exchangeRate = data.find((item) => item.moneda === "USD")?.venta || 0;
    console.log(`Tipo de cambio obtenido: ${exchangeRate}`);
    loadCart(); // Cargar el carrito después de obtener el tipo de cambio
  } catch (error) {
    console.error("Error al obtener el tipo de cambio:", error);
    exchangeRate = 0; // En caso de error, dejar el tipo de cambio en 0
  }
}
//cargamos la info necesaria para armar el carrito desde el localStorage
function loadCart() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const cartItems =
    JSON.parse(localStorage.getItem(`${loggedInUser}_cartProducts`)) || [];
  const cartContainer = document.getElementById("cart-items");
  const isDarkMode =
    localStorage.getItem(`${loggedInUser}_darkMode`) === "true";
  //chequeamos si el carrito está vacío y si lo está, desplegamos un mensaje
  const emptyMessage = document.getElementById("cart-empty-message");
  const finalizeButton = document.getElementById("finalize-button");

  if (cartItems.length === 0) {
    cartContainer.style.display = "none";
    emptyMessage.style.display = "block";
    finalizeButton.disabled = true; // Deshabilitar el botón si no hay productos
    return;
  }
  cartContainer.style.display = "block";
  emptyMessage.style.display = "none";
  finalizeButton.disabled = false; // Habilitar el botón si hay productos
  //Creamos los elementos en HTML para el carrito
  let cartHTML = "";
  cartItems.forEach((item, index) => {
    const priceInPesos =
      item.currency === "USD"
        ? (item.cost * exchangeRate).toFixed(2)
        : item.cost;

    cartHTML += `<div class="card mb-3 ${
      isDarkMode ? "bg-dark text-white border-secondary" : ""
    }">
                      <div class="row g-0">
                          <div class="col-md-2 d-flex align-items-center justify-content-center p-2">
                              <div class="img-container" style="height: 150px; display: flex; align-items: center;">
                                  <img src="${
                                    item.images[0]
                                  }" class="img-fluid rounded" alt="${
      item.name
    }" style="max-height: 100%; object-fit: contain;">
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
                                  <p class="card-text">Precio: ${
                                    item.currency
                                  } ${item.cost} ${
      item.currency === "USD" ? `(UYU ${priceInPesos})` : ""
    }</p>
                                  <div class="d-flex align-items-center">
                                      <label class="me-2">Cantidad:</label>
                                      <input type="number" class="form-control quantity-input ${
                                        isDarkMode
                                          ? "bg-dark text-white border-secondary"
                                          : ""
                                      }" style="width: 100px" min="1" step="1" value="${
      item.quantity || 1
    }" data-index="${index}" data-price="${
      item.cost
    }" data-original-currency="${
      item.currency
    }" onchange="validateAndUpdateQuantity(this)" onkeypress="return event.charCode >= 48 && event.charCode <= 57" required>
                                      <div class="invalid-feedback">
                                          La cantidad debe ser mayor a 0.
                                      </div>
                                  </div>
                                  <p class="card-text mt-2">Subtotal: ${
                                    item.currency
                                  } 
    <span class="item-subtotal">${calculateItemSubtotal(item)}</span> 
    ${
      item.currency === "USD"
        ? `(UYU <span class="item-subtotal-pesos">${calculateItemSubtotalInPesos(
            item
          )}</span>)`
        : ""
    }</p>
                              </div>
                          </div>
                      </div>
                  </div>`;
  });

  cartContainer.innerHTML = cartHTML;
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("input", () => {
      validateAndUpdateQuantity(input);
      updateTotalSubtotal(); // Actualiza el subtotal general en tiempo real
    });
  });

  updateTotalSubtotal(); // Inicializa el subtotal general
}

//Las funciones que calculan los subtotales propios de cada producto (cuando hay más de una unidad del mismo) y del total de productos.
function calculateItemSubtotal(item) {
  return (item.cost * (item.quantity || 1)).toFixed(2);
}

function calculateItemSubtotalInPesos(item) {
  const subtotalInPesos =
    item.currency === "USD"
      ? (item.cost * exchangeRate * (item.quantity || 1)).toFixed(2)
      : (item.cost * (item.quantity || 1)).toFixed(2);
  return subtotalInPesos;
}

function updateTotalSubtotal() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const cartItems =
    JSON.parse(localStorage.getItem(`${loggedInUser}_cartProducts`)) || [];

  const totalInPesos = cartItems.reduce((sum, item) => {
    const itemPesos =
      item.currency === "USD"
        ? item.cost * exchangeRate * (item.quantity || 1)
        : item.cost * (item.quantity || 1);
    return sum + itemPesos;
  }, 0);
  const subtotalElement = document.getElementById("subtotal");
  subtotalElement.textContent = totalInPesos.toFixed(2);
  updateShippingCost(); // Actualizamos el costo de envío y el total
}

//Con estas funciones manejamos la adición de más unidades de productos que ya están en el carrito.
function validateAndUpdateQuantity(input) {
  let value = parseInt(input.value);
  if (isNaN(value) || value < 1) {
    value = 1;
  }
  input.value = value;
  updateQuantity(input.dataset.index, value);
  updateTotalSubtotal();
}

function updateQuantity(index, newQuantity) {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const cartItems = JSON.parse(localStorage.getItem(`${loggedInUser}_cartProducts`));
  cartItems[index].quantity = parseInt(newQuantity);
  localStorage.setItem(`${loggedInUser}_cartProducts`, JSON.stringify(cartItems));

  const itemSubtotalElement = document.querySelectorAll(".item-subtotal")[index];
  itemSubtotalElement.textContent = calculateItemSubtotal(cartItems[index]);

  updateTotalSubtotal();
}

//Con esta función se pueden eliminar productos del carrito // Desafíate entrega 7!
function removeFromCart(index) {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const cartItems = JSON.parse(
    localStorage.getItem(`${loggedInUser}_cartProducts`)
  );
  cartItems.splice(index, 1);
  localStorage.setItem(
    `${loggedInUser}_cartProducts`,
    JSON.stringify(cartItems)
  );
  loadCart();
  updateCartBadge();
  updateTotalSubtotal();
}

//Esta función gestiona al badge. Toma la cantidad total de productos (contando la repetición de un  mismo producto) y la muestra en un badge en el
//desplegable, sobre le ítem del carrito
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
//Para gestionar el modo oscuro. Esta función carga la preferencia
function loadDarkModePreference() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const isDarkMode =
    localStorage.getItem(`${loggedInUser}_darkMode`) === "true";
  applyDarkMode(isDarkMode);
}
//Esta función invierte los colores de los elementos
function applyDarkMode(isDarkMode) {
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

  document
    .querySelectorAll(".card, .modal-content, .form-control")
    .forEach((el) => {
      el.classList.toggle("bg-dark", isDarkMode);
      el.classList.toggle("text-white", isDarkMode);
      el.classList.toggle("border-secondary", isDarkMode);
    });
  document.querySelectorAll("select, select option").forEach((el) => {
    el.classList.toggle("bg-dark", isDarkMode);
    el.classList.toggle("text-white", isDarkMode);
  });
}

// Actualizar dinámicamente los costos de envío y total
function updateShippingCost() {
  const shippingType = document.getElementById("shipping-type").value;
  const subtotal = parseFloat(document.getElementById("subtotal").textContent);
  let shippingCost = 0;
  if (shippingType) {
    shippingCost = (subtotal * parseFloat(shippingType)) / 100;
  }
  const totalCost = subtotal + shippingCost;

  document.getElementById("shipping-cost").textContent =
    shippingCost.toFixed(2);
  document.getElementById("total-cost").textContent = totalCost.toFixed(2);
}

// Validación de los campos de la sección del envío
function validateShipping(event) {
  event.preventDefault();
  const form = document.getElementById("shipping-form");

  if (!form.checkValidity()) {
    event.stopPropagation();
    form.classList.add("was-validated");
    return;
  }

  form.classList.add("was-validated");

  // Cierre de modal de envío y apertura del modal de dirección
  const shippingModal = bootstrap.Modal.getInstance(
    document.getElementById("shippingModal")
  );
  shippingModal.hide();
  const addressModal = new bootstrap.Modal(
    document.getElementById("addressModal")
  );
  addressModal.show();
}

// Validación de los campos de la sección de la dirección
function validateAddress(event) {
  event.preventDefault();
  const form = document.getElementById("address-form");

  if (!form.checkValidity()) {
    event.stopPropagation();
    form.classList.add("was-validated");
    return;
  }

  form.classList.add("was-validated");

  // Cierre del modal de dirección y apertur del modal del pago
  const addressModal = bootstrap.Modal.getInstance(
    document.getElementById("addressModal")
  );
  addressModal.hide();
  const paymentModal = new bootstrap.Modal(
    document.getElementById("paymentModal")
  );
  paymentModal.show();
}

// Validación de los campos de la sección de la forma de pago y los datos relacionados
function validatePayment(event) {
  event.preventDefault();
  const form = document.getElementById("payment-form");

  if (!form.checkValidity()) {
    event.stopPropagation();
    form.classList.add("was-validated");
    return;
  }

  form.classList.add("was-validated");

  // Cierre del modal de pago y apertura del modal de la compra exitosa
  const paymentModal = bootstrap.Modal.getInstance(
    document.getElementById("paymentModal")
  );
  paymentModal.hide();
  showSuccessModal();
}

// Función para mostrar el modal de éxito con la factura
function showSuccessModal() {
  generateInvoice(); // Generar la factura
  const successModal = new bootstrap.Modal(
    document.getElementById("successModal")
  );
  successModal.show();
  clearCart(); // Limpiar el carrito después de la compra
}

// Función para generar la ¿factura?
function generateInvoice() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const cartItems =
    JSON.parse(localStorage.getItem(`${loggedInUser}_cartProducts`)) || [];
  const shippingType = document.getElementById("shipping-type").value;
  const shippingCost = parseFloat(
    document.getElementById("shipping-cost").textContent
  );
  const totalCost = parseFloat(
    document.getElementById("total-cost").textContent
  );

  let invoiceHTML = `
      <h4>Factura de Compra</h4>
      <p><strong>Usuario:</strong> ${loggedInUser}</p>
      <p><strong>Tipo de Envío:</strong> ${getShippingTypeName(
        shippingType
      )}</p>
      <p><strong>Subtotal:</strong> $${
        document.getElementById("subtotal").textContent
      }</p>
      <p><strong>Costo de Envío:</strong> $${shippingCost.toFixed(2)}</p>
      <p><strong>Total:</strong> $${totalCost.toFixed(2)}</p>
      <h5>Productos:</h5>
      <ul>`;
  cartItems.forEach((item) => {
    invoiceHTML += `<li>${item.name} - Cantidad: ${item.quantity} - Precio: ${
      item.currency
    } ${item.cost} (${
      item.currency === "USD"
        ? `UYU ${(item.cost * exchangeRate).toFixed(2)}`
        : ""
    })</li>`;
  });
  invoiceHTML += `</ul>`;

  document.getElementById("invoice").innerHTML = invoiceHTML;
}

// Función para obtener el tipo de envío seleccionado y modificar los costos
function getShippingTypeName(shippingTypeValue) {
  switch (shippingTypeValue) {
    case "15":
      return "Premium (2-5 días)";
    case "7":
      return "Express (5-8 días)";
    case "5":
      return "Standard (12-15 días)";
    default:
      return "No seleccionado";
  }
}

// ¿¿Función para guardar la factura??
function saveInvoice() {
  const invoiceContent = document.getElementById("invoice").innerHTML;
  const blob = new Blob([invoiceContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "factura.html";
  a.click();
  URL.revokeObjectURL(url);
}

// Función para vaciar el carrito cuando se finaliza la compra
function clearCart() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  localStorage.removeItem(`${loggedInUser}_cartProducts`);
  loadCart();
  updateCartBadge();
}

// Función para cargar las localidades del departamento seleccionado usando una API
async function loadLocalities() {
  const department = document.getElementById("department").value;
  const localitySelect = document.getElementById("locality");
  localitySelect.innerHTML =
    '<option value="" disabled selected>Cargando localidades...</option>';
  localitySelect.disabled = true;

  try {
    const response = await fetch(
      `https://direcciones.ide.uy/api/v0/geocode/localidades?departamento=${encodeURIComponent(
        department
      )}`
    );
    if (!response.ok) {
      throw new Error("Error al obtener las localidades.");
    }
    const data = await response.json();

    // Limpiar la opción por def y habilitar el select de localidades una vez cargadas
    localitySelect.innerHTML =
      '<option value="" disabled selected>Seleccione localidad</option>';
    data.forEach((locality) => {
      localitySelect.innerHTML += `<option value="${locality.nombre}">${locality.nombre}</option>`;
    });
    localitySelect.disabled = false;
  } catch (error) {
    console.error("Error al cargar localidades:", error);
    localitySelect.innerHTML =
      '<option value="" disabled selected>Error al cargar localidades</option>';
  }
}

// Función para mostrar los campos específicos al método de pago seleccionado
function displayPaymentFields() {
  const paymentMethod = document.getElementById("payment-method").value;
  const paymentDetailsDiv = document.getElementById("payment-details");
  paymentDetailsDiv.innerHTML = ""; // Limpiar campos anteriores

  if (paymentMethod === "credit-card") {
    paymentDetailsDiv.innerHTML = `
          <div class="mb-3">
              <label for="card-number" class="form-label">Número de Tarjeta*</label>
              <input type="text" class="form-control" id="card-number" pattern="\\d{16}" required>
              <div class="invalid-feedback">
                  Por favor, ingrese un número de tarjeta válido de 16 dígitos.
              </div>
          </div>
          <div class="mb-3">
              <label for="card-expiration" class="form-label">Fecha de Expiración*</label>
              <input type="month" class="form-control" id="card-expiration" required>
              <div class="invalid-feedback">
                  Por favor, ingrese una fecha de expiración válida.
              </div>
          </div>
          <div class="mb-3">
              <label for="card-cvv" class="form-label">CVV*</label>
              <input type="text" class="form-control" id="card-cvv" pattern="\\d{3}" required>
              <div class="invalid-feedback">
                  Por favor, ingrese un CVV válido de 3 dígitos.
              </div>
          </div>
      `;
  } else if (paymentMethod === "bank-transfer") {
    paymentDetailsDiv.innerHTML = `
          <div class="mb-3">
              <label for="bank-account" class="form-label">Número de Cuenta Bancaria*</label>
              <input type="text" class="form-control" id="bank-account" required>
              <div class="invalid-feedback">
                  Por favor, ingrese el número de cuenta bancaria.
              </div>
          </div>
      `;
  }
}
