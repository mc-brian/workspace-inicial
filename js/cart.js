document.addEventListener("DOMContentLoaded", function () {
  loadDarkModePreference();
  loadCart();
  updateCartBadge();

  // Listener para cambios en el modo oscuro
  window.addEventListener("storage", function (e) {
    if (e.key === `${localStorage.getItem("loggedInUser")}_darkMode`) {
      loadDarkModePreference();
    }
  });
});

function loadDarkModePreference() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const isDarkMode =
    localStorage.getItem(`${loggedInUser}_darkMode`) === "true";
  applyDarkMode(isDarkMode);
}

function applyDarkMode(isDarkMode) {
  // Aplicar modo oscuro al body
  document.body.classList.toggle("bg-dark", isDarkMode);
  document.body.classList.toggle("text-white", isDarkMode);

  // Aplicar a las cards existentes
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("bg-dark", isDarkMode);
    card.classList.toggle("text-white", isDarkMode);
    card.classList.toggle("border-secondary", isDarkMode);
  });

  // Aplicar a los inputs
  document.querySelectorAll(".form-control").forEach((input) => {
    input.classList.toggle("bg-dark", isDarkMode);
    input.classList.toggle("text-white", isDarkMode);
    input.classList.toggle("border-secondary", isDarkMode);
  });

  // Aplicar al contenedor de resumen
  const summaryContainer = document.getElementById("summary-container");
  if (summaryContainer) {
    summaryContainer.classList.toggle("bg-dark", isDarkMode);
    summaryContainer.classList.toggle("text-white", isDarkMode);
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
                            <p class="card-text">Precio: ${item.currency} ${
      item.cost
    }</p>
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
                                       onchange="validateAndUpdateQuantity(this)"
                                       onkeypress="return event.charCode >= 48 && event.charCode <= 57">
                            </div>
                            <p class="card-text mt-2">
                                Subtotal: ${
                                  item.currency
                                } <span class="item-subtotal">
                                    ${calculateItemSubtotal(item)}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });

  cartContainer.innerHTML = cartHTML;
  updateTotalSubtotal();
  loadRelatedProducts(cartItems);
}

function validateAndUpdateQuantity(input) {
  // Asegurar que el valor sea un entero mayor o igual a 1
  let value = parseInt(input.value);
  if (isNaN(value) || value < 1) {
    value = 1;
  }
  input.value = value;
  updateQuantity(input.dataset.index, value);
}

function showRelatedProducts(products) {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const isDarkMode =
    localStorage.getItem(`${loggedInUser}_darkMode`) === "true";

  const container = document.createElement("div");
  container.className = "container mt-4 mb-4";
  container.innerHTML = `
        <h3 class="${
          isDarkMode ? "text-white" : ""
        }">Productos Relacionados</h3>
        <div class="row">
            ${products
              .map(
                (product) => `
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="card h-100 ${
                      isDarkMode ? "bg-dark text-white border-secondary" : ""
                    }">
                        <div class="d-flex align-items-center justify-content-center" style="height: 200px;">
                            <img src="${product.image}" 
                                 class="card-img-top" 
                                 alt="${product.name}"
                                 style="max-height: 100%; width: auto; object-fit: contain;">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.currency} ${
                  product.cost
                }</p>
                            <button class="btn btn-primary btn-sm" 
                                    onclick="addRelatedToCart(${JSON.stringify(
                                      product
                                    ).replace(/"/g, "&quot;")})">
                                Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;

  document.querySelector("main").appendChild(container);
}

function calculateItemSubtotal(item) {
  return (item.cost * (item.quantity || 1)).toFixed(2);
}

function updateQuantity(index, newQuantity) {
  const cartItems = JSON.parse(localStorage.getItem("cartProducts"));
  cartItems[index].quantity = parseInt(newQuantity);
  localStorage.setItem("cartProducts", JSON.stringify(cartItems));

  const itemSubtotalElement =
    document.querySelectorAll(".item-subtotal")[index];
  itemSubtotalElement.textContent = calculateItemSubtotal(cartItems[index]);

  updateTotalSubtotal();
}

function updateTotalSubtotal() {
  const cartItems = JSON.parse(localStorage.getItem("cartProducts")) || [];
  const total = cartItems.reduce((sum, item) => {
    return sum + item.cost * (item.quantity || 1);
  }, 0);

  document.getElementById("subtotal").textContent = total.toFixed(2);
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

function loadRelatedProducts(currentItems) {
  // Obtener la categoría del primer item para buscar relacionados
  if (currentItems.length === 0) return;

  const firstItem = currentItems[0];
  fetch(
    `https://japceibal.github.io/emercado-api/cats_products/${firstItem.catId}.json`
  )
    .then((response) => response.json())
    .then((data) => {
      const relatedProducts = data.products
        .filter((p) => !currentItems.some((item) => item.id === p.id))
        .slice(0, 4); // Mostrar solo 4 productos relacionados

      showRelatedProducts(relatedProducts);
    })
    .catch((error) => console.error("Error loading related products:", error));
}

function showRelatedProducts(products) {
  const container = document.createElement("div");
  container.className = "container mt-4 mb-4";
  container.innerHTML = `
        <h3>Productos Relacionados</h3>
        <div class="row">
            ${products
              .map(
                (product) => `
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${
                  product.name
                }">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.currency} ${
                  product.cost
                }</p>
                            <button class="btn btn-primary btn-sm" 
                                    onclick="addRelatedToCart(${JSON.stringify(
                                      product
                                    ).replace(/"/g, "&quot;")})">
                                Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;

  document.querySelector("main").appendChild(container);
}

function addRelatedToCart(product) {
  const cartItems = JSON.parse(localStorage.getItem("cartProducts")) || [];
  const existingProduct = cartItems.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cartProducts", JSON.stringify(cartItems));
  loadCart();
  updateCartBadge();
}
