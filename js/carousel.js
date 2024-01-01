// carousel.js
export function initializeCarousel(trackSelector, data) {
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
    track.innerHTML = ''; // Clear the track

    // Create a slide for each product
    data.forEach((product) => { // Remove the unused 'index' variable
      const slideElement = createSlideElement(product);
      track.appendChild(slideElement); // Append the slide to the carousel track
    });

    updateSlidePositions();
  }

  function createSlideElement(product) {
    const card = document.createElement('div');
    card.className = 'products__carousel-item carousel__slide';
    card.innerHTML = `
          
          <a href="productdetail.html?id=${product.id}" class="carousel-products__item">
            <figure class="products__carousel-item-imageArea">
              <img src="${product.image}" alt="${product.title}">
            </figure>
            <div class="products__carousel-item-textArea">
              <h2>${product.title}</h2>
              <span>$${product.price}</span>
            </div>
          </a>
        `;
    return card;
  }

  function moveSlide(direction) {
    const totalSlides = data.length;
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
    updateSlidePositions();
  }

  prevArrow.addEventListener('click', () => moveSlide(-1));
  nextArrow.addEventListener('click', () => moveSlide(1));

  // Initial render
  renderSlides();
}
