// Declaramos variables globales para usar en varias funciones
let product;
let comments = [];
let loggedInUser = localStorage.getItem('loggedInUser');

document.addEventListener("DOMContentLoaded", function () {
    checkUserLogin(); // Verifica el inicio de sesión del usuario
    if (localStorage.getItem(`${loggedInUser}_darkMode`) === null) {
        localStorage.setItem(`${loggedInUser}_darkMode`, 'false');
    } // Aseguramos que la preferencia de modo oscuro esté en Falso por defecto
    loadDarkModePreference(); // Carga la preferencia de modo oscuro por usuario
    let productID = localStorage.getItem("productID");

    fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
        .then(response => response.json())
        .then(data => {
            product = data;
            showProductInfo(product); // Muestra la información del producto
            showRelatedProducts(product.relatedProducts); // Muestra los productos relacionados
            return fetch(`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`);
        })
        .then(response => response.json())
        .then(data => {
            const savedComments = JSON.parse(localStorage.getItem(`comments_${productID}`)) || [];
            comments = [...data, ...savedComments]; // Combina los comentarios obtenidos y los guardados
            showComments(comments); // Muestra los comentarios
        })
        .catch(error => {
            console.error("Error en fetch:", error);
            showErrorMessage(); // Muestra un mensaje de error
        });

    window.addEventListener('storage', function(e) {
        if (e.key === `${loggedInUser}_darkMode`) {
            loadDarkModePreference(); // Carga de nuevo la preferencia de modo oscuro
        }
    });

    document.getElementById('comment-form').addEventListener('submit', handleCommentSubmission);

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function() {
            localStorage.removeItem('userSession');
            localStorage.removeItem('loggedInUser'); // Elimina el usuario logueado
            window.location.href = 'login.html';
        });
    }
});

function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem(`${loggedInUser}_darkMode`) === 'true';
    if (isDarkMode !== null) {
        applyDarkMode(isDarkMode);
    } else {
        applyDarkMode(false);
    }
}

function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
        document.body.classList.add('bg-dark', 'text-white');
        
        // Aplicar estilos oscuros a los formularios, campos y otros elementos
        document.querySelectorAll('.form-control, .form-select').forEach(element => {
            element.classList.add('bg-dark', 'text-light', 'border-secondary');
        });
        
        // Aplicar estilos oscuros a la información del producto
        document.querySelectorAll('.list-group-item, .comment, .card').forEach(element => {
            element.classList.add('bg-dark', 'text-light');
        });

    } else {
        document.body.classList.remove('bg-dark', 'text-white');
        
        // Revertir los estilos cuando se desactiva el modo oscuro
        document.querySelectorAll('.form-control, .form-select').forEach(element => {
            element.classList.remove('bg-dark', 'text-light', 'border-secondary');
        });
        
        // Revertir los estilos en la información del producto
        document.querySelectorAll('.list-group-item, .comment, .card').forEach(element => {
            element.classList.remove('bg-dark', 'text-light');
        });
    }
}

function checkUserLogin() {
    const userInfo = document.getElementById('user-info');
    const commentForm = document.getElementById('comment-form');

    if (loggedInUser && loggedInUser !== "") {
        userInfo.textContent = loggedInUser; // Muestra el nombre del usuario
        userInfo.style.display = 'inline-block';
        commentForm.style.display = 'block'; // Muestra el formulario de comentarios
    } else {
        userInfo.style.display = 'none';
        commentForm.style.display = 'none';
        showLoginMessage(); // Muestra el mensaje de inicio de sesión

        location.href = "login.html"; // Redirige a login si no hay sesión activa
    }
}

function showLoginMessage() {
    const commentSection = document.getElementById('comment-section');
    const loginMessage = document.createElement('div');
    loginMessage.className = 'alert alert-info';
    loginMessage.textContent = 'Debes iniciar sesión para dejar un comentario.';
    commentSection.appendChild(loginMessage); // Agrega mensaje al DOM
}

function showProductInfo(product) {
    const isDarkMode = localStorage.getItem(`${loggedInUser}_darkMode`) === 'true'; // Asegurarnos que sea por usuario
    let productInfoContainer = document.getElementById("product-info-container");
    let productInfoHTML = `
        <div class="list-group-item ${isDarkMode ? 'bg-dark text-light' : 'bg-white text-dark'}">
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
                            ${product.images.map((img, index) => 
                                `<div class="carousel-item ${index === 0 ? 'active' : ''}">
                                    <img src="${img}" class="d-block w-100" alt="${product.name}">
                                </div>`
                            ).join('')}
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
    const isDarkMode = localStorage.getItem(`${loggedInUser}_darkMode`) === 'true';
    let commentsContainer = document.getElementById("comments-container");
    let commentsHTML = `
        <h4>Comentarios</h4>
        ${comments.map(comment => 
            `<div class="comment ${isDarkMode ? 'bg-dark text-light' : 'bg-white text-dark'}">
                <p><strong>${comment.user}</strong> - ${formatDate(new Date(comment.dateTime))}</p>
                <p>${"★".repeat(comment.score)}${"☆".repeat(5 - comment.score)}</p>
                <p>${comment.description}</p>
            </div>`
        ).join('')}
    `;
    commentsContainer.innerHTML = commentsHTML;
}

function showRelatedProducts(relatedProducts) {
    const isDarkMode = localStorage.getItem(`${loggedInUser}_darkMode`) === 'true';
    let relatedProductsContainer = document.getElementById("related-products-container");
    let relatedProductsHTML = `
        <h4>Productos relacionados</h4>
        <div class="row">
            ${relatedProducts.map(product => `
                <div class="col-md-3 col-sm-6 col-12">
                    <div class="card mb-3 ${isDarkMode ? 'bg-dark text-light' : 'bg-white text-dark'}" onclick="setProductID(${product.id})">
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
        dateTime: new Date().toISOString()
    };
    comments.push(newComment);

    // Guardamos los comentarios en localStorage
    const productID = localStorage.getItem("productID");
    const savedComments = JSON.parse(localStorage.getItem(`comments_${productID}`)) || [];
    savedComments.push(newComment);
    localStorage.setItem(`comments_${productID}`, JSON.stringify(savedComments));

    showComments(comments);
    event.target.reset();
}

// Función simplificada para formatear la fecha
function formatDate(date) {
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function showErrorMessage() {
    let productInfoContainer = document.getElementById("product-info-container");
    productInfoContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Lo sentimos, no se pudo cargar la información del producto.
        </div>`;
}