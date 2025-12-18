// Like button functionality
document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.like-button');

    likeButtons.forEach(button => {
        const id = button.dataset.id;
        const icon = button.querySelector('.heart-icon');
        let liked = JSON.parse(localStorage.getItem(`liked:${id}`)) || false;

        // Initial UI state
        updateUI();

        // Click event
        button.addEventListener('click', () => {
            liked = !liked;
            localStorage.setItem(`liked:${id}`, liked);
            updateUI();
            spawnHeart(button);
        });

        function updateUI() {
            button.classList.toggle("active", liked);
            icon.classList.toggle("fas", liked);
            icon.classList.toggle("far", !liked);
        }
    });
});

// Heart spawn animation function (if not already defined elsewhere)
function spawnHeart(button) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.fontSize = '20px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.animation = 'heartFloat 1s ease-out forwards';
    
    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + rect.width / 2 + 'px';
    heart.style.top = rect.top + 'px';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1000);
} 