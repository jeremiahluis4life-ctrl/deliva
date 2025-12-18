document.addEventListener('DOMContentLoaded', () => {
  /* ─── your existing consts ─── */
  const contents     = document.querySelectorAll('.contentact');
  const loader       = document.getElementById('loader');
  const backButtons  = document.querySelectorAll('.backbutnforconts');
  const tabs         = document.querySelectorAll('.tab, .nav-btn.tab');
  let   historyStack = JSON.parse(localStorage.getItem('historyStack')) || [];

  /* keep track of the page we were on when the net died */
  let offlinePrev = null;
  const NO_INTERNET_ID = 'no-internet';

  /* ───  utilities ─── */
  const switchContent = targetId => {
    if (!targetId) return;
    
    if (loader) loader.style.display = 'block';

    const current = document.querySelector('.contentact.active');
    if (current) {
      current.classList.remove('active');
      current.classList.add('exit');
      setTimeout(() => current.classList.remove('exit'), 700);
    }

    setTimeout(() => {
      if (loader) loader.style.display = 'none';
      
      // Remove active from all contentact elements
      contents.forEach(c => c.classList.remove('active'));
      
      // Find and activate the target element
      const next = document.getElementById(targetId);
      if (next) {
        next.classList.add('active');
        localStorage.setItem('contentact', targetId);
      }
    }, 1000);
  };

  /* fallback screen */
  const showNoInternet = () => {
    offlinePrev = document.querySelector('.contentact.active')?.id ?? null;
    switchContent(NO_INTERNET_ID);
    tabs.forEach(tab => tab.classList.remove('active'));
  };

  /* ─── first‑run logic ─── */
  const lastcontentactId = localStorage.getItem('contentact');
  
  // Check if any contentact already has active class (like main_page)
  const alreadyActive = document.querySelector('.contentact.active');
  console.log('Already active content:', alreadyActive?.id);
  console.log('Last contentact from localStorage:', lastcontentactId);
  
  // If main_page is active in HTML, clear localStorage and keep it that way
  if (alreadyActive && alreadyActive.id === 'main_page') {
    console.log('Main page is active, clearing localStorage and keeping it active');
    localStorage.removeItem('contentact');
    localStorage.removeItem('historyStack');
  } else if (lastcontentactId && lastcontentactId !== 'main_page') {
    console.log('Switching to saved content:', lastcontentactId);
    switchContent(lastcontentactId);
  } else {
    console.log('No saved content, ensuring main_page is active');
    // Ensure main_page is active
    contents.forEach(c => c.classList.remove('active'));
    const mainPage = document.getElementById('main_page');
    if (mainPage) {
      mainPage.classList.add('active');
    }
  }

  /* ─── connection listeners ─── */
  if (!navigator.onLine) showNoInternet();
  window.addEventListener('offline', showNoInternet);

  window.addEventListener('online', () => {
    const noInternetElement = document.getElementById(NO_INTERNET_ID);
    if (noInternetElement && noInternetElement.classList.contains('active')) {
      switchContent(offlinePrev || lastcontentactId);
      offlinePrev = null;
    }
  });

  /* ─── intercept link / button clicks while offline ─── */
  document.addEventListener('click', e => {
    if (navigator.onLine) return;

    const target = e.target.closest('a, button');
    if (target) {
      e.preventDefault();
      showNoInternet();
    }
  });

  /* ─── tab click handler ─── */
  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      const targetId = tab.dataset.target;

      const current = document.querySelector('.contentact.active');
      if (current) {
        historyStack.push(current.id);
      }
      localStorage.setItem('historyStack', JSON.stringify(historyStack));

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      switchContent(targetId);
    });
  });

  /* === CLOSE *ALL* POPUPS WHEN #order-complete BECOMES ACTIVE === */
  (() => {
    const orderComplete = document.getElementById('order-complete');
    if (!orderComplete) return;

    const closeAllPopups = () => {
      document.querySelectorAll('.popupitemsfod.active')
              .forEach(p => p.classList.remove('active'));
      document.querySelector('.overlayss')?.classList.remove('active');

      document.querySelectorAll('.unique-popup')
              .forEach(p => {
                p.classList.remove('popup-visible');
                p.style.display = 'none';
              });
    };

    if (orderComplete.classList.contains('active')) closeAllPopups();

    new MutationObserver(() => {
      if (orderComplete.classList.contains('active')) closeAllPopups();
    }).observe(orderComplete, { attributes: true, attributeFilter: ['class'] });
  })();

  /* ─── back button handler ─── */
  backButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const noInternetElement = document.getElementById(NO_INTERNET_ID);
      if (noInternetElement && noInternetElement.classList.contains('active') && offlinePrev) {
        switchContent(offlinePrev);
        offlinePrev = null;
        return;
      }

      if (historyStack.length) {
        const prevId = historyStack.pop();
        localStorage.setItem('historyStack', JSON.stringify(historyStack));
        tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.target === prevId));
        switchContent(prevId);
      }
    });
  });

  /* ─── Sidebar functionality ─── */
  const leftLinks = document.querySelectorAll('.left-link');
  const rightLinks = document.querySelectorAll('.right-link');
  const leftSidebar = document.querySelector('.left-sidebar');
  const rightSidebar = document.querySelector('.right-sidebar');
  const overlays = document.querySelectorAll('.overlay');
  const closeButtons = document.querySelectorAll('.close-btn');

  function openSidebar(sidebar, overlay) {
    if (sidebar && overlay) {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    }
  }

  function closeSidebar(sidebar, overlay) {
    if (sidebar && overlay) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    }
  }

  leftLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (leftSidebar && overlays[0]) {
        openSidebar(leftSidebar, overlays[0]);
      }
    });
  });

  rightLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (rightSidebar && overlays[1]) {
        openSidebar(rightSidebar, overlays[1]);
      }
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (leftSidebar && overlays[0]) closeSidebar(leftSidebar, overlays[0]);
      if (rightSidebar && overlays[1]) closeSidebar(rightSidebar, overlays[1]);
    });
  });

  overlays.forEach((overlay, index) => {
    overlay.addEventListener('click', () => {
      if (index === 0 && leftSidebar) {
        closeSidebar(leftSidebar, overlay);
      } else if (index === 1 && rightSidebar) {
        closeSidebar(rightSidebar, overlay);
      }
    });
  });

  /* ─── Content-box and Order-box links ─── */
  document.querySelectorAll('.link-content-box').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.link-content-box').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.content-box').forEach(box => box.classList.remove('active'));
      link.classList.add('active');
      const targetClass = link.getAttribute('data-target');
      const targetBox = document.querySelector(`.content-box.${targetClass}`);
      if (targetBox) targetBox.classList.add('active');
    });
  });

  document.querySelectorAll('.link-order-box').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.link-order-box').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.order-box').forEach(box => box.classList.remove('active'));
      link.classList.add('active');
      const targetClass = link.getAttribute('data-target');
      const targetBox = document.querySelector(`.order-box.${targetClass}`);
      if (targetBox) targetBox.classList.add('active');
    });
  });

  /* ─── Popup functionality ─── */
  const triggers = document.querySelectorAll('.trigger');
  const popupitemsfods = document.querySelectorAll('.popupitemsfod');
  const overlayss = document.querySelector('.overlayss');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-target');
      const targetPopup = document.getElementById(targetId);

      if (targetPopup && overlayss) {
        targetPopup.classList.add('active');
        overlayss.classList.add('active');
      }
    });
  });

  if (overlayss) {
    overlayss.addEventListener('click', () => {
      popupitemsfods.forEach(popup => popup.classList.remove('active'));
      overlayss.classList.remove('active');
    });
  }

  const closeButtonsPopup = document.querySelectorAll('.close, .close1, .close2');
  closeButtonsPopup.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const popup = button.closest('.popupitemsfod');
      if (popup) popup.classList.remove('active');
      if (overlayss) overlayss.classList.remove('active');
    });
  });

  /* ─── Progress bars ─── */
  const maxItems = 10;
  document.querySelectorAll('.progress-bar').forEach((progressBar, index) => {
    let currentItems = 0;
    const progress = progressBar.querySelector('.progress');
    const cartInfo = document.querySelectorAll('#cart-info')[index];
    const addItemButton = document.querySelectorAll('#add-item')[index];
    const removeItemButton = document.querySelectorAll('#remove-item')[index];

    if (!progress || !cartInfo || !addItemButton || !removeItemButton) return;

    function updateCart() {
      const progressPercentage = (currentItems / maxItems) * 100;
      progress.style.width = `${progressPercentage}%`;
      cartInfo.textContent = `${currentItems}/${maxItems} Items`;
    }

    addItemButton.addEventListener('click', () => {
      if (currentItems < maxItems) {
        currentItems++;
        updateCart();
      }
    });

    removeItemButton.addEventListener('click', () => {
      if (currentItems > 0) {
        currentItems--;
        updateCart();
      }
    });

    updateCart();
  });

  /* ─── Intersection Observer for animations ─── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".fooditemss").forEach((item) => {
    observer.observe(item);
  });

  document.querySelectorAll(".toppsfoodsadd").forEach((box) => {
    observer.observe(box);
  });

  /* ─── Swipe functionality ─── */
  const boxes = document.querySelectorAll('.boxswipedel');
  boxes.forEach(box => {
    let startX;

    box.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    box.addEventListener('touchmove', (e) => {
      const touchX = e.touches[0].clientX;
      const deltaX = touchX - startX;

      if (deltaX < -50) {
        box.classList.add('swipe-out');
        setTimeout(() => box.remove(), 300);
      }
    });

    box.addEventListener('mousedown', (e) => {
      startX = e.clientX;
    });

    box.addEventListener('mousemove', (e) => {
      if (e.buttons !== 1) return;
      const deltaX = e.clientX - startX;

      if (deltaX < -50) {
        box.classList.add('swipe-out');
        setTimeout(() => box.remove(), 300);
      }
    });
  });

  /* ─── Slide up functionality ─── */
  const slideUpButton = document.getElementById('slideUpButton');
  const slideUpDiv = document.getElementById('slideUpDiv');
  const closeButton = document.querySelector('.close-btncclsfood');

  if (slideUpButton && slideUpDiv) {
    slideUpButton.addEventListener('click', () => {
      slideUpDiv.classList.add('active');
    });
  }

  if (closeButton && slideUpDiv) {
    closeButton.addEventListener('click', () => {
      slideUpDiv.classList.remove('active');
    });
  }

  /* ─── Multiple slide up buttons ─── */
  const slideUpButtons = document.querySelectorAll('.slideUpButton');
  const closeButtonsMultiple = document.querySelectorAll('.close-btncclsfoodgift');
  const slideUpDivMultiple = document.querySelector('.slideUpDiv');

  if (slideUpDivMultiple) {
    slideUpButtons.forEach(button => {
      button.addEventListener('click', () => {
        slideUpDivMultiple.classList.add('active');
      });
    });

    closeButtonsMultiple.forEach(button => {
      button.addEventListener('click', () => {
        slideUpDivMultiple.classList.remove('active');
      });
    });
  }

  /* ─── Flag dropdown ─── */
  const selectedFlag = document.getElementById('selected-flag');
  const selectedCode = document.getElementById('selected-code');
  const flagDropdown = document.getElementById('flag-dropdown');

  if (selectedFlag && flagDropdown) {
    selectedFlag.addEventListener('click', function() {
      flagDropdown.style.display = flagDropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', function() {
        const flag = item.getAttribute('data-flag');
        const countryCode = item.getAttribute('data-country-code');
        if (selectedFlag) selectedFlag.src = flag;
        if (selectedCode) selectedCode.textContent = countryCode;
        flagDropdown.style.display = 'none';
      });
    });

    document.addEventListener('click', function(event) {
      if (!selectedFlag.contains(event.target) && !flagDropdown.contains(event.target)) {
        flagDropdown.style.display = 'none';
      }
    });
  }

  /* ─── Unique popup functionality ─── */
  const links = document.querySelectorAll('.unique-link');
  const popups = document.querySelectorAll('.unique-popup');

  links.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const popupClass = this.getAttribute('data-popup');
      const popup = document.querySelector(`.unique-popup.${popupClass}`);
      
      if (popup) {
        popup.style.display = 'block';
        requestAnimationFrame(() => {
          popup.classList.add('popup-visible');
        });
      }
    });
  });

  popups.forEach(popup => {
    const closeButton = popup.querySelector('.closeseldtcrd-popup');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        popup.classList.remove('popup-visible');
        setTimeout(() => {
          popup.style.display = 'none';
        }, 300);
      });
    }
  });

  /* ─── Order history ─── */
  const orderHistoryContainer = document.getElementById('orderHistory');
  if (orderHistoryContainer) {
    orderHistoryContainer.addEventListener('click', () => {
      orderHistoryContainer.classList.toggle('active');
    });
  }

  /* ─── Location functionality ─── */
  const getLocationBtn = document.getElementById('getLocation');
  if (getLocationBtn) {
    getLocationBtn.addEventListener('click', function(event) {
      event.preventDefault();
      const locationOutput = document.getElementById('locationOutput');
      
      if (locationOutput) {
        fetch("https://ipapi.co/json/")
          .then(response => response.json())
          .then(data => {
            locationOutput.innerText = `${data.city}, ${data.region}, ${data.country_name}`;
          })
          .catch(error => {
            locationOutput.innerText = "Error fetching location.";
          });
      }
    });
  }

  /* ─── Smooth slide up animations ─── */
  const smoothObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.smoothslideuup').forEach(el => {
    smoothObserver.observe(el);
  });

  /* ─── Link functionality ─── */
  document.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      document.querySelectorAll('.link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.content-box').forEach(box => box.classList.remove('active'));
      link.classList.add('active');
      const targetClass = link.getAttribute('data-target');
      const targetBox = document.querySelector(`.content-box.${targetClass}`);
      if (targetBox) targetBox.classList.add('active');
    });
  });
});

