



  document.addEventListener("click", function(event) {
    if (event.target.closest(".triggersubsel")) {
        let triggersubsel = event.target.closest(".triggersubsel");
        let targetContent = triggersubsel.getAttribute("data-target");
        let contentDiv = document.querySelector(`.content[data-content='${targetContent}']`);
        let arrowsubsel = triggersubsel.querySelector(".arrowsubsel");

        // Close all open contents first
        document.querySelectorAll(".content.active").forEach(content => {
            if (content !== contentDiv) {
                content.classList.remove("active");
                content.previousElementSibling.querySelector(".arrowsubsel").classList.remove("rotate");
            }
        });

        // Toggle the clicked one
        contentDiv.classList.toggle("active");
        arrowsubsel.classList.toggle("rotate");
    }
});





document.addEventListener('DOMContentLoaded', () => {
    const contents = document.querySelectorAll('.contentact');
    const tabs = document.querySelectorAll('.tab');
    const loader = document.getElementById('loader');
    const backButton = document.querySelector('.backbutnforconts');
    let historyStack = [];

    // Restore history stack from localStorage
    const storedHistory = localStorage.getItem('historyStack');
    if (storedHistory) {
        try {
            const parsed = JSON.parse(storedHistory);
            historyStack = parsed.filter(id => document.getElementById(id));
        } catch {
            historyStack = [];
        }
    }

    // Restore last active content
    const lastcontentactId = localStorage.getItem('contentact');
    if (lastcontentactId) {
        const lastContent = document.getElementById(lastcontentactId);
        if (lastContent) {
            contents.forEach(c => c.classList.remove('active'));
            lastContent.classList.add('active');

            // Restore active tab too
            tabs.forEach(tab => {
                if (tab.getAttribute('data-target') === lastcontentactId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        }
    } else {
        // Default to first content
        if (contents[0]) {
            contents[0].classList.add('active');
            localStorage.setItem('contentact', contents[0].id);

            // Default to first tab
            tabs[0]?.classList.add('active');
        }
    }

    // Handle tab clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            const currentActive = document.querySelector('.contentact.active');

            if (!targetContent || targetContent === currentActive) return;

            // Push current to history
            if (currentActive) {
                historyStack.push(currentActive.id);
                localStorage.setItem('historyStack', JSON.stringify(historyStack));
            }

            // Save current content ID
            localStorage.setItem('contentact', targetId);

            // Update tab classes
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Animate out current
            if (currentActive) {
                currentActive.classList.remove('active');
                currentActive.classList.add('exit');
                setTimeout(() => currentActive.classList.remove('exit'), 700);
            }

            // Show loader
            loader.style.display = 'block';

            setTimeout(() => {
                loader.style.display = 'none';
                contents.forEach(c => c.classList.remove('active'));
                targetContent.classList.add('active');
            }, 1000);
        });
    });

    // Handle back button
    backButton.addEventListener('click', () => {
        if (historyStack.length === 0) return;

        const previousId = historyStack.pop();
        const previousContent = document.getElementById(previousId);
        const currentActive = document.querySelector('.contentact.active');

        if (!previousContent) return;

        // Save updated history and content
        localStorage.setItem('historyStack', JSON.stringify(historyStack));
        localStorage.setItem('contentact', previousId);

        // Animate out current
        if (currentActive) {
            currentActive.classList.remove('active');
            currentActive.classList.add('exit');
            setTimeout(() => currentActive.classList.remove('exit'), 700);
        }

        // Show loader
        loader.style.display = 'block';

        setTimeout(() => {
            loader.style.display = 'none';
            contents.forEach(c => c.classList.remove('active'));
            previousContent.classList.add('active');

            // Update tabs to match
            tabs.forEach(tab => {
                if (tab.getAttribute('data-target') === previousId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        }, 1000);
    });
});





  








function handleIntersection(entries, observer) {
    let delay = 0;
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            delay += 100; // Delay each div's animation
        } else {
            entry.target.classList.remove('visible');
        }
    });
}

const observer = new IntersectionObserver(handleIntersection, { threshold: 0.2 });
document.querySelectorAll('.divslide').forEach(div => observer.observe(div));




document.addEventListener("DOMContentLoaded", () => {
    const barwelsales = document.querySelectorAll(".barwelsales");
    
    // Adjust max height based on screen size
    const maxHeight = window.innerHeight <= 700 ? 200 : 400;

    const maxValue = Math.max(...Array.from(barwelsales).map(bar => parseInt(bar.textContent)));

    barwelsales.forEach((bar, index) => {
        let value = parseInt(bar.textContent);
        let barHeight = (value / maxValue) * maxHeight;
        bar.style.height = "0px";
        setTimeout(() => {
            bar.style.height = `${barHeight}px`;
        }, index * 200);
    });
});






document.addEventListener("DOMContentLoaded", function () {
    let toggleElements = document.querySelectorAll(".toggleactivestatus");
    let overlayElements = document.querySelectorAll(".overlaytoggle");

    // Load states from localStorage
    let savedStates = JSON.parse(localStorage.getItem("toggleStates")) || [];

    toggleElements.forEach((toggle, index) => {
        let currentState = savedStates[index] || "inactive"; // Default to inactive
        toggle.setAttribute("data-state", currentState);

        if (overlayElements[index]) {
            overlayElements[index].style.display = currentState === "inactive" ? "block" : "none";
        }

        toggle.addEventListener("click", function () {
            let isActive = this.getAttribute("data-state") === "active";
            let newState = isActive ? "inactive" : "active";

            this.setAttribute("data-state", newState);
            savedStates[index] = newState;
            localStorage.setItem("toggleStates", JSON.stringify(savedStates));

            if (overlayElements[index]) {
                overlayElements[index].style.display = newState === "inactive" ? "block" : "none";
            }
        });
    });
});





