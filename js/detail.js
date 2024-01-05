import * as Constants from './constants.js';
import { addToShoppingCart } from "./handlecart.js";
import { fetchProducts, fetchSingleProduct, fetchProductsForCarousel } from "./fetch.js";
import { loadFromStorage } from "./storage/local.js";
import { toggleCartVisibility, closeCartOnClickOutside } from './togglecart.js';
import { renderShoppingCart } from "./renderCart.js";

let data = [];

// Inject SVG into the DOM

fetch('/svg/cart.svg')
  .then(response => response.text())
  .then(svg => {
    document.querySelector('.icon-container').innerHTML = svg;
  });


document.addEventListener('headerLoaded', async () => {
  const cartIcon = document.querySelector('.cart');
  //const loaderContainer = document.getElementById('loader');


  // Fetch products and render the shopping cart
  try {
    data = await fetchProducts(Constants.collapsibleCartContainer, Constants.loaderContainer, renderShoppingCart, Constants.genderFilter, Constants.onSale);
    renderShoppingCart(data, Constants.collapsibleCart);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  // Event listener for the cart icon to toggle visibility
  cartIcon.addEventListener('click', () => toggleCartVisibility(Constants.collapsibleCart));

  // Close cart when clicking outside
  closeCartOnClickOutside(Constants.collapsibleCart);
});


function renderProductsLeftBar(data, leftBarContainer) {
  Constants.leftBarLoaderContainer.style.display = "none";
  const randomProducts = [];

  leftBarContainer.innerHTML = '<h2>Other Customers Also Bought</h2>';

  for (let i = 0; i < 4; i++) {
    const randomProduct = Math.floor(Math.random() * data.length);

    if (!randomProducts.includes(randomProduct)) {
      randomProducts.push(randomProduct);
      const product = data[randomProduct];

      const productCard = document.createElement('div');
      productCard.classList.add('products__item');

      if (product.onSale) {
        const saleBadge = document.createElement('span');
        saleBadge.classList.add('products__item-sale-badge');
        saleBadge.textContent = 'On Sale!';
        // Add styles or classes to saleBadge if needed
        productCard.appendChild(saleBadge);
      }

      productCard.innerHTML += `
        <div class="products__item-favoritecontainer">
          <input type="checkbox" id="favIcon-checkbox${product.id}" name="fav-checkbox">
          <label class="favorite" for="favIcon-checkbox${product.id}">
            <img class="favorite-checked" src="svg/favIconChecked.svg" alt="Remove from favorite">
            <img class="favorite-unchecked" src="svg/favIcon.svg" alt="Add to favorite">
          </label>
        </div>
        <a href="productdetail.html?id=${product.id}">
          <figure class="products__item-imageArea">
            <img src="${product.image}" alt="${product.title}">
          </figure>
          <div class="products__item-textArea">
            <h2>${product.title}</h2>
            <span>$${product.discountedPrice}</span>
          </div>
        </a>
      `;

      leftBarContainer.appendChild(productCard);
    } else {
      i--;
    }
  }
}

fetchSingleProduct(Constants.id, Constants.detailContainer, Constants.url, createHtml);
fetchProducts(Constants.leftBarContainer, Constants.loaderContainer, renderProductsLeftBar, Constants.genderFilter, Constants.onSale);
fetchProductsForCarousel(Constants.leftBarContainer, Constants.loaderContainer, Constants.genderFilter);

export function createHtml(details) {
  const detailProductContainer = document.querySelector('.product-detail__description');

  const detailImageContainer = document.createElement('figure');
  detailImageContainer.classList.add('product-detail__image');

  detailImageContainer.innerHTML = `<div class="product-detail__imageReview">
                                    <div>
    <svg width="102" height="16" viewBox="0 0 102 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.75 0L9.48998 5.35512H15.1207L10.5654 8.66476L12.3053 14.0199L7.75 10.7102L3.19466 14.0199L4.93465 8.66476L0.379312 5.35512H6.01002L7.75 0Z"
        fill="#A9ABAD" />
      <path
        d="M29.2115 0L30.9515 5.35512H36.5822L32.0269 8.66476L33.7669 14.0199L29.2115 10.7102L24.6562 14.0199L26.3962 8.66476L21.8409 5.35512H27.4716L29.2115 0Z"
        fill="#A9ABAD" />
      <path
        d="M50.6733 0L52.4133 5.35512H58.044L53.4887 8.66476L55.2286 14.0199L50.6733 10.7102L46.118 14.0199L47.858 8.66476L43.3026 5.35512H48.9333L50.6733 0Z"
        fill="#FFEF60" />
      <path
        d="M72.1347 0L73.8747 5.35512H79.5054L74.9501 8.66476L76.69 14.0199L72.1347 10.7102L67.5794 14.0199L69.3194 8.66476L64.764 5.35512H70.3947L72.1347 0Z"
        fill="#FEEF6A" />
      <path
        d="M93.5962 0L95.3361 5.35512H100.967L96.4115 8.66476L98.1515 14.0199L93.5962 10.7102L89.0408 14.0199L90.7808 8.66476L86.2255 5.35512H91.8562L93.5962 0Z"
        fill="#FFEF60" />
    </svg>
    <div>
      <span>(4 reviews)</span>
    </div>
    </div>
  </div>`;

  const detailDescription = document.createElement('span');
  detailDescription.innerText = details.description;

  const detailPrice = document.createElement('div');
  detailPrice.classList.add('product-detail__price');
  detailPrice.innerHTML = `<h2>Price $${details.price}</h2>`;

  const detailCheckList = document.createElement('div');
  detailCheckList.classList.add('product-detail__checklist');
  detailCheckList.innerHTML = `<div>
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9.175" cy="9.82502" r="9.175" fill="#E3E2E2" />
      <path
        d="M7.42096 12.2632L4.98284 9.82508L4.15259 10.6495L7.42096 13.9178L14.4371 6.90167L13.6127 6.07727L7.42096 12.2632Z"
        fill="#1F1F1F" />
    </svg>
    Waterproof
  </div>
  <div>
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9.175" cy="9.82502" r="9.175" fill="#E3E2E2" />
      <path
        d="M7.42096 12.2632L4.98284 9.82508L4.15259 10.6495L7.42096 13.9178L14.4371 6.90167L13.6127 6.07727L7.42096 12.2632Z"
        fill="#1F1F1F" />
    </svg>
    Windproof
  </div>
  <div>
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9.175" cy="9.82502" r="9.175" fill="#E3E2E2" />
      <path
        d="M7.42096 12.2632L4.98284 9.82508L4.15259 10.6495L7.42096 13.9178L14.4371 6.90167L13.6127 6.07727L7.42096 12.2632Z"
        fill="#1F1F1F" />
    </svg>
    Holding up to -25°C
  </div>`;

  const detailImage = document.createElement('img');
  detailImage.src = details.image;
  detailImage.alt = details.title;

  const detailTitle = document.createElement('h2');
  detailTitle.innerText = details.title;

  const detailSelectColorContainer = document.querySelector('.select-color__image');
  detailSelectColorContainer.innerHTML = `<img src="${details.image}" alt="Select color">`;

  Constants.detailContainer.prepend(detailProductContainer);

  detailProductContainer.prepend(detailPrice);
  detailProductContainer.prepend(detailDescription);
  detailProductContainer.prepend(detailCheckList);
  detailProductContainer.prepend(detailTitle);
  Constants.detailContainer.prepend(detailImageContainer);
  detailImageContainer.prepend(detailImage);
}

const addToCartButton = document.querySelector(".addToCart");


if (addToCartButton) {
  addToCartButton.addEventListener("click", () => {
    const shoppingCart = loadFromStorage(Constants.cartKey) || []; // Load the entire cart
    const productInCart = shoppingCart.find(item => item.id === Constants.id);

    if (!productInCart) {
      addToShoppingCart(Constants.id, data, Constants.collapsibleCartContainer);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const buyNowButton = document.getElementById('buy-now-button');

  if (buyNowButton) {
    buyNowButton.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the form from submitting

      const shoppingCart = loadFromStorage(Constants.cartKey) || [];
      const productInCart = shoppingCart.find(item => item.id === Constants.id);

      if (!productInCart) {
        addToShoppingCart(Constants.id, data, Constants.collapsibleCartContainer);
      }

      // Redirect to checkout page
      window.location.href = "checkout.html";
    });
  }
});

