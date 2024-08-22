document.addEventListener("DOMContentLoaded", function () {
  fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
      .then(response => response.json())
      .then(data => {
          let productListContainer = document.getElementById("product-list-container");
          productListContainer.innerHTML = "";

          data.products.forEach(product => {
              let productHTML = `
                  <a href="#" class="list-group-item list-group-item-action">
                      <div class="row">
                          <div class="col-3">
                              <img src="${product.image}" alt="${product.name}" class="img-thumbnail">
                          </div>
                          <div class="col">
                              <div class="d-flex w-100 justify-content-between">
                                  <h4 class="mb-1">${product.name}</h4>
                                  <small class="text-muted" style="font-size: 1.5em;">${product.currency} ${product.cost}</small>
                              </div>
                              <p class="mb-1">${product.description}</p>
                              <p class="mb-1" style="font-size: 0.9em; color: #6c757d;"><strong>Cantidad vendidos:</strong> ${product.soldCount}</p>
                          </div>
                      </div>
                  </a>`;
              productListContainer.innerHTML += productHTML;
          });
      })
      .catch(error => console.error("Error en fetch:", error));
});