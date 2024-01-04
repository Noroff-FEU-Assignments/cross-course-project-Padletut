import * as Constants from './constants.js';
import { fetchProducts } from "./fetch.js";
import { renderShoppingCart } from "./renderCart.js";
import { addToShoppingCart } from "./handlecart.js";
import { fetchProductsForCarousel } from "./fetch.js";
import { loadFromStorage } from "./storage/local.js";
import { toggleCartVisibility, initializeCart, closeCartOnClickOutside } from './togglecart.js';

// Initialize the cart on page load
document.addEventListener('DOMContentLoaded', async () => {
    const cartIcon = document.querySelector('.cart');
    const collapsibleCart = document.getElementById('collapsible-cart');
    const loaderContainer = document.getElementById('loader');

    // Initialize the cart with products
    await initializeCart(collapsibleCart, loaderContainer);

    // Toggle cart visibility when the cart icon is clicked
    cartIcon.addEventListener('click', () => toggleCartVisibility(collapsibleCart));

    // Close cart when clicking outside
    closeCartOnClickOutside(collapsibleCart);

});

document.addEventListener('click', (event) => {
    if (event.target.matches('.cart-close-button')) {
        // Close the cart
        Constants.collapsibleCartContainer.style.right = '-100%';
        event.preventDefault();
    }
});

if (Constants.productContainer) {
    fetchProducts(Constants.productContainer, Constants.loaderContainer, createProductCard);
}

// Fetch products and render the shopping cart
fetchProducts(Constants.collapsibleCartContainer, Constants.loaderContainer, renderShoppingCart);


if (Constants.carouselContainer) {
    fetchProductsForCarousel(Constants.carouselContainer, Constants.loaderContainer);
}

function createProductCard(data) {
    Constants.loaderContainer.style.display = "none";
    const cardBody = Constants.productContainer;
    const cartData = loadFromStorage(Constants.cartKey) || [];

    data.forEach(product => {
        const isProductAdded = cartData.some(cartItem => cartItem.id === product.id);

        const card = document.createElement('div');
        card.classList.add('products__item');

        // Favorite icon container
        const favoriteContainer = document.createElement('div');
        favoriteContainer.classList.add('products__item-favoritecontainer');
        favoriteContainer.innerHTML = `
            <input type="checkbox" id="favIcon-checkbox${product.id}" name="fav-checkbox">
            <label class="favorite" for="favIcon-checkbox${product.id}">
                <img class="favorite-checked" src="svg/favIconChecked.svg" alt="Remove from favorite">
                <img class="favorite-unchecked" src="svg/favIcon.svg" alt="Add to favorite">
            </label>`;

        const cardLink = document.createElement('a');
        cardLink.href = `productdetail.html?id=${product.id}`;
        cardLink.classList.add('products__item-link');

        const cardImage = document.createElement('figure');
        cardImage.classList.add('products__item-imageArea');
        cardImage.innerHTML = `<img src="${product.image}" alt="${product.title}">`;

        const cardTitle = document.createElement('h2');
        cardTitle.innerText = product.title;

        const cardPrice = document.createElement('span');
        cardPrice.innerText = "$" + product.price;

        // Container for buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('products__item-actions');

        // Add to Cart button
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = isProductAdded ? 'In Cart' : 'Add to Cart';
        addToCartButton.classList.add('products__item-button', isProductAdded ? 'in-cart' : 'add-to-cart-btn');
        addToCartButton.disabled = isProductAdded;
        addToCartButton.setAttribute('data-id', product.id);
        addToCartButton.addEventListener('click', () => {
            addToShoppingCart(product.id, data, Constants.collapsibleCartContainer);
        });

        // Buy Now button
        const buyNowButton = document.createElement('button');
        buyNowButton.textContent = 'Buy Now';
        buyNowButton.classList.add('products__item-button', 'buy-now-btn');
        buyNowButton.addEventListener('click', function () {
            // If the product is not in the cart, add it
            if (!isProductAdded) {
                addToShoppingCart(product.id, data, Constants.collapsibleCartContainer);
            }
            window.location.href = 'checkout.html';
        });

        const cardFooter = document.createElement('div');
        cardFooter.classList.add('products__item-footer');

        cardFooter.appendChild(addToCartButton);
        cardFooter.appendChild(buyNowButton);

        card.append(favoriteContainer);
        card.append(cardLink);
        cardLink.append(cardImage);
        cardLink.append(cardTitle);
        cardLink.append(cardPrice);
        card.append(cardFooter);

        cardBody.appendChild(card);
    });
}