console.log('Meal swipe script loaded');

// Simple function to wait for an element
function waitForElement(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// Initialize meal swipe
async function initMealSwipe() {
  console.log('Initializing meal swipe...');
  
  try {
    const showBtn = await waitForElement('#showCardsBtn');
    const container = await waitForElement('#card-container');
    const closeBtn = await waitForElement('#closeCardsBtn');
    
    console.log('Elements found:', { showBtn, container, closeBtn });
    
    // Add CSS for visibility
    const style = document.createElement('style');
    style.textContent = `
      .show-container { display: flex !important; }
      .hide-container { display: none !important; }
      .show-button { display: flex !important; }
      .hide-button { display: none !important; }
    `;
    document.head.appendChild(style);
    
    // Set initial state
    container.classList.add('hide-container');
    closeBtn.classList.add('hide-button');
    
    // Show button handler
    showBtn.onclick = function(e) {
      console.log('Show button clicked');
      e.preventDefault();
      container.classList.remove('hide-container');
      container.classList.add('show-container');
      showBtn.classList.add('hide-button');
      closeBtn.classList.remove('hide-button');
      closeBtn.classList.add('show-button');
    };
    
    // Close button handler
    closeBtn.onclick = function(e) {
      console.log('Close button clicked');
      e.preventDefault();
      container.classList.remove('show-container');
      container.classList.add('hide-container');
      showBtn.classList.remove('hide-button');
      showBtn.classList.add('show-button');
      closeBtn.classList.remove('show-button');
      closeBtn.classList.add('hide-button');
    };
    
    // Card handlers
    const cards = Array.from(container.querySelectorAll('.card')).reverse();
    console.log('Found cards:', cards.length);
    
    cards.forEach((card, index) => {
      container.appendChild(card); // bring to front
      
      let startX = 0;
      let lastTap = 0;
      
      const yesBtn = card.querySelector('.yes-btn');
      const noBtn = card.querySelector('.no-btn');
      const favBtn = card.querySelector('.fav-btn');
      const foodName = card.querySelector('.food-name');
      
      // Touch/swipe events
      card.addEventListener("pointerdown", e => {
        startX = e.clientX || e.touches?.[0]?.clientX;
      });
      
      card.addEventListener("pointerup", e => {
        const endX = e.clientX || e.changedTouches?.[0]?.clientX;
        const diff = endX - startX;
        
        if (Math.abs(diff) > 100) {
          if (diff < 0) swipeLeft(card);
          else swipeRight(card);
        } else {
          const now = new Date().getTime();
          if (now - lastTap < 300) swipeRight(card);
          lastTap = now;
        }
      });
      
      card.addEventListener("dblclick", () => swipeRight(card));
      
      // Drag logic for sliding food details up/down
      let startY = 0;
      let isDragging = false;
      
      if (foodName) {
        foodName.addEventListener("pointerdown", e => {
          startY = e.clientY;
          isDragging = true;
          e.preventDefault();
        });
        
        foodName.addEventListener("pointermove", e => {
          if (!isDragging) return;
          const diffY = e.clientY - startY;
          if (diffY > 20) { // drag down to open
            card.classList.add("open");
          } else if (diffY < -20) { // drag up to close
            card.classList.remove("open");
          }
        });
        
        foodName.addEventListener("pointerup", e => {
          isDragging = false;
        });
        
        // Keep click toggle as backup
        foodName.addEventListener("click", () => card.classList.toggle("open"));
      }
      
      // Button handlers
      if (yesBtn) {
        yesBtn.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          swipeRight(card);
        };
      }
      
      if (noBtn) {
        noBtn.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          swipeLeft(card);
        };
      }
      
      if (favBtn) {
        favBtn.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          swipeUp(card);
        };
      }
    });
    
    // Previous button functionality
    const prevBtn = document.getElementById('prevBtn');
    const removedCards = [];
    
    if (prevBtn) {
      prevBtn.onclick = function(e) {
        e.preventDefault();
        if (removedCards.length === 0) return; // no card to bring back
        
        const card = removedCards.pop();
        
        // Remove "no more" card if present
        const noMoreCard = container.querySelector('.no-more');
        if (noMoreCard) container.removeChild(noMoreCard);
        
        card.style.transition = 'none';
        card.style.transform = 'translateX(0) rotate(0)';
        card.style.opacity = '1';
        card.classList.remove('open'); // reset open details if any
        container.appendChild(card); // bring card back
        
        // reorder cards so the new one is on top
        Array.from(container.querySelectorAll('.card')).forEach(c => container.appendChild(c));
        console.log('Card brought back');
      };
    }
    
    // Modify removeCard function to store removed cards
    const originalRemoveCard = removeCard;
    removeCard = function(card) {
      const container = document.getElementById('card-container');
      if (container && card.parentNode === container) {
        card.style.transition = '';
        card.style.transform = '';
        card.style.opacity = 1;
        container.removeChild(card);
        removedCards.push(card); // store removed card
        console.log('Card removed and stored');
        
        // Check if no more cards
        const remainingCards = container.querySelectorAll('.card');
        if (remainingCards.length === 0) {
          const noMore = document.createElement('div');
          noMore.className = 'card no-more';
          noMore.innerHTML = '<h2>No more food cards left 🍽️</h2>';
          container.appendChild(noMore);
          console.log('No more cards message added');
        }
      }
    };
    
    console.log('Meal swipe initialized successfully');
    
  } catch (error) {
    console.error('Error initializing meal swipe:', error);
  }
}

function swipeLeft(card) {
  console.log('Swiping left');
  card.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  card.style.transform = "translateX(-350px) rotate(-15deg)";
  card.style.opacity = 0;
  setTimeout(() => removeCard(card), 500);
}

function swipeRight(card) {
  console.log('Swiping right');
  card.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  card.style.transform = "translateX(350px) rotate(15deg)";
  card.style.opacity = 0;
  
  // Trigger popup
  const popup = document.getElementById('popupitemsfod2');
  const overlay = document.querySelector('.overlayss');
  if (popup && overlay) {
    popup.classList.add('active');
    overlay.classList.add('active');
    console.log('Popup triggered');
  }
  
  setTimeout(() => removeCard(card), 500);
}

function swipeUp(card) {
  console.log('Swiping up');
  card.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  card.style.transform = "translateY(-500px) rotate(-5deg)";
  card.style.opacity = 0;
  setTimeout(() => removeCard(card), 500);
}

let removeCard = function(card) {
  const container = document.getElementById('card-container');
  if (container && card.parentNode === container) {
    card.style.transition = '';
    card.style.transform = '';
    card.style.opacity = 1;
    container.removeChild(card);
    console.log('Card removed');
    
    // Check if no more cards
    const remainingCards = container.querySelectorAll('.card');
    if (remainingCards.length === 0) {
      const noMore = document.createElement('div');
      noMore.className = 'card no-more';
      noMore.innerHTML = '<h2>No more food cards left 🍽️</h2>';
      container.appendChild(noMore);
      console.log('No more cards message added');
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMealSwipe);
} else {
  initMealSwipe();
}

// Also try to initialize when the activities page becomes active
const activitiesPage = document.getElementById('activities_page');
if (activitiesPage) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        if (activitiesPage.classList.contains('active')) {
          console.log('Activities page became active, reinitializing meal swipe');
          setTimeout(initMealSwipe, 100); // Small delay to ensure elements are ready
        }
      }
    });
  });
  
  observer.observe(activitiesPage, { attributes: true });
} 