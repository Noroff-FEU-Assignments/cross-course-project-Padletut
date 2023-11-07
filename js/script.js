import { cartKey, idKey } from "./constants.js";

import { loadFromStorage, removeFromStorage, saveToStorage } from "./storage/local.js";

const url = "https://api.noroff.dev/api/v1/rainy-days";

const productContainer = document.querySelector(".products__content");
const loaderContainer = document.querySelector(".loader");
let globalData;

export async function fetchProducts() {

    try {
        const response = await fetch(url);

        if (response.status === 404) {
            productContainer.innerHTML = '<div class="products__content__header"><h2>Ooops...something went wrong while loading the page</h2></div>';
        }

        const data = await response.json();
        globalData = data;
        renderShoppingCart(data);

        const productList = [];

        for (let i = 0; i < data.length; i++) {

            productList.push(data[i].id);
        }
        createProductCard(data);
        saveToStorage(idKey, productList);
    }
    catch (error) {
        productContainer.innerHTML = '<div class="products__content__header"><h2>Ooops...something went wrong while loading the page</h2></div>';
        console.warn(error);
    }
}


fetchProducts();

function createProductCard(data) {
    loaderContainer.style.display = "none";
    const cardBody = productContainer;
    for (let i = 0; i < data.length; i++) {
        const card = document.createElement('div');
        card.classList.add('products__item');
        card.innerHTML = `<div class="products__item-favoritecontainer">
                      <input type="checkbox" id="favIcon-checkbox${data[i].id}" name="fav-checkbox">
                      <label class="favorite" for="favIcon-checkbox${data[i].id}">
                      <img class="favorite-checked" src="svg/favIconChecked.svg" alt="Remove from favorite">
                      <img class="favorite-unchecked" src="svg/favIcon.svg" alt="Add to favorite">
                      </label>`

        const cardTitle = document.createElement('h2');
        cardTitle.innerText = data[i].title;

        const cardTextArea = document.createElement('div');
        cardTextArea.classList.add('products__item-textArea');

        const cardImage = document.createElement('figure');
        cardImage.classList.add('products__item-imageArea');
        cardImage.innerHTML = `<img src="${data[i].image}" alt="${data[i].title}">`;

        const cardLink = document.createElement('a');
        cardLink.href = `productdetail.html?id=${data[i].id}`;
        cardLink.classList.add('products__item');

        const cardPrice = document.createElement('span');
        cardPrice.innerText = "$" + data[i].price;

        cardBody.append(card);
        card.append(cardLink);
        cardLink.append(cardImage);
        cardLink.append(cardTextArea);
        cardTextArea.append(cardTitle);
        cardTextArea.append(cardPrice);

    }

}


let shoppingCartTotal = 0;
const shoppingCartContainer = document.querySelector(".right-bar");
const shoppingCartStorage = loadFromStorage(cartKey);

function removeFromCart(event, cartKey) {
    const shoppingCartItemElement = event.target.closest(".right-bar__cart");


    if (!shoppingCartItemElement) return;

    const shoppingCartItemId = shoppingCartItemElement.id;

    const shoppingCartItemToRemove = shoppingCartStorage.indexOf(shoppingCartItemId);
    if (shoppingCartItemToRemove !== -1) {
        shoppingCartStorage.splice(shoppingCartItemToRemove, 1);
        saveToStorage(cartKey, shoppingCartStorage);

        shoppingCartContainer.innerHTML = "";
        shoppingCartTotal = 0;
        renderShoppingCart(globalData);
    }
}



function renderShoppingCart(data) {
    shoppingCartContainer.innerHTML = `<h2>My Cart</h2>`;

    if (!shoppingCartStorage) return;

    shoppingCartTotal = 0;

    for (const shoppingCartItemId of shoppingCartStorage) {
        const product = data.find(item => item.id === shoppingCartItemId);

        if (product) {
            shoppingCartTotal += product.price;

            shoppingCartContainer.innerHTML += `<div class="right-bar__cart" id="${shoppingCartItemId}">
                <figure class="right-bar__cart-imageArea">
                    <img src="${product.image}" alt="${product.title}">
                </figure>
                <div class="right-bar__cart-textArea">
                    <h3>${product.title}</h3>
                    <span>$${product.price}</span>
                </div>
            </div>`;
        }
    }
    shoppingCartContainer.innerHTML += `<h3>Total in cart: <span>$${shoppingCartTotal.toFixed(2)}</span></h3>`;
}


shoppingCartContainer.addEventListener("click", (event) => {
    removeFromCart(event, cartKey);
});