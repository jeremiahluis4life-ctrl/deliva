// Overlay functionality
window.addEventListener('load', function () {
    setTimeout(() => {
        const slidingDiv = document.querySelector('.overlay-sliddiv');
        const overlaysssld = document.querySelector('.overlaysssld');
        
        if (slidingDiv && overlaysssld) {
            slidingDiv.classList.add('active');
            overlaysssld.classList.add('active');
        }
    }, 500);
});

// Event delegation for close functionality
document.addEventListener('click', function (e) {
    const slidingDiv = document.querySelector('.overlay-sliddiv');
    const overlaysssld = document.querySelector('.overlaysssld');

    // Close when clicking the close button
    if (e.target.classList.contains('closebtnslidover')) {
        if (slidingDiv && overlaysssld) {
            slidingDiv.classList.remove('active');
            overlaysssld.classList.remove('active');
        }
    }

    // Close when clicking on the overlay
    if (e.target.classList.contains('overlaysssld')) {
        if (slidingDiv && overlaysssld) {
            slidingDiv.classList.remove('active');
            overlaysssld.classList.remove('active');
        }
    }
}); 