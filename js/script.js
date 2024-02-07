import * as Constants from './constants.js';
import { fetchProducts } from "./fetch.js";
import { addToShoppingCart } from "./handlecart.js";
import { fetchProductsForCarousel } from "./fetch.js";
import { loadFromStorage } from "./storage/local.js";
import { toggleCartVisibility, initializeCart, closeCartOnClickOutside } from "./togglecart.js";

// Global variables
let colorValue = null;
let sizeValue = null;


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

document.addEventListener('click', (event) => {
    if (event.target.matches('.cart-close-button')) {
        // Close the cart
        Constants.collapsibleCartContainer.style.right = '-100%';
        event.preventDefault();
    }
});

if (Constants.productContainer) {

    // Event listener for search input field and button
    document.addEventListener('headerLoaded', () => {
        const searchInput = document.querySelector("#search-products");
        const searchButton = document.querySelector("#search-products-button");
        searchInput.addEventListener("input", () => handleSearch(searchInput.value.trim().toLowerCase()));
        searchButton.addEventListener("click", (event) => { event.preventDefault(); handleSearch(searchInput.value.trim().toLowerCase()); });

        // Size filter
        if (Constants.sizeFilter) {
            Constants.sizeFilter.forEach(size => {
                size.addEventListener("click", () => handleSizeFilter(size));
            });
        }

        function handleSizeFilter(size) {
            if (size.checked) {
                setTimeout(() => {
                    sizeValue = size.id;
                    fetchProducts(Constants.productContainer, Constants.loaderContainer, createProductCard, Constants.genderFilter, Constants.onSale, null, colorValue, sizeValue);
                }, 500);
            } else {
                setTimeout(() => {
                    sizeValue = null;
                    fetchProducts(Constants.productContainer, Constants.loaderContainer, createProductCard, Constants.genderFilter, Constants.onSale, null, colorValue, null);
                }, 500);
            }
        }

        // Color filter event listener
        if (Constants.colorFilter) {
            Constants.colorFilter.forEach(color => {
                color.addEventListener("click", () => handleColorFilter(color));
            });
        }

        // Color filter function
        function handleColorFilter(color) {

            if (color.checked && color.value !== "all") {
                setTimeout(() => {
                    colorValue = color.value;
                    colorValue = colorValue.charAt(0).toUpperCase() + colorValue.slice(1);
                    fetchProducts(Constants.productContainer, Constants.loaderContainer, createProductCard, Constants.genderFilter, Constants.onSale, null, colorValue, sizeValue);
                }, 500);
            } else if (color.value === "all") {
                setTimeout(() => {
                    fetchProducts(Constants.productContainer, Constants.loaderContainer, createProductCard, Constants.genderFilter, Constants.onSale, null, null, sizeValue);
                    colorValue = null;
                }, 500);
            }
        }

        // Search products function
        function handleSearch(searchValue) {
            if (searchValue) {
                setTimeout(() => {
                    fetchProducts(Constants.productContainer, Constants.loaderContainer, createProductCard, Constants.genderFilter, Constants.onSale, searchValue, colorValue, sizeValue);
                    if (Constants.carouselContainer) Constants.carouselContainer.style.display = "none";
                    if (Constants.mainContainerHeader) Constants.mainContainerHeader.innerHTML = `<h2 id="product-header">Product search results</h2>`;
                }, 500);
            } else {
                setTimeout(() => {
                    fetchProducts(Constants.productContainer, Constants.loaderContainer, createProductCard, Constants.genderFilter, Constants.onSale, null, colorValue, sizeValue);
                    if (Constants.carouselContainer) Constants.carouselContainer.style.display = "flex";
                    if (Constants.mainContainerHeader) Constants.mainContainerHeader.innerHTML = `<h2 id="product-header">Just for you</h2> <a href="">See all</a>`;
                }, 500);
            }
        }
        InitializeProducts();
    });
}

function InitializeProducts() {
    fetchProducts(Constants.productContainer, Constants.loaderContainer, createProductCard, Constants.genderFilter, Constants.onSale, null, colorValue, sizeValue);
}

if (Constants.carouselContainer) {
    fetchProductsForCarousel(Constants.carouselContainer, Constants.loaderContainer, Constants.genderFilter);
}

