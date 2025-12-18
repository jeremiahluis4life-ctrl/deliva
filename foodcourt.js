// Wait until DOM is fully loaded before running the script
console.log('Foodcourt.js script starting...');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded - initializing foodcourt...');

  // === DOM Elements ===
  const foodDisplay = document.querySelector('.food-display');
  const foodNameEl = document.querySelector('.food-name');
  const plateContainer = document.querySelector('.plate-container');
  const addPlateBtn = document.querySelector('.add-plate');
  const closeBtn = document.getElementById('close-btnforpop');

  const popupfornofood = document.getElementById('popupfornofood'); // Max food popup
  const closePopupfornofoodBtn = document.getElementById('close-popupfornofood');

  const popupfornoplate = document.getElementById('popupfornoplate'); // Max plates popup
  const closePopupfornoplateBtn = document.getElementById('close-popupfornoplate');

  const totalPriceEl = document.getElementById('total-price');

  // === Food data ===
  const foodNames = ['Fried rice: N1500', 'Jollof:  N1200', 'sandwitch:  N1000', 'Vegetable soup: N1000', 'Egusi soup:  N500', 'Eba:  N500', 'Fufu:  N300'];
  const foodImages = [
    'img/fried rice.jpg',
    'img/jollof rice.jpg  ',
    'img/sandwitch.jpeg',
    'img/vegetable soup.jpg',
    'img/egusi soup.jpg',
    'img/eba.jpg',
    'img/fufu.jpg'
  ];

  // Food price mapping
  const foodPrices = {
    'Fried rice: N1500': 1500,
    'Jollof:  N1200': 1200,
    'sandwitch:  N1000': 1000,
    'Vegetable soup: N1000': 1000,
    'Egusi soup:  N500': 500,
    'Eba:  N500': 500,
    'Fufu:  N300': 300
  };

  // Drink price mapping
  const drinkPrices = {
    'Coke': 500,
    'Pepsi': 500,
    'Fanta': 500,
    'Sprite': 500,
    'Water': 500
  };

  // === App State ===
  let plates = []; // Array of plate DOM elements
  let activePlateIndex = 0; // Currently active plate index
  const maxFoodPortions = 5; // Max food portions per plate
  const maxPlates = 4; // Max number of plates

  // === Popup Handlers ===
  function showPopupfornofood() {
    popupfornofood.classList.add('open'); // Show max food popup
  }

  function showPopupfornoplate() {
    popupfornoplate.classList.add('open'); // Show max plate popup
  }

  closePopupfornofoodBtn.addEventListener('click', () => {
    popupfornofood.classList.remove('open');
  });

  closePopupfornoplateBtn.addEventListener('click', () => {
    popupfornoplate.classList.remove('open');
  });

  // === Updates plate descriptions (list of items) ===
  function updateDescriptions() {
    console.log('Updating descriptions for', plates.length, 'plates');
    plates.forEach((plate, index) => {
      const desc = plate.parentElement.querySelector('.plate-description');
      const foodCounts = {};
      const drinkCounts = {};

      // Count each type of food on this plate
      plate.querySelectorAll('img[data-food]').forEach(img => {
        const food = img.dataset.food;
        foodCounts[food] = (foodCounts[food] || 0) + 1;
      });

      // Count each type of drink on this plate
      const drinkElements = plate.querySelectorAll('[data-drink]');
      console.log(`Plate ${index}: Found ${drinkElements.length} drink elements`);
      drinkElements.forEach(drinkEl => {
        const drink = drinkEl.dataset.drink;
        drinkCounts[drink] = (drinkCounts[drink] || 0) + 1;
        console.log(`Found drink: ${drink}`);
      });

      desc.innerHTML = '';

      if (Object.keys(foodCounts).length === 0 && Object.keys(drinkCounts).length === 0) {
        desc.textContent = 'No items added';
        return;
      }

      // Create bullet list of food and drink portions
      const list = document.createElement('ul');
      
      // Add food items
      Object.entries(foodCounts).forEach(([food, count]) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${count} portion${count > 1 ? 's' : ''} of ${food.split(':')[0]}`;
        list.appendChild(listItem);
      });

      // Add drink items
      Object.entries(drinkCounts).forEach(([drink, count]) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${count} ${drink}${count > 1 ? 's' : ''}`;
        list.appendChild(listItem);
        console.log(`Added drink to description: ${count} ${drink}`);
      });

      desc.appendChild(list);
    });
  }

  // === Updates total price display ===
  function updateTotalPrice() {
    let total = 0;

    // Sum prices of all food portions on all plates
    plates.forEach(plate => {
      plate.querySelectorAll('img[data-food]').forEach(img => {
        const food = img.dataset.food;
        const price = foodPrices[food] || 0;
        total += price;
      });

      // Sum prices of all drinks on all plates
      plate.querySelectorAll('[data-drink]').forEach(drinkEl => {
        const drink = drinkEl.dataset.drink;
        const price = drinkPrices[drink] || 0;
        total += price;
      });
    });

    totalPriceEl.textContent = `₦${total.toLocaleString()}`;
  }

  // === Create a new plate ===
  function createPlate() {
    if (plates.length >= maxPlates) {
      showPopupfornoplate();
      return;
    }

    // Create plate wrapper and description elements
    const plateWrapper = document.createElement('div');
    plateWrapper.className = 'plate-wrapper';

    const plate = document.createElement('div');
    plate.className = 'plate';

    const desc = document.createElement('div');
    desc.className = 'plate-description';

    plateWrapper.appendChild(plate);
    plateWrapper.appendChild(desc);
    plateContainer.appendChild(plateWrapper);

    plates.push(plate);

    // Plate click handler to activate or remove if empty
    plate.addEventListener('click', () => {
      const isActive = plate.classList.contains('active');

      if (isActive && plate.querySelectorAll('img[data-food]').length === 0) {
        // Remove plate if empty and active
        plateWrapper.remove();
        const index = plates.indexOf(plate);
        if (index > -1) plates.splice(index, 1);

        activePlateIndex = plates.length > 0 ? Math.max(0, index - 1) : -1;

        plates.forEach(p => p.classList.remove('active'));
        if (plates[activePlateIndex]) plates[activePlateIndex].classList.add('active');

        updateDescriptions();
        updateTotalPrice();
        return;
      }

      // Activate clicked plate
      plates.forEach(p => p.classList.remove('active'));
      plate.classList.add('active');
      activePlateIndex = plates.indexOf(plate);
    });

    // Make new plate active by default
    if (plates.length === 1) plate.classList.add('active');
    activePlateIndex = plates.length - 1;

    updateDescriptions();
    updateTotalPrice();
  }

  // === Setup food slides with click handlers ===
  const glideSlides = document.querySelectorAll('.glide__slide');
  glideSlides.forEach((slide, i) => {
    const food = foodNames[i % foodNames.length];
    const imgSrc = foodImages[i % foodImages.length];
    slide.dataset.food = food;

    const foodNameTag = slide.querySelector('.foodname');
    if (foodNameTag) foodNameTag.textContent = food;

    // Click on food slide to add food portion to active plate
    slide.addEventListener('click', () => {
      foodDisplay.classList.add('open'); // Show food selection UI

      const plate = plates[activePlateIndex];
      if (activePlateIndex === -1 || !plate) return;

      const currentPlateFoods = plate.querySelectorAll('img[data-food]').length;
      if (currentPlateFoods >= maxFoodPortions) {
        showPopupfornofood();
        return;
      }

      // Check if food already exists on plate
      const existingImg = Array.from(plate.querySelectorAll('img')).find(img => img.dataset.food === food);

      if (existingImg) {
        // Clone and add another portion
        const clone = existingImg.cloneNode();
        plate.appendChild(clone);

        // Allow removal on click
        clone.addEventListener('click', () => {
          clone.remove();
          updateDescriptions();
          updateTotalPrice();
        });
      } else {
        // First portion of this food on plate
        const portion = document.createElement('img');
        portion.src = imgSrc;
        portion.alt = food;
        portion.dataset.food = food;
        plate.appendChild(portion);

        portion.addEventListener('click', () => {
          portion.remove();
          updateDescriptions();
          updateTotalPrice();
        });
      }

      // Arrange food portions in circle on plate
      const plateImages = plate.querySelectorAll('img[data-food]');
      const totalImages = plateImages.length;

      plateImages.forEach((img, index) => {
        const angle = (index / totalImages) * 360;
        const radius = 18; // % offset for circle radius
        const offsetX = Math.cos((angle * Math.PI) / 180) * radius;
        const offsetY = Math.sin((angle * Math.PI) / 180) * radius;

        img.style.position = 'absolute';
        img.style.left = `${50 + offsetX}%`;
        img.style.top = `${50 + offsetY}%`;
        img.style.transform = 'translate(-50%, -50%)';
        img.style.width = '30%';
        img.style.height = '30%';
      });

      updateDescriptions();
      updateTotalPrice();
    });
  });

  // === Button event listeners ===
  addPlateBtn.addEventListener('click', createPlate);

  closeBtn.addEventListener('click', () => {
    foodDisplay.classList.remove('open');
  });

  // === Initialize app ===
  console.log('Creating initial plate...');
  createPlate();
  console.log('Initial plate created. Active plate index:', activePlateIndex);

  // === Initialize Glide.js slider ===
  new Glide('.glide', {
    type: 'carousel',
    perView: 3,
    focusAt: 'center',
    gap: 5,
    autoplay: 4000,
    hoverpause: true,
    animationDuration: 600,
  }).mount();

  // === Drink functionality ===
  const fridges = document.querySelectorAll('.fridge');
  const sound = document.querySelector('.fridge-sound');
  
  console.log('Found fridges:', fridges.length);
  console.log('Found sound element:', sound);

  fridges.forEach((fridge, index) => {
    console.log(`Setting up fridge ${index}:`, fridge);
    const openBtn = fridge.querySelector('.door-button.drinksfridge');
    const inside = fridge.querySelector('.inside');
    const closeBtn = inside.querySelector('.close-btnforpop');
    const drinkBoxes = fridge.querySelectorAll('.drink');
    
    console.log(`Fridge ${index} elements:`, {
      openBtn: openBtn,
      inside: inside,
      closeBtn: closeBtn,
      drinkBoxes: drinkBoxes.length
    });

    // Check if elements exist
    if (!openBtn) {
      console.error(`Fridge ${index}: No open button found! Looking for .door-button.drinksfridge`);
      return;
    }
    if (!inside) {
      console.error(`Fridge ${index}: No inside element found!`);
      return;
    }
    if (!closeBtn) {
      console.error(`Fridge ${index}: No close button found!`);
      return;
    }

    // Create the selection display container
    let selectionDisplay = fridge.querySelector('.selection-display');
    if (!selectionDisplay) {
      selectionDisplay = document.createElement('div');
      selectionDisplay.classList.add('selection-display');
      inside.appendChild(selectionDisplay);
    }

    // Initially hide the selection display
    selectionDisplay.style.display = 'none';

    // Create upgrade popup
    let upgradePopup = fridge.querySelector('.upgrade-popup');
    if (!upgradePopup) {
      upgradePopup = document.createElement('div');
      upgradePopup.classList.add('upgrade-popup');
      upgradePopup.innerHTML = `
        <div class="upgrade-popup-content">
          <p>You can only select up to 4 drinks.<br>Upgrade to add more!</p>
          <div class="drkupg"><a href="#" class="upgrade-close">Close</a><a href="#" class="unique-link" data-popup="popup-U">Upgrade</a></div>
        </div>
      `;
      inside.appendChild(upgradePopup);

      // Close popup
      upgradePopup.querySelector('.upgrade-close').addEventListener('click', () => {
        upgradePopup.classList.remove('active');
      });
    }

    // Open fridge
    openBtn.addEventListener('click', (e) => {
      console.log('Opening fridge...');
      console.log('Fridge element before opening:', fridge);
      console.log('Fridge classes before opening:', fridge.className);
      
      fridge.classList.add('open');
      
      console.log('Fridge element after opening:', fridge);
      console.log('Fridge classes after opening:', fridge.className);
      console.log('Inside element:', inside);
      console.log('Inside element computed style right:', window.getComputedStyle(inside).right);
      
      // Force the inside element to be visible for testing
      inside.style.right = '0';
      inside.style.zIndex = '9999';
      
      sound.currentTime = 0;
      sound.play().catch(() => {});
    });

    // Close fridge
    closeBtn.addEventListener('click', () => {
      console.log('Closing fridge...');
      fridge.classList.remove('open');
      // Reset forced styles
      inside.style.right = '';
      inside.style.zIndex = '';
    });

    // Drink selection logic
    drinkBoxes.forEach(drinkBox => {
      drinkBox.addEventListener('click', () => {
        console.log('Drink box clicked');
        const currentCount = selectionDisplay.querySelectorAll('.selected-drink').length;
        console.log('Current drink count:', currentCount);

        if (currentCount >= 4) {
          upgradePopup.classList.add('active');
          return;
        }

        const drinkName = drinkBox.parentElement.querySelector('span').innerText;
        const drinkImg = drinkBox.querySelector('img');
        console.log('Selected drink name:', drinkName);

        const selected = document.createElement('div');
        selected.classList.add('selected-drink');

        selected.innerHTML = `
          <img src="${drinkImg.src}" alt="${drinkName}">
          <span>${drinkName}</span>
        `;

        selected.addEventListener('click', () => {
          selected.remove();
          // If there are no drinks left, hide the selection display
          if (selectionDisplay.querySelectorAll('.selected-drink').length === 0) {
            selectionDisplay.style.display = 'none';
          }
        });

        selectionDisplay.appendChild(selected);

        // Show the selection display when a drink is added
        selectionDisplay.style.display = 'flex';

        // Always create the 'Add to Plate' button (it will be replaced each time)
        const addToPlateBtn = document.createElement('button');
        addToPlateBtn.classList.add('add-to-plate', 'close-button');
        addToPlateBtn.innerText = 'Add to Plate';
        addToPlateBtn.addEventListener('click', () => {
          console.log('Add to Plate button clicked');
          console.log('Plates array length:', plates.length);
          console.log('Active plate index:', activePlateIndex);
          
          // Get the active plate
          const activePlate = plates[activePlateIndex];
          if (activePlateIndex === -1 || !activePlate) {
            alert('Please create a plate first!');
            return;
          }

          // Get all selected drinks
          const selectedDrinks = selectionDisplay.querySelectorAll('.selected-drink');
          console.log('Selected drinks:', selectedDrinks.length);
          
          selectedDrinks.forEach(selectedDrink => {
            const drinkName = selectedDrink.querySelector('span').textContent;
            console.log('Adding drink:', drinkName);
            
            // Check if drink already exists on plate
            const existingDrink = Array.from(activePlate.querySelectorAll('[data-drink]'))
              .find(el => el.dataset.drink === drinkName);

            if (existingDrink) {
              // Clone and add another drink
              const clone = existingDrink.cloneNode();
              activePlate.appendChild(clone);
              console.log('Added duplicate drink:', drinkName);
            } else {
              // First drink of this type on plate
              const drinkElement = document.createElement('div');
              drinkElement.dataset.drink = drinkName;
              drinkElement.style.display = 'none'; // Hide visually, only show in description
              activePlate.appendChild(drinkElement);
              console.log('Added new drink:', drinkName);
            }
          });

          // Clear the selection display
          selectionDisplay.innerHTML = '';
          selectionDisplay.style.display = 'none';

          // Update descriptions and total price
          console.log('Updating descriptions and price...');
          updateDescriptions();
          updateTotalPrice();

          // Close the fridge
          fridge.classList.remove('open');
        });

        // Remove any existing button and add the new one
        const existingBtn = selectionDisplay.querySelector('.add-to-plate');
        if (existingBtn) {
          existingBtn.remove();
        }
        selectionDisplay.appendChild(addToPlateBtn);
      });
    });
  });

  // === Draggable drinks fridge ===
  const btn = document.querySelector('.drinksfridge');
  const vend = document.querySelector('.vend');
  let isDragging = false;
  let offsetX, offsetY;

  // Start dragging for mouse
  btn.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - btn.offsetLeft;
    offsetY = e.clientY - btn.offsetTop;
    btn.style.cursor = 'grabbing';
  });

  // Start dragging for touch
  btn.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - btn.offsetLeft;
    offsetY = touch.clientY - btn.offsetTop;
    btn.style.cursor = 'grabbing';
  });

  // Move the button with mouse
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      const rect = vend.getBoundingClientRect();
      const maxX = rect.width - btn.offsetWidth;
      const maxY = rect.height - btn.offsetHeight;

      btn.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
      btn.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    }
  });

  // Move the button with touch
  document.addEventListener('touchmove', (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      const x = touch.clientX - offsetX;
      const y = touch.clientY - offsetY;
      const rect = vend.getBoundingClientRect();
      const maxX = rect.width - btn.offsetWidth;
      const maxY = rect.height - btn.offsetHeight;

      btn.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
      btn.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    }
  });

  // Stop dragging for mouse
  document.addEventListener('mouseup', () => {
    isDragging = false;
    btn.style.cursor = 'grab';
  });

  // Stop dragging for touch
  document.addEventListener('touchend', () => {
    isDragging = false;
    btn.style.cursor = 'grab';
  });

  // === Review system ===
  const form = document.querySelector('.review-form');
  const commentInput = form.querySelector('.input-comment');
  const fileInput = form.querySelector('.file-input');
  const fileBtn = form.querySelector('.file-btn');
  const reviewList = document.querySelector('.review-list');

  const names = ['Jeremiah O.'];
  const getRandomName = () => names[Math.floor(Math.random() * names.length)];
  const renderStars = () => '★'.repeat(5);

  let selectedImage = null;

  // Show preview and store image on selection
  fileBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        selectedImage = reader.result;
        showImagePreview(selectedImage);
      };
      reader.readAsDataURL(file);
    }
  });

  function showImagePreview(src) {
    // Remove any previous preview
    const oldPreview = form.querySelector('.image-preview');
    if (oldPreview) oldPreview.remove();

    const img = document.createElement('img');
    img.src = src;
    img.classList.add('image-preview');
    img.style.maxWidth = '70px';
    img.style.marginTop = '10px';
    img.style.borderRadius = '6px';
    img.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    form.insertBefore(img, form.querySelector('button[type="button"]'));
  }

  function createReviewCard(name, comment, image) {
    const card = document.createElement('div');
    card.classList.add('review-card');

    card.innerHTML = `
      <div class="review-header">
        <div class="revhead">
          <div class="revimg"></div>
          <span class="review-name">${name}</span>
        </div>
        <span class="review-rating">${renderStars()}</span>
      </div>
      <p class="review-comment">${comment}</p>
      ${image ? `<img src="${image}" class="review-image" alt="Uploaded image">` : ''}
    `;

    reviewList.appendChild(card);
    reviewList.scrollTop = reviewList.scrollHeight;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const comment = commentInput.value.trim();

    if (!comment && !selectedImage) return; // don't submit if both are empty

    const name = getRandomName();
    createReviewCard(name, comment, selectedImage);

    form.reset();
    selectedImage = null;

    const preview = form.querySelector('.image-preview');
    if (preview) preview.remove();
  });

  // Optional: preload one review
  createReviewCard('Zainab M.', 'Best delivery ever, food was still hot', null);

  // === TEST BUTTON FOR FRIDGE DEBUGGING ===
  // Add a test button to force open the fridge
  const testButton = document.createElement('button');
  testButton.textContent = 'TEST: Force Open Fridge';
  testButton.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    background: red;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  
  testButton.addEventListener('click', () => {
    console.log('Test button clicked - forcing fridge to open');
    const fridge = document.querySelector('.fridge');
    const inside = fridge.querySelector('.inside');
    
    if (fridge && inside) {
      console.log('Found fridge and inside elements');
      
      // Force all styles to make it visible
      fridge.style.display = 'block';
      fridge.style.visibility = 'visible';
      fridge.style.opacity = '1';
      fridge.style.position = 'relative';
      
      inside.style.display = 'block';
      inside.style.visibility = 'visible';
      inside.style.opacity = '1';
      inside.style.position = 'fixed';
      inside.style.top = '0';
      inside.style.right = '0';
      inside.style.width = '80%';
      inside.style.height = '100vh';
      inside.style.backgroundColor = 'white';
      inside.style.zIndex = '9999';
      inside.style.transform = 'none';
      
      fridge.classList.add('open');
      console.log('Forced fridge to open with inline styles');
    } else {
      console.error('Could not find fridge or inside elements');
    }
  });
  
  document.body.appendChild(testButton);
  console.log('Test button added to page');

  // === SIMPLE VISIBILITY TEST ===
  const visibilityTest = document.createElement('div');
  visibilityTest.innerHTML = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: red;
      color: white;
      padding: 20px;
      border-radius: 10px;
      z-index: 10000;
      font-size: 16px;
      text-align: center;
    ">
      <h3>FRIDGE TEST</h3>
      <p>If you can see this, JavaScript is working!</p>
      <button onclick="this.parentElement.remove()" style="
        background: white;
        color: red;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
      ">Close</button>
    </div>
  `;
  
  document.body.appendChild(visibilityTest);
  console.log('Visibility test popup added');

});

// === Page navigation function ===
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.contentact').forEach(div => div.style.display = 'none');

  // Show selected page
  const page = document.getElementById(pageId);
  page.style.display = 'block';
}
































