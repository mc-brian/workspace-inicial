document.addEventListener("DOMContentLoaded", function () {
    fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
        .then(response => response.json())
        .then(data => {
            let productListContainer = document.getElementById("product-list-container");
            productListContainer.innerHTML = "";
            
            data.products.forEach(product => {
                let productHTML = `
                    <div class="col-12 col-md-6 col-lg-4 mb-4">
                        <div class="card h-100">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text flex-grow-1">${product.description}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="text-muted">${product.currency} ${product.cost}</span>
                                    <small class="text-muted">Vendidos: ${product.soldCount}</small>
                                </div>
                            </div>
                        </div>
                    </div>`;
                productListContainer.innerHTML += productHTML;
            });
        })
        .catch(error => console.error("Error en fetch:", error));
});