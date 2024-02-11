import * as Constants from './constants.js';
import { addToShoppingCart } from "./handlecart.js";
import { toggleCartVisibility, initializeCart, closeCartOnClickOutside } from "./togglecart.js";
import { loadFromStorage } from './storage/local.js';
import { InitializeProducts } from './filter.js';


if (Constants.productContainer) {
    InitializeProducts();
}


// Initialize the cart on page load
document.addEventListener('headerLoaded', async () => {
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


export function createProductCard(data, search = null, color = null, size = null, shoppingCartData) {
    console.log("Size: ", size);
    Constants.loaderContainer.style.display = "none";
    const cardBody = Constants.productContainer;
    if (Constants.onSale) {
        cardBody.innerHTML = `<div class="products__content__header">
                             <h2 id="product-header">On Sale</h2>
                             <a href="">See all</a>
                          </div>
                          `;
    }

    if (search || size || color && Constants.onSale) {
        cardBody.innerHTML = `<div class="products__content__header"></div>`;
        if (data.length === 0) {
            cardBody.innerHTML = `<div class="products__content__header"><h2>No results found</h2></div>`;
        }
    }

    if (search || size || color && !Constants.onSale) {
        cardBody.innerHTML = `<div class="products__content__header"><h2 id="product-header">Product results</h2></div>`;
        if (data.length === 0) {
            cardBody.innerHTML = `<div class="products__content__header"><h2>Could not find the product you searched for.</h2></div>`;
        }
    } else if (!search && !Constants.onSale) {
        cardBody.innerHTML = `<div class="products__content__header"><h2 id="product-header">Deals</h2> <a href="">See all</a></div>`;
    }

    const cartData = loadFromStorage(Constants.cartKey) || [];

    data.forEach(product => {
        const isProductAdded = cartData.some(cartItem => cartItem.id === product.id);
        const salePrice = parseFloat(product.prices.sale_price / 100).toFixed(2);
        const regularPrice = parseFloat(product.prices.regular_price / 100).toFixed(2);
        const productCurrency = product.prices.currency_prefix.charAt(0).toUpperCase() + product.prices.currency_prefix.slice(1);
        const productImage = product.images[0].thumbnail;
        const productId = product.id;
        const productName = product.name;

        const card = document.createElement('div');
        card.classList.add('products__item');

        // On Sale badge
        if (product.on_sale) {
            const saleBadge = document.createElement('span');
            saleBadge.classList.add('products__item-sale-badge');
            saleBadge.textContent = 'On Sale!';
            saleBadge.setAttribute('aria-label', 'On Sale');
            saleBadge.addEventListener('click', function () { window.location.href = `productdetail.html ? id = ${productId} ` });
            card.appendChild(saleBadge);
        }

        // Favorite icon container
        const favoriteContainer = document.createElement('div');
        favoriteContainer.classList.add('products__item-favoritecontainer');
        favoriteContainer.innerHTML = `
                                        <fieldset>
                                            <legend>Favorite Product</legend>
                                            <input type="checkbox" id="favIcon-checkbox${productId}" name="fav-checkbox">
                                            <label class="favorite" for="favIcon-checkbox${productId}">
                                                <img class="favorite-checked" src="svg/favIconChecked.svg" alt="Remove from favorite">
                                                <img class="favorite-unchecked" src="svg/favIcon.svg" alt="Add to favorite">
                                            </label>
                                        </fieldset>`;


        const cardLink = document.createElement('a');
        cardLink.href = `productdetail.html?id=${productId}`;
        cardLink.classList.add('products__item-link');

        const cardImage = document.createElement('figure');
        cardImage.classList.add('products__item-imageArea');
        cardImage.innerHTML = `<img src="${productImage}" alt="Product title ${productName}">`;

        const cardTitle = document.createElement('h2');
        cardTitle.innerHTML = product.name;

        const productPriceContainer = document.createElement('div');
        productPriceContainer.classList.add('products__item-price-container');

        const discountedCardPrice = document.createElement('span');
        discountedCardPrice.classList.add('products__item-discounted-price');
        discountedCardPrice.innerText = `Now Only ${productCurrency} ${salePrice}`;
        discountedCardPrice.setAttribute('aria-label', `Discounted price now only ${productCurrency} ${salePrice}`);

        const productGender = document.createElement('div');
        productGender.classList.add('products__item-gender');

        productGender.innerText = `Gender: ${product.attributes[0].terms[0].name}`;
        productGender.setAttribute('aria-label', `Product gender Men`);

        const originalCardPrice = document.createElement('span');
        originalCardPrice.classList.add('products__item-price');
        if (product.on_sale) {
            originalCardPrice.classList.add('on-sale');
        }
        originalCardPrice.innerText = `${productCurrency} ${regularPrice}`;
        originalCardPrice.setAttribute('aria-label', product.on_sale ? `Original price was ${productCurrency} ${regularPrice}` : `Price is ${productCurrency} ${salePrice}`);

        // Container for buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('products__item-actions');

        // Add to Cart button
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = isProductAdded ? 'In Cart' : 'Add to Cart';
        addToCartButton.classList.add('products__item-button', isProductAdded ? 'in-cart' : 'add-to-cart-btn');
        addToCartButton.disabled = isProductAdded;
        addToCartButton.setAttribute('data-id', productId);
        addToCartButton.addEventListener('click', () => {
            // If the product is not in the cart, add it
            const updatedCartArray = cartData.filter(item => item.id !== productId);
            // empty carData array and add the updatedCartArray to it
            cartData.length = 0;
            cartData.push(...updatedCartArray);
            const isProductAdded = cartData.some(cartItem => cartItem.id === productId);
            if (!isProductAdded) {
                addToShoppingCart(productId, data, Constants.collapsibleCartContainer);
            }
            // addToShoppingCart(product.id, data, Constants.collapsibleCartContainer);

        });

        // Buy Now button
        const buyNowButton = document.createElement('button');
        buyNowButton.textContent = 'Buy Now';
        buyNowButton.classList.add('products__item-button', 'buy-now-btn');
        buyNowButton.setAttribute('data-id', productId);
        buyNowButton.addEventListener('click', function () {
            // If the product is not in the cart, add it
            if (!isProductAdded) {
                addToShoppingCart(productId, shoppingCartData, Constants.collapsibleCartContainer);
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
        cardLink.append(productGender);
        cardLink.append(productPriceContainer);
        productPriceContainer.append(originalCardPrice);
        if (product.on_sale) {
            productPriceContainer.append(discountedCardPrice);
        }
        card.append(cardFooter);
        cardBody.appendChild(card);
    });
}