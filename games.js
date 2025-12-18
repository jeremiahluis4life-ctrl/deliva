

const balanceWrappers = document.querySelectorAll('.balancefromgames');
let isBlurred = false;

function updateAllBalances(blur) {
  balanceWrappers.forEach(wrapper => {
    const balance = wrapper.querySelector('span');
    const icon = wrapper.querySelector('i');

    balance.classList.toggle('blur', blur);
    icon.className = blur ? 'fas fa-eye-slash' : 'fas fa-eye';
  });
}

balanceWrappers.forEach(wrapper => {
  wrapper.addEventListener('click', () => {
    isBlurred = !isBlurred;
    updateAllBalances(isBlurred);
  });
});






document.querySelectorAll('.cylinder').forEach(cylinder => {
    cylinder.addEventListener('click', () => {
      cylinder.classList.toggle('open');
    });
  });











  (function () {
      const puzzleContainer = document.getElementById('puzzle-container');
      const previewImage = document.getElementById('preview-image');
      const overlay = document.getElementById('overlay');
      const prizePopup = document.getElementById('prize-popup');
      const images = [
          'img/foodim.webp',
          'img/fish_and_chips.jpeg',
          'img/market.jpeg'
      ];
  
      let puzzle = [];
      let emptyTileIndex = 8;
      let currentImageIndex = 0;
  
      function initPuzzle() {
          puzzle = [...Array(9).keys()];
          shufflePuzzle();
          renderPuzzle();
          updatePreviewImage();
      }
  
      function shufflePuzzle() {
          for (let i = puzzle.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [puzzle[i], puzzle[j]] = [puzzle[j], puzzle[i]];
          }
          emptyTileIndex = puzzle.indexOf(8);
      }
  
      function renderPuzzle() {
          puzzleContainer.innerHTML = '';
          puzzle.forEach((value, index) => {
              const piece = document.createElement('div');
              piece.className = 'puzzle-piece';
              if (value !== 8) {
                  piece.style.backgroundImage = `url("${images[currentImageIndex]}")`;
                  piece.style.backgroundPosition = `-${(value % 3) * 100}px -${Math.floor(value / 3) * 100}px`;
                  piece.addEventListener('click', () => movePiece(index));
              } else {
                  piece.classList.add('empty');
              }
              puzzleContainer.appendChild(piece);
          });
      }
  
      function movePiece(index) {
          const emptyX = emptyTileIndex % 3;
          const emptyY = Math.floor(emptyTileIndex / 3);
          const tileX = index % 3;
          const tileY = Math.floor(index / 3);
  
          if (Math.abs(emptyX - tileX) + Math.abs(emptyY - tileY) === 1) {
              [puzzle[emptyTileIndex], puzzle[index]] = [puzzle[index], puzzle[emptyTileIndex]];
              emptyTileIndex = index;
              renderPuzzle();
              checkWin();
          }
      }
  
      function checkWin() {
          if (puzzle.every((value, index) => value === index)) {
              showPopup();
          }
      }
  
      function showPopup() {
          overlay.style.display = 'flex';
          prizePopup.style.display = 'flex';
      }
  
      window.claimPrize = function () {
          overlay.style.display = 'none';
          prizePopup.style.display = 'none';
          alert("Prize claimed!");
          currentImageIndex = (currentImageIndex + 1) % images.length;
          initPuzzle();
      }
  
      function updatePreviewImage() {
          previewImage.style.backgroundImage = `url("${images[currentImageIndex]}")`;
      }

      const shuffleButton = document.querySelector('.shuffle_btn');
          if (shuffleButton) {
              shuffleButton.addEventListener('click', () => {
                  shufflePuzzle();
                  renderPuzzle();
              });
          }

  
      window.addEventListener('load', initPuzzle);
  })();
  




















      document.getElementById('spin-button').addEventListener('click', function () {
    const wheel = document.querySelector('.wheel');
    const segments = document.querySelectorAll('.segment');
    const numberOfSegments = segments.length; // Works with 8 segments now
    const segmentSize = 360 / numberOfSegments;
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = randomDegree + 360 * 20;

    // Rotate the wheel
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    wheel.classList.add('spinning');

    // Find final angle
    const finalDegree = totalRotation % 360;

    // Determine selected segment
    const segmentIndex = Math.floor((360 - finalDegree + segmentSize / 2) % 360 / segmentSize);
    const selectedSegment = segments[segmentIndex];

    const resultText = document.getElementById('result-text');
    const claimNotification = document.getElementById('claim-notification');
    const claimText = document.getElementById('claim-text');

    wheel.addEventListener('transitionend', function () {
        wheel.classList.remove('spinning');
        // Update result text and claim notification with innerHTML
        resultText.innerHTML = `<strong>${selectedSegment.textContent}</strong>`;
        claimText.innerHTML = `Claim <div class="tomorrowfontss">${selectedSegment.textContent}</div>`;

        // Show the notification
        claimNotification.classList.add('show');
    }, { once: true });
}); 







    const tabsfavside = document.querySelectorAll('.fav-tab');
    const groups = document.querySelectorAll('.group');
    const cards = document.querySelectorAll('.fav-card');

    tabsfavside.forEach(tab => {
      tab.addEventListener('click', () => {
        tabsfavside.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        groups.forEach(g => {
          g.classList.remove('active');
          if (g.classList.contains(tab.dataset.group)) {
            g.classList.add('active');
          }
        });
      });
    });

    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => {
          if (c !== card) {
            c.classList.remove('expanded');
          }
        });
        card.classList.toggle('expanded');
      });
    });



                // Tab switcher
    document.querySelectorAll('.status-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.status-group').forEach(g => g.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tab.getAttribute('aria-controls')).classList.add('active');
      });
    });

    // Toggle slide-out receipt per card
    document.querySelectorAll('.transaction-card').forEach(card => {
      card.addEventListener('click', () => {
        // close other cards
        document.querySelectorAll('.transaction-card.open').forEach(openCard => {
          if (openCard !== card) openCard.classList.remove('open');
        });
        card.classList.toggle('open');
      });
    });








  document.querySelectorAll('.rating').forEach(ratingBlock => {
    const stars = ratingBlock.querySelectorAll('.star');

    stars.forEach((star) => {
      star.addEventListener('click', () => {
        const rating = star.getAttribute('data-value');

        stars.forEach(s => {
          s.classList.remove('active');
          if (s.getAttribute('data-value') <= rating) {
            s.classList.add('active');
          }
        });
      });
    });
  });




  document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.headerprofside');
  const container = document.querySelector('.forhshsh');

  if (header && container) {
    container.addEventListener('scroll', () => {
      if (container.scrollTop > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
});





  