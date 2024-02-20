import * as Constants from './constants.js';
import { addToShoppingCart, detail_updateAddToCartButtonState } from "./handlecart.js";
import { fetchProducts, fetchSingleProduct } from "./fetch.js";
import { loadFromStorage } from "./storage/local.js";
import { initializeCart, toggleCartVisibility, closeCartOnClickOutside } from './togglecart.js';
import { loadCarouselProducts } from './filter.js';

// Initialize the product detail page
if (Constants.detailContainer) {
  document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchSingleProduct(Constants.id, Constants.detailContainer, Constants.url, Constants.detailLoaderContainer);
    renderProduct(data);
  });
}

// Initialize sidebar products on page load
if (Constants.leftBarContainer) {
  document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchProducts(Constants.leftBarContainer, Constants.leftBarLoaderContainer);
    renderProductsLeftBar(data);
  });
}

// Initialize the carousel on page load
const windowWidth = window.innerWidth;

if (Constants.carouselContainer && windowWidth >= 800) {
  document.addEventListener('headerLoaded', async () => {
    const data = await fetchProducts(Constants.carouselContainer, Constants.carouselLoaderContainer);
    loadCarouselProducts(data);
    Constants.carouselContainer.style.display = 'flex';
  });
}

if (Constants.detailContainer) {
  // Initialize the cart on page load
  document.addEventListener('headerLoaded', async () => {
    const cartIcon = document.querySelector('.cart');
    const collapsibleCart = document.getElementById('collapsible-cart');

    // Initialize the cart with products
    await initializeCart(collapsibleCart, Constants.loaderContainer);

    // Toggle cart visibility when the cart icon is clicked
    cartIcon.addEventListener('click', () => toggleCartVisibility(collapsibleCart));

    // Close cart when clicking outside
    closeCartOnClickOutside(collapsibleCart);

  });
}


