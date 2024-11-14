let productsArray = [];
let filteredArray = [];
let minPrice = undefined;
let maxPrice = undefined;
let loggedInUser = localStorage.getItem('loggedInUser');

document.addEventListener("DOMContentLoaded", function () {
    let catID = localStorage.getItem("catID");
    
    // Asegura que arranque en Falso si no existe
    if (localStorage.getItem(`${loggedInUser}_darkMode`) === null) {
        localStorage.setItem(`${loggedInUser}_darkMode`, 'false');
    } 
    
    loadDarkModePreference(); // Carga la preferencia de modo oscuro
    updateCartBadge(); //Agrega el badge! 

    // Manejo del cierre de sesión
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }

    // Verificar si el usuario ha iniciado sesión
    if (!loggedInUser) {
        location.href = "login.html";
    }

    fetch(`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`)
        .then(response => response.json())
        .then(data => {
            if (data.products && data.products.length > 0) {
                productsArray = data.products;
                filteredArray = [...productsArray];
                showProductsList();
                setupEventListeners();
            } else {
                showNoProductsMessage();
            }
        })
        .catch(error => {
            console.error("Error en fetch:", error);
            showNoProductsMessage();
        });
});

function showProductsList() {
    let productListContainer = document.getElementById("product-list-container");
    productListContainer.innerHTML = "";

    filteredArray.forEach(product => {
        if (
            (minPrice === undefined || product.cost >= minPrice) &&
            (maxPrice === undefined || product.cost <= maxPrice)
        ) {
            let productHTML = `
                <div class="col-12 col-md-6 col-lg-12 mb-4">
                    <div onclick="setProductID(${product.id})" class="list-group-item list-group-item-action cursor-active">
                        <div class="row">
                            <div class="col-12 col-lg-3">
                                <img src="${product.image}" alt="${product.name}" class="img-thumbnail">
                            </div>
                            <div class="col-12 col-lg-9">
                                <div class="d-flex w-100 justify-content-between">
                                    <h4 class="mb-1">${product.name}</h4>
                                    <small class="text-muted">${product.currency} ${product.cost}</small>
                                </div>
                                <p class="mb-1">${product.description}</p>
                                <p class="mb-1"><small>Cantidad vendidos: ${product.soldCount}</small></p>
                            </div>
                        </div>
                    </div>
                </div>`;
            productListContainer.innerHTML += productHTML;
        }
    });
    applyDarkMode(localStorage.getItem(`${loggedInUser}_darkMode`) === "true");
}

function updateCartBadge() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const cartItems = JSON.parse(localStorage.getItem(`${loggedInUser}_cartProducts`)) || [];
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

function showNoProductsMessage() {
    let productListContainer = document.getElementById("product-list-container");
    productListContainer.innerHTML = `
        <div class="alert alert-info" role="alert">
            No hay productos disponibles en esta categoría.
        </div>`;
}

function setupEventListeners() {
    document.getElementById("rangeFilterPrice").addEventListener("click", function() {
        minPrice = document.getElementById("rangeFilterPriceMin").value;
        maxPrice = document.getElementById("rangeFilterPriceMax").value;

        minPrice = minPrice !== "" ? parseInt(minPrice) : undefined;
        maxPrice = maxPrice !== "" ? parseInt(maxPrice) : undefined;

        showProductsList();
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function() {
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";
        minPrice = undefined;
        maxPrice = undefined;
        showProductsList();
    });

    document.getElementById("sortAscPrice").addEventListener("click", function() {
        filteredArray.sort((a, b) => a.cost - b.cost);
        showProductsList();
    });

    document.getElementById("sortDescPrice").addEventListener("click", function() {
        filteredArray.sort((a, b) => b.cost - a.cost);
        showProductsList();
    });

    document.getElementById("sortByRelevance").addEventListener("click", function() {
        filteredArray.sort((a, b) => b.soldCount - a.soldCount);
        showProductsList();
    });

    document.getElementById("searchInput").addEventListener("input", function() {
        let searchText = this.value.toLowerCase();
        filteredArray = productsArray.filter(product => 
            product.name.toLowerCase().includes(searchText) || 
            product.description.toLowerCase().includes(searchText)
        );
        showProductsList();
    });
}

function setProductID(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html";
}

function loadDarkModePreference() {
    const isDarkMode =
    localStorage.getItem(`${loggedInUser}_darkMode`) === "true";
  if (isDarkMode !== null) {
    applyDarkMode(isDarkMode);
  } else {
    applyDarkMode(false);
  }
}

function applyDarkMode(isDarkMode) {
    document.body.classList.toggle("bg-dark", isDarkMode);
    document.body.classList.toggle("text-white", isDarkMode);

    document.querySelectorAll(".list-group-item").forEach((item) => {
        item.classList.toggle("bg-dark", isDarkMode);
        item.classList.toggle("text-white", isDarkMode);
        item.classList.toggle("border-secondary", isDarkMode);
    });
    const filterContainer = document.getElementById("filter-container");
    if (filterContainer) {
        filterContainer.classList.toggle("bg-dark", isDarkMode);
        filterContainer.classList.toggle("text-white", isDarkMode);
    }
    document.querySelectorAll(".btn").forEach((btn) => {
        btn.classList.toggle("btn-dark", isDarkMode);
        btn.classList.toggle("border-secondary", isDarkMode);
    });
    document.querySelectorAll('input[type="number"]').forEach((input) => {
        input.classList.toggle("bg-dark", isDarkMode);
        input.classList.toggle("text-white", isDarkMode);
        input.classList.toggle("border-secondary", isDarkMode);
    });
}

// Manejo del cierre de sesión
function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('loggedInUser'); // Eliminar la sesión del usuario
    window.location.href = 'login.html';    // Redirigir a la página de inicio de sesión
}