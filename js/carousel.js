export function renderCarousel(trackSelector, data) {
  let currentIndex = 2;
  const track = document.querySelector(trackSelector);
  const prevArrow = document.querySelector('.carousel__arrow--left');
  const nextArrow = document.querySelector('.carousel__arrow--right');

  function updateSlidePositions() {
    const slides = document.querySelectorAll('.carousel__slide');
    const slideWidth = slides[0].offsetWidth;
    const slideMarginRight = parseInt(window.getComputedStyle(slides[0]).marginRight, 10);
    const totalSlideWidth = slideWidth + slideMarginRight;
    const offset = totalSlideWidth * currentIndex;

    // Calculate the shift needed to center the active slide
    const shift = -(offset - (track.clientWidth - slideWidth) / 2);
    track.style.transform = `translateX(${shift}px)`;

    // Update classes and opacity for all slides
    slides.forEach((slide, index) => {
      slide.classList.toggle('current-slide', index === currentIndex);
      slide.style.opacity = index === currentIndex ? '1' : '0.5';
    });
  }

  function renderSlides() {
    track.innerHTML = '';

    // Create a slide for each product
    data.forEach((product) => {
      const slideElement = createSlideElement(product);
      track.appendChild(slideElement);
    });

    updateSlidePositions();
  }

  function createSlideElement(product) {

    const salePrice = parseFloat(product.prices.sale_price / 100).toFixed(2);
    const regularPrice = parseFloat(product.prices.regular_price / 100).toFixed(2);
    const productImage = product.images[0].thumbnail;

    let gender;
    for (const attribute of product.attributes) {
      if (attribute.name === "Gender") {
        gender = attribute.terms[0].name;
      }
    }

    const card = document.createElement('div');
    card.className = 'products__carousel-item carousel__slide';
    if (product.on_sale) {
      card.innerHTML = `
                      <a href="productdetail.html?id=${product.id}" class="carousel-products__item">
                        <figure class="products__carousel-item-imageArea">
                          <img src="${productImage}" alt="${product.name}">
                        </figure>
                        <div class="products__carousel-item-textArea">
                          <h2>${product.name}</h2>
                          <div class="products__item-gender">Gender: ${gender}</div>
                          <span class="products__item-discounted-price">Now Only ${product.prices.currency_prefix} ${salePrice}</span>
                          <span class="on-sale">${product.prices.currency_prefix} ${regularPrice}</span>
                        </div>
                      </a>
                    `;
      return card;
    } else {
      card.innerHTML = `
                      <a href="productdetail.html?id=${product.id}" class="carousel-products__item">
                            <figure class="products__carousel-item-imageArea">
                              <img src="${productImage}" alt="${product.name}">
                            </figure>
                            <div class="products__carousel-item-textArea">
                              <h2>${product.name}</h2>
                              <div class="products__item-gender">Gender: ${gender}</div>
                              <span>${product.prices.currency_prefix} ${regularPrice}</span>
                            </div>
                          </a>
                        `;
      return card;
    }
  }

  function moveSlide(direction) {
    const totalSlides = data.length;
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
    updateSlidePositions();
  }

  prevArrow.addEventListener('click', () => moveSlide(-1));
  nextArrow.addEventListener('click', () => moveSlide(1));

  renderSlides();
}