// Function to render the left bar with random products
export function renderProductsLeftBar(data) {
  const randomProducts = [];

  Constants.leftBarContainer.innerHTML = '<h2>Other Customers Also Bought</h2>';

  for (let i = 0; i < 4; i++) {
    const randomProduct = Math.floor(Math.random() * data.length);

    if (!randomProducts.includes(randomProduct)) {
      randomProducts.push(randomProduct);
      const product = data[randomProduct];

      const productCard = document.createElement('div');
      productCard.classList.add('products__item');

      if (product.on_sale) {
        const saleBadge = document.createElement('span');
        saleBadge.classList.add('products__item-sale-badge');
        saleBadge.textContent = 'On Sale!';
        productCard.appendChild(saleBadge);
      }

      product.prices.sale_price = Number((product.prices.sale_price) / 100).toFixed(2);
      let productGender;
      const productImage = product.images[0].thumbnail;
      for (const attribute of product.attributes) {
        if (attribute.name === "Gender") {
          productGender = attribute.terms[0].name;
        }
      }

      const productName = document.createElement('h2');
      productName.innerHTML = product.name;
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
            <img src="${productImage}" alt="${productName.textContent}">
          </figure>
          <div class="products__item-textArea">
            <h2>${productName.textContent}</h2>
            <span>Gender: ${productGender}</span>         
            <span>${product.prices.currency_prefix} ${product.prices.sale_price}</span>
          </div>
        </a>
      `;

      Constants.leftBarContainer.appendChild(productCard);
    } else {
      i--;
    }
  }
}

export function renderProduct(details) {

  const detailProductContainer = document.querySelector('.product-detail__description');
  const detailProductName = document.createElement('h1');
  detailProductName.innerHTML = details.name;

  let productGender;
  for (const attribute of details.attributes) {
    if (attribute.name === "Gender") {
      productGender = attribute.terms[0].name;
    }
  }

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
  // Remove paragraph tags from the description
  const descriptionWithoutParagraphTags = details.description.replace(/<p>|<\/p>/g, '');
  detailDescription.innerHTML = descriptionWithoutParagraphTags;
  const detailGender = document.createElement('div');
  detailGender.classList.add('product-detail__gender');
  detailGender.innerHTML = `Gender: ${productGender}`;

  const detailPrice = document.createElement('div');
  detailPrice.classList.add('product-detail__price');
  details.prices.sale_price = Number((details.prices.sale_price) / 100).toFixed(2);
  detailPrice.innerHTML = `<h2>Price ${details.prices.currency_prefix} ${details.prices.sale_price}</h2>`;

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


  // Get the product images from array srcset and extract the links
  const productImages = details.images[0].srcset;
  const regex = /(https?:\/\/[^\s]+)/g;
  const imageLinks = productImages.match(regex);
  const detailImage = document.createElement('img');

  detailImage.src = imageLinks[1];
  detailImage.alt = detailProductName.textContent;

  const detailTitle = document.createElement('h2');
  detailTitle.innerText = detailProductName.textContent;

  const detailSelectColorContainer = document.querySelector('.select-color__image__container');

  for (let i = 0; i < details.attributes.length; i++) {
    if (details.attributes[i].name === "Color") {
      for (let j = 0; j < details.attributes[i].terms.length; j++) {
        // Create a new color selection element for each color option
        const colorSelectionElement = document.createElement('div');
        colorSelectionElement.innerHTML = `
        <img src="${detailImage.src}" alt="${detailImage.alt}">
        <p>${details.attributes[i].terms[j].name}</p>`;
        const radioColorSelector = document.createElement('input');
        radioColorSelector.setAttribute('type', 'radio');
        radioColorSelector.setAttribute('name', 'color-selection');
        radioColorSelector.setAttribute('id', 'select-color-' + j);
        radioColorSelector.style.display = 'none';

        // Only check the first radio button
        if (j === 0) {
          radioColorSelector.checked = true;
          colorSelectionElement.classList.add('selected');
        }
        colorSelectionElement.classList.add('color-selection'); // Add a class for styling

        // Create a label for the radio button
        const radioLabel = document.createElement('label');
        radioLabel.setAttribute('for', 'select-color-' + j);
        radioLabel.textContent = details.attributes[i].terms[j].name;
        radioLabel.style.display = 'none';

        // Add the radio button, its label, and the color selection element to the container
        colorSelectionElement.appendChild(radioColorSelector);
        colorSelectionElement.appendChild(radioLabel);
        detailSelectColorContainer.appendChild(colorSelectionElement);

        // Trigger a click on the radio button when the container is clicked
        colorSelectionElement.addEventListener('click', () => {
          // Remove the 'selected' class from all color selection elements
          const colorSelectionElements = document.querySelectorAll('.color-selection');
          colorSelectionElements.forEach(element => {
            element.classList.remove('selected');
          });

          // Add the 'selected' class to the clicked color selection element
          colorSelectionElement.classList.add('selected');
          radioColorSelector.click();
        });
      }
    }
  }

  Constants.detailContainer.prepend(detailProductContainer);
  detailProductContainer.prepend(detailPrice);
  detailProductContainer.prepend(detailGender);
  detailProductContainer.prepend(detailDescription);
  detailProductContainer.prepend(detailCheckList);
  detailProductContainer.prepend(detailTitle);
  Constants.detailContainer.prepend(detailImageContainer);
  detailImageContainer.prepend(detailImage);
}


if (Constants.detailContainer) {

  document.addEventListener('DOMContentLoaded', function () {
    const formButtonsContainer = document.querySelector(".product-detail__formbuttons");

    // Create the Buy Now button
    const buyNowContainer = document.createElement('div');
    buyNowContainer.className = 'buynow-container';
    const buyNowLabel = document.createElement('label');
    buyNowLabel.id = 'buy-now-label';
    buyNowLabel.htmlFor = 'buy-now-button';
    const buyNowButton = document.createElement('input');
    buyNowButton.type = 'submit';
    buyNowButton.value = 'Buy Now';
    buyNowButton.className = 'buynow';
    buyNowButton.id = 'buy-now-button';
    const buyNowObject = document.createElement('object');
    buyNowObject.data = '/svg/buynow.svg';
    buyNowLabel.append(buyNowButton, buyNowObject, 'Buy Now');

    // Create the Add to Cart button
    const addToCartContainer = document.createElement('div');
    addToCartContainer.className = 'addtocart-container';
    const addToCartButton = document.createElement('a');
    addToCartButton.className = 'addToCart';
    addToCartButton.href = '#';
    addToCartButton.id = 'add-to-cart-button';
    const addToCartObject = document.createElement('object');
    addToCartObject.className = 'icon-container';
    const addToCartSpan = document.createElement('span');
    addToCartSpan.textContent = 'Add to cart';
    addToCartButton.append(addToCartObject, addToCartSpan);

    // Add the buttons to the container
    formButtonsContainer.append(buyNowContainer);
    buyNowContainer.append(buyNowLabel);
    formButtonsContainer.append(addToCartContainer);
    addToCartContainer.append(addToCartButton);

    // Add event listener to the Add to Cart button
    addToCartButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (!addToCartButton.disabled) {
        const shoppingCart = loadFromStorage(Constants.cartKey) || [];
        const productInCart = shoppingCart.find(item => item.id === Number(Constants.id));

        if (!productInCart) {
          addToShoppingCart(Number(Constants.id), fetchProducts.data, Constants.collapsibleCartContainer);
          // empty shopping cart array and load from storage
          shoppingCart.length = 0;
          shoppingCart.push(...loadFromStorage(Constants.cartKey));
        }
        // updateButton();
        detail_updateAddToCartButtonState(shoppingCart);
        initializeCart(Constants.collapsibleCartContainer, Constants.loaderContainer);
      }
    });

    // Buy Now button event listener
    buyNowButton.addEventListener("click", (event) => {
      event.preventDefault();
      const shoppingCart = loadFromStorage(Constants.cartKey) || [];
      const productInCart = shoppingCart.find(item => item.id === Number(Constants.id));

      if (!productInCart) {
        addToShoppingCart(Number(Constants.id), fetchProducts.data, Constants.collapsibleCartContainer);
        // empty shopping cart array and load from storage
        shoppingCart.length = 0;
        shoppingCart.push(...loadFromStorage(Constants.cartKey));
      }
      // updateButton();
      detail_updateAddToCartButtonState(shoppingCart);
      initializeCart(Constants.collapsibleCartContainer, Constants.loaderContainer);
      window.location.href = "/checkout.html";
    });

    // Initial button update

    detail_updateAddToCartButtonState(loadFromStorage(Constants.cartKey) || []);

    // Inject SVG into the DOM

    if (Constants.detailContainer) {
      fetch('/svg/cart.svg')
        .then(response => response.text())
        .then(svg => {
          document.querySelector('.icon-container').innerHTML = svg;
        });
    }

  });
}