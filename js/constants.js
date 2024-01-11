export const idKey = "ID";
export const searchKey = "SEARCH";
export const cartKey = "CART";
export const url = "https://api.noroff.dev/api/v1/rainy-days";
export const productContainer = document.querySelector(".products__content");
export const loaderContainer = document.querySelector(".loader");
export const leftBarLoaderContainer = document.querySelector(".left-bar__loader");
export const carouselContainer = document.querySelector(".carousel");
export const collapsibleCartContainer = document.querySelector('.collapsible-cart');
export const collapsibleCart = document.getElementById('collapsible-cart');
export const checkoutContainer = document.querySelector('.left-bar-checkoutpage');
export const detailContainer = document.querySelector(".product-detail");
export const leftBarContainer = document.querySelector(".left-bar");
export const queryString = document.location.search;
export const params = new URLSearchParams(queryString);
export const id = params.get("id");
export const renderProductsLeftBar = document.querySelector(".left-bar__products");
export const genderFilter = document.body.getAttribute('data-gender-filter');
export const onSale = document.body.getAttribute('data-on-sale') === 'true';