const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let loggedInUser = localStorage.getItem('loggedInUser');

function sortCategories(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }

    return result;
}

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html";
}

function showCategoriesList() {
    let htmlContentToAppend = "";
    for (let i = 0; i < currentCategoriesArray.length; i++) {
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))) {

            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
    applyDarkMode(localStorage.getItem(`${loggedInUser}_darkMode`) === "true");
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
    currentSortCriteria = sortCriteria;

    if (categoriesArray != undefined) {
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    // Muestro las categorías ordenadas
    showCategoriesList();
}

// Función que se ejecuta una vez que se haya lanzado el evento de
// que el documento se encuentra cargado, es decir, se encuentran todos los
// elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    loadDarkModePreference();

    getJSONData(CATEGORIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCategoriesArray = resultObj.data;
            showCategoriesList();
            //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    // Event listener para el botón de cierre de sesión
    document.getElementById('logout-link').addEventListener('click', function () {
        localStorage.removeItem('loggedInUser');
        window.location = 'index.html'; // Redirigir a la página de inicio
    });

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        // Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        // de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        showCategoriesList();
    });

    updateCartBadge(); //Agrega el badge! 
});

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

    // Aplicar a todos los elementos de la lista de categorías
    document.querySelectorAll("#cat-list-container .list-group-item").forEach((item) => {
        item.classList.toggle("bg-dark", isDarkMode);
        item.classList.toggle("text-white", isDarkMode);
        item.classList.toggle("border-secondary", isDarkMode);
    });

    // Aplicar el modo oscuro a los botones y entradas de texto en la interfaz de categorías
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
  
