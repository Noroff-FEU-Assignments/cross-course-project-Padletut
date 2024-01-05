import { saveToStorage } from "./storage/local.js";
import { idKey, url } from "./constants.js";
import { initializeCarousel } from "./carousel.js";

export async function fetchProducts(productContainer, loaderContainer, renderFunction, genderFilter = null, onSale = null) {
    try {

        //Since api data is static, we can save it to local storage and use it from there
        let data = [];
        if (data.length === 0) {
            const response = await fetch(url);
            data = await response.json();
        }

        // Check if loaderContainer exists before trying to access its properties
        if (loaderContainer && loaderContainer.length > 0) {
            loaderContainer[1].style.display = "none";
        }

        let filteredData = data;
        if (onSale) {
            filteredData = filteredData.filter(product => product.onSale);
        }

        if (genderFilter) {
            filteredData = data.filter(product => product.gender === genderFilter);
        }

        const productList = filteredData.map(product => product.id);

        renderFunction(filteredData, productContainer);
        saveToStorage(idKey, productList);

        if (loaderContainer) {
            loaderContainer.style.display = "none";
        }

        return filteredData;
    }
    catch (error) {
        productContainer.innerHTML = `<div class="${productContainer}"><h2>Ooops...something went wrong while loading the page</h2></div>`;
        console.warn(error);
    }
}


export async function fetchProductsForCarousel(carouselContainer, loaderContainer, genderFilter = null) {
    try {

        const response = await fetch(url);

        if (response.status === 404) {
            carouselContainer.innerHTML = '<div class="products__content__header"><h2>Ooops...something went wrong while loading the page</h2></div>';
            return;
        }
        let data = [];
        //Since api data is static, we can save it to local storage and use it from there
        if (data.length === 0) {
            data = await response.json();
        }
        // Check if loaderContainer exists before trying to access its properties
        if (loaderContainer && loaderContainer.length > 0) {
            loaderContainer[1].style.display = "none";
        }

        let filteredData = data;
        if (genderFilter) {
            filteredData = data.filter(product => product.gender === genderFilter);
        }

        const productList = filteredData.map(product => product.id);

        // Initialize the carousel with a random set of 5 products
        const randomProducts = filteredData.sort(() => 0.5 - Math.random()).slice(0, 5);
        initializeCarousel('.carousel__track', randomProducts);

        saveToStorage(idKey, productList);
        return filteredData;
    }
    catch (error) {
        carouselContainer.innerHTML = '<div class="products__content__header"><h2>Ooops...something went wrong while loading the page</h2></div>';
        console.warn(error);
    }
}

export async function fetchSingleProduct(id, detailContainer, url, createHtml) {
    try {
        let data = [];
        //Since api data is static, we can save it to local storage and use it from there
        if (data.length === 0) {
            const response = await fetch(`${url}/${id}`);
            data = await response.json();
        }
        createHtml(data);
    }
    catch (error) {
        console.warn(error);
        detailContainer.innerHTML = "Error loading page";
    }
}