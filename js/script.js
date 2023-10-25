const url = "https://api.noroff.dev/api/v1/rainy-days";

const productContainer = document.querySelector(".products__content");

async function fetchProducts() {
    try {
        const response = await fetch(url);

        const data = await response.json();


        for (let i = 0; i < data.length; i++) {
            createProductCard(data[i].id, data[i].title, data[i].discountedPrice, data[i].image);
        }
    }
    catch (error) {
        console.log(error);
    }
}

fetchProducts();

function createProductCard(id, title, price, image, onSale) {
    const cardBody = productContainer;
    const card = document.createElement('div');
    card.classList.add('products__item');
    card.innerHTML = `<div class="products__item-favoritecontainer">
                      <input type="checkbox" id="favIcon-checkbox${id}" name="fav-checkbox">
                      <label class="favorite" for="favIcon-checkbox${id}">
                      <img class="favorite-checked" src="svg/favIconChecked.svg" alt="Remove from favorite">
                      <img class="favorite-unchecked" src="svg/favIcon.svg" alt="Add to favorite">
                      </label>`

    const cardTitle = document.createElement('h2');
    cardTitle.innerText = title;

    const cardTextArea = document.createElement('div');
    cardTextArea.classList.add('products__item-textArea');

    const cardImage = document.createElement('figure');
    cardImage.classList.add('products__item-imageArea');
    cardImage.innerHTML = `<img src="${image}" alt="${title}">`;

    const cardLink = document.createElement('a');
    cardLink.href = 'productdetail.html';
    cardLink.classList.add('products__item');

    const cardPrice = document.createElement('span');
    cardPrice.innerText = "$" + price;

    cardBody.append(card);
    card.append(cardLink);
    cardLink.append(cardImage);
    cardLink.append(cardTextArea);
    cardTextArea.append(cardTitle);
    cardTextArea.append(cardPrice);
}