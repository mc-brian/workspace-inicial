# eMercado - Plataforma de eCommerce

**eMercado** es una plataforma de comercio electrónico completa desarrollada como proyecto final del curso de desarrollo web de **Jóvenes a Programar**. Este sitio permite a los usuarios navegar, buscar y filtrar productos en diferentes categorías, visualizar información detallada de productos, gestionar un carrito de compras, y personalizar su perfil de usuario. El proyecto se realiza en varias entregas, integrando progresivamente nuevas funcionalidades y refinamientos.

## Descripción del Proyecto

Este sitio simula un entorno de compra online, ofreciendo a los usuarios una experiencia fluida y moderna de navegación de productos, desde el inicio de sesión hasta el manejo del carrito y la confirmación de compra. Este proyecto integra diversas tecnologías y buenas prácticas en desarrollo web, y destaca el aprendizaje de habilidades como la manipulación del DOM, el consumo de APIs, y la persistencia de datos en `localStorage`.

El sitio es accesible vía **[GitHub Pages](URL_DEL_REPOSITORIO_GITHUB_PAGES)**, y se ha desarrollado un diseño completamente **responsivo** utilizando Bootstrap para optimizar la experiencia en diferentes dispositivos.

## Funcionalidades

### Sistema de Navegación y Autenticación
- **Inicio de sesión** con almacenamiento en `localStorage` para mantener la sesión.
- **Sistema de navegación dinámica** que adapta el contenido del menú según el estado de autenticación del usuario.
- **Función de cierre de sesión** que permite al usuario desconectarse, eliminando los datos de sesión de `localStorage`.

### Catálogo de Productos
- **Página de categorías**: despliega las categorías disponibles con imágenes y descripciones, cargando los datos desde una API externa.
- **Filtrado y ordenamiento de productos**: permite a los usuarios ordenar los productos por precio y relevancia, así como aplicar filtros por rango de precios.
- **Página de detalles del producto**: muestra información completa de un producto, incluyendo imágenes, descripción, precio, cantidad de ventas, y una sección de comentarios.

### Carrito de Compras
- **Gestión de productos en el carrito**: permite agregar, editar la cantidad, y eliminar productos.
- **Cálculo de subtotales y tipo de cambio**: incluye conversión de precios de dólares a pesos uruguayos con datos obtenidos desde una API de tipo de cambio en tiempo real.
- **Resumen de compra**: muestra un desglose del total en pesos uruguayos.

### Perfil de Usuario
- **Página de perfil**: los usuarios pueden ver y editar su información personal (nombre, apellido, email, etc.) y subir una imagen de perfil.
- **Preferencias de usuario**: permite activar el modo oscuro y guarda las preferencias de visualización de cada usuario en `localStorage`.

### Interfaz Amigable y Accesible
- **Diseño responsivo** desarrollado con **Bootstrap** para una experiencia optimizada en dispositivos móviles y de escritorio.
- **Modo oscuro** para una experiencia de usuario personalizada, ajustando colores y estilos de acuerdo con las preferencias del usuario.

## Tecnologías Utilizadas

- **HTML5** y **CSS3**: estructura y estilos básicos del sitio.
- **Bootstrap 5**: biblioteca de diseño responsivo y componentes de interfaz de usuario.
- **JavaScript** (con ES6+): lógica de front-end, manipulación del DOM, y consumo de APIs.
- **APIs REST**: incluye datos de productos, categorías, y tipo de cambio de moneda.
- **localStorage**: persistencia de datos del usuario, incluyendo información del perfil, preferencias y contenido del carrito.

## Cómo Ejecutar el Proyecto

1. Clonar este repositorio.
2. Abrir el archivo `index.html` en un navegador web.
3. Acceder con un nombre de usuario para explorar la funcionalidad completa del sitio.
4. Las compras, preferencias y otros datos de usuario se almacenan en `localStorage`.

## Arquitectura del Código

El proyecto está dividido en varios módulos, cada uno responsable de una funcionalidad específica:
- **index.js**: manejo de la navegación, autenticación de usuarios, y funciones generales del sitio.
- **products.js**: carga y visualización de productos con filtros, ordenamiento, y manejo de modo oscuro.
- **product-info.js**: despliega los detalles de productos, comentarios, y productos relacionados.
- **cart.js**: gestión del carrito de compras, incluyendo cálculos de subtotales y tipo de cambio.
- **my-profile.js**: gestiona la información y las preferencias del usuario.
- **categories.js**: muestra las categorías y permite el filtrado dinámico de productos.

## Colaboración y Créditos

Este repositorio es administrado por **[Maria Camila Brian](https://github.com/mc-brian)**, pero es fruto del trabajo de un equipo de desarrollo colaborativo, junto a **[Fernanda Costa](https://github.com/Fernanda3172005)**, **[Yamila Escandon](https://github.com/Yamila-e)** y **[Eliane Mendez](https://github.com/ElianeMendez)**. El proyecto fue desarrollado como parte del programa **[Jóvenes a Programar](https://jovenesaprogramar.edu.uy/)**.
