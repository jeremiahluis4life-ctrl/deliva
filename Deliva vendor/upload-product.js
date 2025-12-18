let selectedCategories = [];
let products = JSON.parse(localStorage.getItem('products')) || [];
const productList = document.querySelector('.products-list');
const totalPriceDisplay = document.querySelector('.total-price'); // Total price field
const priceInput = document.querySelector('.product-price');
const toppingNameInput = document.querySelector('.topping-name');
const toppingPriceInput = document.querySelector('.topping-price');
const toppingList = document.querySelector('.toppings-list');
const imageInput = document.querySelector('.product-image');
const imagePreview = document.querySelector('.image-preview');

// Load stored products when the page loads
function loadProducts() {
    productList.innerHTML = "";
    products.forEach((product, index) => {
        displayProduct(product, index);
    });
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Handle category selection
document.querySelectorAll('.category-option').forEach(option => {
    option.addEventListener('click', function () {
        if (this.classList.contains('selected')) {
            this.classList.remove('selected');
            selectedCategories = selectedCategories.filter(cat => cat !== this.textContent);
        } else {
            if (selectedCategories.length < 2) {
                this.classList.add('selected');
                selectedCategories.push(this.textContent);
            }
        }
    });
});

// Update total price in real-time
function updateTotalPrice() {
    let basePrice = parseFloat(priceInput.value) || 0;
    let toppingTotal = [...toppingList.children].reduce((sum, div) => {
        let price = parseFloat(div.dataset.price) || 0;
        return sum + price;
    }, 0);
    
    let total = basePrice + toppingTotal;
    totalPriceDisplay.textContent = `$${total.toFixed(2)}`;
}

// Add topping
document.querySelector('.add-topping').addEventListener('click', function () {
    let toppingName = toppingNameInput.value;
    let toppingPrice = parseFloat(toppingPriceInput.value);

    if (toppingName && !isNaN(toppingPrice) && toppingList.children.length < 3) {
        let toppingItem = document.createElement('div');
        toppingItem.dataset.price = toppingPrice;
        toppingItem.innerHTML = `${toppingName} - $${toppingPrice.toFixed(2)} <button type='button' class='remove-topping'>X</button>`;
        toppingList.appendChild(toppingItem);

        toppingItem.querySelector('.remove-topping').addEventListener('click', function () {
            toppingItem.remove();
            updateTotalPrice();
        });

        toppingNameInput.value = '';
        toppingPriceInput.value = '';

        updateTotalPrice();
    }
});

// Image preview
imageInput.addEventListener('change', function (event) {
    let file = event.target.files[0];

    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Display a product
function displayProduct(product, index) {
    let productDiv = document.createElement('div');
    productDiv.classList.add('product-display');

    let toppings = Array.isArray(product.toppings) ? product.toppings : [];
    let toppingsList = toppings.length
        ? toppings.map(t => `<li><strong>${t.name}</strong> -  ₦ ${parseFloat(t.price || 0).toFixed(2)}</li>`).join('')
        : '<li>No toppings</li>'; 

    let totalPrice = product.price + toppings.reduce((sum, t) => sum + (parseFloat(t.price) || 0), 0);

    // 🛠️ FIX: Ensure category is displayed correctly
    let categoryDisplay = product.categories || "No Category";

    productDiv.innerHTML = `
        <div class="prodimgact uploadedimage"><div class="noprodimg"><img src="${product.image || 'placeholder.jpg'}" alt="" loading="lazy"></div></div>

        <div class="proddetadd">
            <h2>${product.name}</h2>
            <div class="proddescption"><span><strong>Description:</strong> ${product.description}</span></div>
            <div class="prodcategory uplcat">
                <strong>Category:</strong> <span>${categoryDisplay}</span>
            </div>
            <div class="prodcategory topngs">
                <p><strong>Toppings:</strong></p>
                <ul class="tomorrowfont">${toppingsList}</ul>
            </div>
            <div class="totpricesd"><p><strong>Price:</strong><p><strong> ₦ ${totalPrice.toFixed(2)}</strong></p></div>
        </div>
        <div class="edit-delete">
                <button class="delete-product" data-index="${index}">Delete</button>
            </div>
    `;

    productDiv.querySelector('.delete-product').addEventListener('click', function () {
        let index = this.getAttribute('data-index');
        products.splice(index, 1);
        saveProducts();
        loadProducts();
    });

    productList.appendChild(productDiv);
}

// Handle form submission
document.querySelector('.product-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let name = document.querySelector('.product-name').value;
    let description = document.querySelector('.product-description').value;
    let price = parseFloat(priceInput.value) || 0;
    let image = imagePreview.src || '';

    let toppings = [...toppingList.children].map(div => {
        let text = div.textContent.replace(' X', '').trim();
        let parts = text.split(' - $');
        let name = parts[0] ? parts[0].trim() : "Unknown";
        let price = parts[1] ? parseFloat(parts[1]) : 0;
        return { name, price };
    });

    let totalPrice = price + toppings.reduce((sum, t) => sum + t.price, 0);

    // 🛠️ FIX: Ensure categories are stored correctly
    let categories = selectedCategories.length > 0 ? selectedCategories.join(', ') : "No Category";

    products.push({ name, description, price, toppings, totalPrice, categories, image });
    saveProducts();
    loadProducts();
    
    // Reset form fields after submission
    this.reset();
    selectedCategories = [];
    document.querySelectorAll('.category-option').forEach(option => option.classList.remove('selected'));
    toppingList.innerHTML = ''; 
    imagePreview.style.display = 'none';
    totalPriceDisplay.textContent = "$0.00"; // Reset total price
});

// Live update total price
priceInput.addEventListener('input', updateTotalPrice);

// Load products on page load
window.addEventListener('load', loadProducts);



document.addEventListener('DOMContentLoaded', () => {
  const bubbles = document.querySelectorAll('.prodimgact');
  bubbles.forEach(bubble => {
    const randomDelay = (Math.random() * 10).toFixed(2);
    bubble.style.animation = `float 6s ease-in-out ${randomDelay}s infinite`;
  });
});