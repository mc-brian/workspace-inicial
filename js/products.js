document.addEventListener("DOMContentLoaded", function() {
    const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";
    const productList = document.getElementById("product-list");

    function createProductHTML(product) {
        return `
          <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
              <img src="${product.image}" class="card-img-top" alt="${product.name}">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <p class="card-text"><strong>Precio:</strong> $${product.cost}</p>
                <p class="card-text"><small class="text-muted">Vendidos: ${product.soldCount}</small></p>
              </div>
            </div>
          </div>
        `;
      }
      async function fetchAndDisplayProducts() {
        try {
          const response = await fetch(PRODUCTS_URL);
          const data = await response.json();
          const products = data.products;
    
          products.forEach(product => {
            productList.innerHTML += createProductHTML(product);
          });
        } catch (error) {
          console.error("Error al obtener los productos:", error);
        }
      }
      fetchAndDisplayProducts();
    });