let productsArray = [];
let filteredArray = [];
let minPrice = undefined;
let maxPrice = undefined;

document.addEventListener("DOMContentLoaded", function () {
    let catID = localStorage.getItem("catID");

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
}

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
}

function setProductID(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html";
}