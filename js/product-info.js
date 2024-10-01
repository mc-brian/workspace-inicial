// Declaramos variables globales para usar en varias funciones, cosa que antes no habíamos hecho
let product;
let comments = [];
let loggedInUser = localStorage.getItem('loggedInUser');

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

    // Agregamos un event listener para el formulario de comentarios.
    document.getElementById('comment-form').addEventListener('submit', handleCommentSubmission);
});

function checkUserLogin() {
    
    const userInfo = document.getElementById('user-info');
    const commentForm = document.getElementById('comment-form');

    if (loggedInUser && loggedInUser !== "") {
        userInfo.textContent = loggedInUser;
        userInfo.style.display = 'inline-block';
        commentForm.style.display = 'block';
    } else {
        userInfo.style.display = 'none';
        commentForm.style.display = 'none';
        showLoginMessage();
        
        // Redirigir a la página de inicio de sesión
        location.href = "login.html";
    }
}

function showLoginMessage() {
    const commentSection = document.getElementById('comment-section');
    const loginMessage = document.createElement('div');
    loginMessage.className = 'alert alert-info';
    loginMessage.textContent = 'Debes iniciar sesión para dejar un comentario.';
    commentSection.appendChild(loginMessage);
}

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

function showComments(comments) {
    let commentsContainer = document.getElementById("comments-container");
    let commentsHTML = `
        <h4>Comentarios</h4>
        ${comments.map(comment => `
            <div class="comment">
                <p><strong>${comment.user}</strong> - ${formatDate(new Date(comment.dateTime))}</p>
                <p>${"★".repeat(comment.score)}${"☆".repeat(5 - comment.score)}</p>
                <p>${comment.description}</p>
            </div>
        `).join('')}
    `;
    commentsContainer.innerHTML = commentsHTML;
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

function handleCommentSubmission(event) {
    event.preventDefault();
    if (!loggedInUser) {
        alert('Debes iniciar sesión para dejar un comentario.');
        window.location.href = 'login.html';
        return;
    }
    let commentText = document.getElementById('comment-text').value;
    let rating = document.getElementById('rating').value;
    let newComment = {
        product: parseInt(localStorage.getItem("productID")),
        score: parseInt(rating),
        description: commentText,
        user: loggedInUser,
        dateTime: formatDate(new Date())
    };
    comments.push(newComment);
    showComments(comments);
    event.target.reset();
}

function formatDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function showErrorMessage() {
    let productInfoContainer = document.getElementById("product-info-container");
    productInfoContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Lo sentimos, no se pudo cargar la información del producto.
        </div>`;
}