function createProductCard(data, search = null) {
    Constants.loaderContainer.style.display = "none";
    const cardBody = Constants.productContainer;
    if (Constants.onSale) {
        cardBody.innerHTML = `<div class="products__content__header">
                             <h2 id="product-header">On Sale</h2>
                             <a href="">See all</a>
                          </div>
                          `;
    }

    if (search && Constants.onSale) {
        cardBody.innerHTML = `<div class="products__content__header"></div>`;
        if (data.length === 0) {
            cardBody.innerHTML = `<div class="products__content__header"><h2>No results found</h2></div>`;
        }
    }

    if (search && !Constants.onSale) {
        cardBody.innerHTML = `<div class="products__content__header"><h2 id="product-header">Product search results</h2></div>`;
        if (data.length === 0) {
            cardBody.innerHTML = `<div class="products__content__header"><h2>Could not find the product you searched for.</h2></div>`;
        }
    } else if (!search && !Constants.onSale) {
        cardBody.innerHTML = `<div class="products__content__header"><h2 id="product-header">Deals</h2> <a href="">See all</a></div>`;
    }

    const cartData = loadFromStorage(Constants.cartKey) || [];

    data.forEach(product => {
        const isProductAdded = cartData.some(cartItem => cartItem.id === product.id);

        let salePrice = parseFloat(product.prices.sale_price / 100).toFixed(2);
        let regularPrice = parseFloat(product.prices.regular_price / 100).toFixed(2);

        const card = document.createElement('div');
        card.classList.add('products__item');

        // On Sale badge
        if (product.on_sale) {
            const saleBadge = document.createElement('span');
            saleBadge.classList.add('products__item-sale-badge');
            saleBadge.textContent = 'On Sale!';
            saleBadge.setAttribute('aria-label', 'On Sale');
            saleBadge.addEventListener('click', function () { window.location.href = `productdetail.html ? id = ${product.id} ` });
            card.appendChild(saleBadge);
        }

        // Favorite icon container
        const favoriteContainer = document.createElement('div');
        favoriteContainer.classList.add('products__item-favoritecontainer');
        favoriteContainer.innerHTML = `
                                        <fieldset>
                                            <legend>Favorite Product</legend>
                                            <input type="checkbox" id="favIcon-checkbox${product.id}" name="fav-checkbox">
                                            <label class="favorite" for="favIcon-checkbox${product.id}">
                                                <img class="favorite-checked" src="svg/favIconChecked.svg" alt="Remove from favorite">
                                                <img class="favorite-unchecked" src="svg/favIcon.svg" alt="Add to favorite">
                                            </label>
                                        </fieldset>`;


        const cardLink = document.createElement('a');
        cardLink.href = `productdetail.html?id=${product.id}`;
        cardLink.classList.add('products__item-link');

        const cardImage = document.createElement('figure');
        cardImage.classList.add('products__item-imageArea');
        cardImage.innerHTML = `<img src="${product.images[0].src}" alt="Product title ${product.name}">`;

        const cardTitle = document.createElement('h2');
        cardTitle.innerText = product.name;

        const productPriceContainer = document.createElement('div');
        productPriceContainer.classList.add('products__item-price-container');

        const discountedCardPrice = document.createElement('span');
        discountedCardPrice.classList.add('products__item-discounted-price');
        discountedCardPrice.innerText = `Now Only ${product.prices.currency_prefix} ${salePrice}`;
        discountedCardPrice.setAttribute('aria-label', `Discounted price now only ${product.prices.currency_prefix} ${salePrice}`);

        const productGender = document.createElement('div');
        productGender.classList.add('products__item-gender');
        //  productGender.innerText = `Gender: ${product.gender}`;
        if (product.categories[0].id === 17) {
            productGender.innerText = `Gender: Men`;
            productGender.setAttribute('aria-label', `Product gender Men`);
        }
        else if (product.categories[0].id === 26) {
            productGender.innerText = `Gender: Women`;
            productGender.setAttribute('aria-label', `Product gender Women`);
        }

        const originalCardPrice = document.createElement('span');
        originalCardPrice.classList.add('products__item-price');
        if (product.on_sale) {
            originalCardPrice.classList.add('on-sale');
        }
        originalCardPrice.innerText = `${product.prices.currency_prefix} ${regularPrice}`;
        originalCardPrice.setAttribute('aria-label', product.on_sale ? `Original price was ${product.prices.currency_prefix} ${regularPrice}` : `Price is ${product.prices.currency_prefix} ${salePrice}`);

        // Container for buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('products__item-actions');

        // Add to Cart button
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = isProductAdded ? 'In Cart' : 'Add to Cart';
        addToCartButton.classList.add('products__item-button', isProductAdded ? 'in-cart' : 'add-to-cart-btn');
        addToCartButton.disabled = isProductAdded;
        addToCartButton.setAttribute('data-id', product.id);
        console.log('button disabled: ', addToCartButton.disabled);
        console.log('isProductAdded', isProductAdded);
        addToCartButton.addEventListener('click', () => {
            // If the product is not in the cart, add it

            addToShoppingCart(product.id, data, Constants.collapsibleCartContainer);

        });

        // Buy Now button
        const buyNowButton = document.createElement('button');
        buyNowButton.textContent = 'Buy Now';
        buyNowButton.classList.add('products__item-button', 'buy-now-btn');
        buyNowButton.setAttribute('data-id', product.id);
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