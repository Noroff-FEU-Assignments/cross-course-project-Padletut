document.addEventListener('DOMContentLoaded', function () {
    let nameInput = document.querySelector('#name');
    let emailInput = document.querySelector('#email');
    let messageInput = document.querySelector('#message');
    let submitButton = document.querySelector('#submit');
    let submitLabel = document.querySelector('#submit-label'); // Get the submit label

    let inputs = [nameInput, emailInput, messageInput];

    if (submitButton.disabled) {
        submitLabel.classList.add('disabled'); // Add the class if the button is disabled
    } else {
        submitLabel.classList.remove('disabled'); // Remove it if the button is enabled
    }

    function validateInput(input) {
        // Remove previous error message and valid mark
        let errorMessage = input.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
        }
        let validMark = input.nextElementSibling;
        if (validMark && validMark.classList.contains('valid-mark')) {
            validMark.remove();
        }

        // Validate input
        if (!input.value) {
            input.classList.remove('valid');
            input.classList.add('error');
            input.insertAdjacentHTML('afterend', '<span class="error-message">This field is required.</span>');
        } else if (input === emailInput && !/\S+@\S+\.\S+/.test(input.value)) {
            input.classList.remove('valid');
            input.classList.add('error');
            input.insertAdjacentHTML('afterend', '<span class="error-message">Email is incorrectly formatted.</span>');
        } else {
            input.classList.remove('error');
            input.classList.add('valid');
            input.insertAdjacentHTML('afterend', '<span class="valid-mark">&#10004;</span>');
        }
    }

    inputs.forEach(function (input) {
        input.addEventListener('blur', function () {
            validateInput(input);

            // Enable or disable submit button based on validation
            let allFieldsValid = inputs.every(function (input) {
                return input.classList.contains('valid');
            });
            submitButton.disabled = !allFieldsValid;
        });
    });

    // Add event listeners to the right and left arrow buttons
    let rightArrow = document.querySelector('#right-arrow');
    let leftArrow = document.querySelector('#left-arrow');
    let carousel = document.querySelector('#carousel');

    rightArrow.addEventListener('click', function () {
        carousel.scrollLeft += carousel.offsetWidth;
    });

    leftArrow.addEventListener('click', function () {
        carousel.scrollLeft -= carousel.offsetWidth;
    });

    // You may also want to prevent the default form submission and validate all fields when attempting to submit
    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form from submitting
        inputs.forEach(validateInput);
        let allFieldsValid = inputs.every(function (input) {
            return input.classList.contains('valid');
        });

        if (allFieldsValid) {
            // Perform the form submission logic here, or remove event.preventDefault() above to allow the form to submit
        }
    });
});
