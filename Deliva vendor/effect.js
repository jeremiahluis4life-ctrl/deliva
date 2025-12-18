// Preload fonts, icons, images
const preloadAssets = () => {
    const links = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'your-important-image.jpg', // add more if needed
    ];

    links.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = src.endsWith('.css') ? 'style' : 'image';
    link.href = src;
    document.head.appendChild(link);
    });
};

// Add lazy loading to all images that don't have it
const makeImagesLazy = () => {
    document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
    });
};

// Hide loader when page is fully ready
window.addEventListener('load', () => {
    document.getElementById('preloader').style.display = 'none';
    makeImagesLazy();
});

preloadAssets();