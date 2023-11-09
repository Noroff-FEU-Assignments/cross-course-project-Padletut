import { cartKey } from "./constants.js";
import { fetchProducts } from "./fetch.js";
import { renderShoppingCart, removeFromCart } from "./cart.js";

const productContainer = document.querySelector(".products__content");
const loaderContainer = document.querySelector(".loader");
const shoppingCartContainer = document.querySelector(".right-bar");


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