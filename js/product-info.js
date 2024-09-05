document.addEventListener("DOMContentLoaded", function () {
    let productID = localStorage.getItem("productID");

    fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
        .then(response => response.json())
        .then(data => {
            showProductInfo(data);
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

function showErrorMessage() {
    let productInfoContainer = document.getElementById("product-info-container");
    productInfoContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Lo sentimos, no se pudo cargar la información del producto.
        </div>`;
}