document.addEventListener("click", function(event) {
  if (event.target.classList.contains("delete-btnproduct")) {
      const parentDiv = event.target.closest(".prodonetoend");
      if (parentDiv) {
          parentDiv.remove();
      }
  }
});


document.querySelector(".search-inputproducs").addEventListener("input", function() {
  let searchValue = this.value.toLowerCase();
  let products = document.querySelectorAll(".prodlistvw");

  products.forEach(product => {
      let productID = product.querySelector(".products_id p").textContent.toLowerCase();
      product.style.display = productID.includes(searchValue) ? "grid" : "none";
  });
});

document.querySelector(".search-inputproducspropage").addEventListener("input", function() {
  let searchValue = this.value.toLowerCase().trim();
  let products = document.querySelectorAll(".prodonetoend.divslide");

  products.forEach(product => {
      let productIDElement = product.querySelector(".idprodu");
      if (productIDElement) {
          let productID = productIDElement.textContent.toLowerCase();
          product.style.display = productID.includes(searchValue) ? "grid" : "none";
      } else {
          product.style.display = "none";
      }
  });
});

// Check localStorage and apply the previous state
if (localStorage.getItem('toggleState') === 'enabled') {
    document.body.classList.add('compactpro');
}

// Select all toggle buttons and attach event listeners
document.querySelectorAll('.toggle').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        document.body.classList.toggle('compactpro');

        // Save the state to localStorage
        if (document.body.classList.contains('compactpro')) {
            localStorage.setItem('toggleState', 'enabled');
        } else {
            localStorage.setItem('toggleState', 'disabled');
        }
    });
});



  document.querySelectorAll('.receivestatus').forEach((receivestatus, index) => {
    const statusText = document.querySelectorAll('.status-text')[index]; // Match the corresponding status-text
    const storageKey = `Accepted_${index}`; // Unique key for each pair

    // Load the saved state
    if (localStorage.getItem(storageKey) === 'true') {
        statusText.textContent = "Accepted";
        statusText.classList.add('received');
        receivestatus.textContent = "Accepted";
        receivestatus.classList.add('received');
    }

    // Click event
    receivestatus.addEventListener('click', function() {
        statusText.textContent = "Accepted";
        statusText.classList.add('received');
        receivestatus.textContent = "Accepted";
        receivestatus.classList.add('received');

        // Save the state
        localStorage.setItem(storageKey, 'true');
    });
});

// Reset button functionality
document.querySelector('.reset-btn').addEventListener('click', function() {
    localStorage.clear();
    location.reload(); // Reload page to reset all elements
});









document.addEventListener("DOMContentLoaded", function () {
  let title = document.querySelector(".title");
  let paragraph = document.querySelector(".paragraph");
  let popupproedit = document.querySelector(".popupproedit");
  let input = popupproedit.querySelector(".edit-input");
  let currentElement = null; // Track which element is being edited

  // Load saved text from localStorage
  if (localStorage.getItem("titleText")) title.textContent = localStorage.getItem("titleText");
  if (localStorage.getItem("paragraphText")) paragraph.textContent = localStorage.getItem("paragraphText");

  document.addEventListener("click", function (event) {
      let target = event.target;

      // Open popupproedit for h1 or p
      if (target.classList.contains("title") || target.classList.contains("edit-title")) {
          currentElement = title;
          input.value = title.textContent;
      } else if (target.classList.contains("paragraph") || target.classList.contains("edit-paragraph")) {
          currentElement = paragraph;
          input.value = paragraph.textContent;
      } else {
          return; // Do nothing if clicked outside
      }

      popupproedit.classList.add("active");
      input.focus();
  });

  

  // Save text when clicking Save button
  document.querySelector(".save").addEventListener("click", updateText);

  // Save text on Enter keypress
  document.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && popupproedit.classList.contains("active")) {
          updateText();
      }
  });

  function updateText() {
      if (currentElement && input.value.trim() !== "") {
          currentElement.textContent = input.value;
          let key = currentElement.classList.contains("title") ? "titleText" : "paragraphText";
          localStorage.setItem(key, input.value); // Save to localStorage
      }
      popupproedit.classList.remove("active");
  }
});















document.querySelector(".search-inputproduce").addEventListener("input", function() {
    let searchValue = this.value.toLowerCase();
    let products = document.querySelectorAll(".prodlistvw");
  
    products.forEach(product => {
        let productID = product.querySelector(".products_id p").textContent.toLowerCase();
        product.style.display = productID.includes(searchValue) ? "block" : "none";
    });
  });



   document.querySelectorAll('.navigation-linkformaps').forEach((link, index) => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                
                let maps = document.querySelectorAll('.map-container');
                
                // Close all maps first
                maps.forEach(map => {
                    if (map !== maps[index]) {
                        map.style.maxHeight = "0";
                    }
                });

                // Toggle the clicked map
                let targetMap = maps[index];
                targetMap.style.maxHeight = targetMap.style.maxHeight === "0px" || !targetMap.style.maxHeight ? "300px" : "0";
            });
        });

        // Add event listeners for close buttons
        document.querySelectorAll('.close-btnformaps').forEach((btn) => {
            btn.addEventListener('click', function () {
                this.parentElement.style.maxHeight = "0"; // Hide the parent map container
            });
        });


















        