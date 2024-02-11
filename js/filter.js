import * as Constants from './constants.js';
import { createProductCard } from './script.js';
import { fetchProducts, fetchProductsForCarousel, fetchSingleProduct } from './fetch.js';
import { renderProductsLeftBar, createHtml } from './detail.js';


// Global variables
let colorValue = null;
let sizeValue = null;
let searchValue = null;

// Function to filter products
export function filterProducts(data, onSale, genderFilter, search, color, size, renderFunction) {
    let filteredData = data;
    // Filter search results
    if (search) {

        if (onSale) {
            onSale = false;
        }
        filteredData = data;
        if (genderFilter) {
            filteredData = filteredData.filter(product => product.attributes[0].terms[0].name === genderFilter);
        }
        if (color && color !== "all") {
            filteredData = filteredData.filter(product => product.baseColor === color);
        }
        if (size) {
            filteredData = filteredData.filter(product => product.attributes[0].terms.includes(size));
        }

        filteredData = filteredData.filter(product => product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search) || product.tags.includes(search));
        renderFunction(filteredData, search);
    }

    // Filter products
    if (!search) {
        // Filter on sale
        if (onSale) {
            filteredData = filteredData.filter(product => product.on_sale);
        }
        // Filter color
        if (color && color !== "all") {
            filteredData = filteredData.filter(product => product.baseColor === color);
        }

        // Filter size
        if (size) {
            filteredData = filteredData.filter(product =>
                product.attributes.some(attribute =>
                    attribute.name === "Size" && attribute.terms.some(terms => terms.name == size)
                )
            );
        }

        // Filter gender
        if (genderFilter) {
            filteredData = filteredData.filter(product => product.attributes[0].terms[0].name === genderFilter);
        }
        renderFunction(filteredData, null, color, size);
    }
    return { filteredData, onSale };
}



// Function to handle product filter
export function handleProductFilter() {
    document.addEventListener('headerLoaded', () => {
        const searchInput = document.querySelector("#search-products");
        const searchButton = document.querySelector("#search-products-button");
        searchInput.addEventListener("input", () => handleSearch(searchInput.value.trim().toLowerCase()));
        searchButton.addEventListener("click", (event) => { event.preventDefault(); handleSearch(searchInput.value.trim().toLowerCase()); });

        // Size filter event listener
        if (Constants.sizeFilter) {
            Constants.sizeFilter.forEach(size => {
                size.addEventListener("click", () => handleSizeFilter(size));
            });
        }

        function handleSizeFilter(size) {
            if (size.checked) {
                setTimeout(() => {
                    sizeValue = size.id;
                    fetchProducts(Constants.productContainer, Constants.loaderContainer, createProductCard, Constants.genderFilter, null, searchValue, colorValue, sizeValue);
                    if (Constants.carouselContainer) Constants.carouselContainer.style.display = "none";
                    if (Constants.mainContainerHeader) Constants.mainContainerHeader.style.display = "none";
                }, 500);
            } else {
                setTimeout(() => {
                    sizeValue = null;
                    fetchProducts(Constants.productContainer, Constants.loaderContainer, createProductCard, Constants.genderFilter, Constants.onSale, null, colorValue, null);
                    if (Constants.carouselContainer) Constants.carouselContainer.style.display = "flex";
                    if (Constants.mainContainerHeader) Constants.mainContainerHeader.style.display = "flex";
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
                    if (Constants.mainContainerHeader) Constants.mainContainerHeader.style.display = "none";
                }, 500);
            } else {
                setTimeout(() => {
                    fetchProducts(Constants.productContainer, Constants.loaderContainer, createProductCard, Constants.genderFilter, Constants.onSale, null, colorValue, sizeValue);
                    if (Constants.carouselContainer) Constants.carouselContainer.style.display = "flex";
                    if (Constants.mainContainerHeader) Constants.mainContainerHeader.style.display = "flex";
                }, 500);
            }
        }
    });
}

// Initialize the products on page load and filter products based on color and size filters if they exist in the DOM
export function InitializeProducts() {
    if (Constants.productContainer) {
        fetchProducts(Constants.productContainer, Constants.loaderContainer, createProductCard, Constants.genderFilter, Constants.onSale, null, colorValue, sizeValue);
        handleProductFilter();
    }

    if (Constants.leftBarContainer && Constants.detailContainer) {
        fetchProducts(Constants.leftBarContainer, Constants.loaderContainer, renderProductsLeftBar);
    }

    if (Constants.detailContainer) {
        fetchSingleProduct(Constants.id, Constants.detailContainer, Constants.url, createHtml);
    }


    if (Constants.carouselContainer) {
        fetchProductsForCarousel(Constants.carouselContainer, Constants.loaderContainer, Constants.genderFilter);
    }
}