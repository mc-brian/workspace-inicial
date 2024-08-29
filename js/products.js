document.addEventListener("DOMContentLoaded", function () {
    fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
        .then(response => response.json())
        .then(data => {
            let productListContainer = document.getElementById("product-list-container");
            productListContainer.innerHTML = "";
            
            data.products.forEach(product => {
                let productHTML = `
                    <div class="col-12 col-md-6 col-lg-12 mb-4">
                        <div class="list-group-item list-group-item-action">
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
            });
        })
        .catch(error => console.error("Error en fetch:", error));
});