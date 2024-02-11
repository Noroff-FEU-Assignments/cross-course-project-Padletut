import { saveToStorage } from "./storage/local.js";
import { idKey, url } from "./constants.js";
import { initializeCarousel } from "./carousel.js";
import { filterProducts } from "./filter.js";

export async function fetchProducts(productContainer, loaderContainer, renderFunction, genderFilter = null, onSale = null, search = null, color = null, size = null) {
    try {
        console.log(new Error().stack);
        const response = await fetch(url);
        const data = await response.json();

        // Check if loaderContainer exists before trying to access its properties
        if (loaderContainer && loaderContainer.length > 0) {
            loaderContainer[1].style.display = "none";
        }

        // Filter products
        let filteredData;
        ({ filteredData, onSale } = filterProducts(data, onSale, genderFilter, search, color, size, renderFunction));

        const productList = filteredData.map(product => product.id);
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

        if (!response.ok) {
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
            filteredData = data.filter(product => product.attribute.terms[0].name === genderFilter);
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

        const response = await fetch(`${url}/${id}`);
        if (!response.ok) {
            detailContainer.innerHTML = "Error loading page";
            return;
        }

        data = await response.json();
        createHtml(data);
    }
    catch (error) {
        console.warn(error);
        detailContainer.innerHTML = "Error loading page";
    }
}