/* ─── Loader functionality ─── */
window.addEventListener('DOMContentLoaded', () => {
  const loaders = document.querySelectorAll('.loadeffect');
  loaders.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('loaded');
      el.classList.remove('loadeffect');
    }, 2000 + index * 300);
  });
});

/* ─── Asset preloading ─── */
const preloadAssets = () => {
  const links = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'your-important-image.jpg',
  ];

  links.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = src.endsWith('.css') ? 'style' : 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

const makeImagesLazy = () => {
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
};

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.style.display = 'none';
  makeImagesLazy();
});

preloadAssets();






























document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".fooditemss");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, index * 200); // Delay each item
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
    });

    items.forEach((item) => {
        observer.observe(item);
    });
});


document.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        
        // Remove active class from all links and boxes
        document.querySelectorAll('.link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.content-box').forEach(box => box.classList.remove('active'));
        
        // Add active class to the clicked link
        link.classList.add('active');
        
        // Get the target box using the unique class from data-target and show it
        const targetClass = link.getAttribute('data-target');
        document.querySelector(`.content-box.${targetClass}`).classList.add('active');
    });
});






const orderHistoryContainer = document.getElementById('orderHistory');

orderHistoryContainer.addEventListener('click', () => {
    orderHistoryContainer.classList.toggle('active');
});















document.getElementById('getLocation').addEventListener('click', function(event) {
    event.preventDefault();

    fetch("https://ipapi.co/json/")
    .then(response => response.json())
    .then(data => {
        document.getElementById('locationOutput').innerText = 
            `${data.city}, ${data.region}, ${data.country_name}`;
    })
    .catch(error => {
        document.getElementById('locationOutput').innerText = "Error fetching location.";
    });
});




document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll('.smoothslideuup');

    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        }
    });
    }, {
    threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
});



   






















