document.addEventListener("DOMContentLoaded", function () {
    checkUserLogin();
    let productID = localStorage.getItem("productID");

    fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
    .then(response => response.json())
    .then(data => {
        product = data;
        showProductInfo(product);
        showRelatedProducts(product.relatedProducts);
        return fetch(`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`);
    })
    .then(response => response.json())
    .then(data => {
        comments = data;
        showComments(comments);
    })
    .catch(error => {
        console.error("Error en fetch:", error);
        showErrorMessage();
    });
});
function showProductInfo(product) {
    let productInfoContainer = document.getElementById("product-info-container");
    let productInfoHTML = `
        <div class="list-group-item">
            <div class="row">
                <div class="col-12 col-md-6">
                    <h3>${product.name}</h3>
                    <hr>
                    <p><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
                    <p><strong>Descripción:</strong> ${product.description}</p>
                    <p><strong>Categoría:</strong> ${product.category}</p>
                    <p><strong>Cantidad vendidos:</strong> ${product.soldCount}</p>
                </div>
                <div class="col-12 col-md-6">
                    <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            ${product.images.map((img, index) => `
                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <img src="${img}" class="d-block w-100" alt="${product.name}">
                                </div>
                            `).join('')}
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Anterior</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Siguiente</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    productInfoContainer.innerHTML = productInfoHTML;
}

function showRelatedProducts(relatedProducts) {
    let relatedProductsContainer = document.getElementById("related-products-container");
    let relatedProductsHTML = `
        <h4>Productos relacionados</h4>
        <div class="row">
            ${relatedProducts.map(product => `
                <div class="col-md-3">
                    <div class="card mb-3" onclick="setProductID(${product.id})">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    relatedProductsContainer.innerHTML = relatedProductsHTML;
}

function setProductID(id) {
    localStorage.setItem("productID", id);
    window.location.reload();
}

function showErrorMessage() {
    let productInfoContainer = document.getElementById("product-info-container");
    productInfoContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Lo sentimos, no se pudo cargar la información del producto.
        </div>`;
}