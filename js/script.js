import { cartKey } from "./constants.js";
import { fetchProducts } from "./fetch.js";
import { addToShoppingCart, renderShoppingCart, removeFromCart } from "./cart.js";
import { fetchProductsForCarousel } from "./fetch.js";
import { loadFromStorage } from "./storage/local.js";


const productContainer = document.querySelector(".products__content");
const loaderContainer = document.querySelector(".loader");
const shoppingCartContainer = document.querySelector(".right-bar");
const carouselContainer = document.querySelector(".carousel");


fetchProducts(productContainer, loaderContainer, createProductCard)
    .then(data => {
        renderShoppingCart(data, shoppingCartContainer);
        shoppingCartContainer.addEventListener("click", (event) => {
            removeFromCart(event, cartKey, data, shoppingCartContainer);
        });
    })
    .catch(error => {
        console.error(error);
    });

if (carouselContainer) {
    fetchProductsForCarousel(productContainer, loaderContainer, createProductCard);
}

function createProductCard(data) {
    loaderContainer.style.display = "none";
    const cardBody = productContainer;
    const cartData = loadFromStorage(cartKey) || [];

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
            addToShoppingCart(product.id, data, shoppingCartContainer);
        });

        // Buy Now button
        const buyNowButton = document.createElement('button');
        buyNowButton.textContent = 'Buy Now';
        buyNowButton.classList.add('products__item-button', 'buy-now-btn');
        buyNowButton.addEventListener('click', function () {
            // If the product is not in the cart, add it
            if (!isProductAdded) {
                addToShoppingCart(product.id, data, shoppingCartContainer);
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