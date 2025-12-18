// Sliding div functionality
document.addEventListener("DOMContentLoaded", () => {
    const slidingDiv = document.getElementById('slidingDiv');
    if (!slidingDiv) return;
    
    const header = slidingDiv.querySelector('.header');
    if (!header) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const getCurrentTranslateY = () => {
        const transform = window.getComputedStyle(slidingDiv).transform;
        return transform !== 'none' ? parseFloat(transform.split(',')[5]) : 0;
    };

    const setPosition = (y) => {
        slidingDiv.style.transform = `translateY(${y}px)`;
    };

    const handleRelease = (startY, endY) => {
        const direction = endY - startY;
        const threshold = window.innerHeight * 0.15;
        const isExpanding = direction < -threshold;
        const isCollapsing = direction > threshold;

        if (isExpanding) {
            slidingDiv.style.transform = 'translateY(0)';
            slidingDiv.classList.add('expanded');
            slidingDiv.classList.remove('collapsed');
        } else if (isCollapsing) {
            slidingDiv.style.transform = 'translateY(calc(100% - 130px))';
            slidingDiv.classList.add('collapsed');
            slidingDiv.classList.remove('expanded');
        } else {
            const currentTranslateY = getCurrentTranslateY();
            if (currentTranslateY < window.innerHeight / 2) {
                slidingDiv.style.transform = 'translateY(0)';
                slidingDiv.classList.add('expanded');
                slidingDiv.classList.remove('collapsed');
            } else {
                slidingDiv.style.transform = 'translateY(calc(100% - 130px))';
                slidingDiv.classList.add('collapsed');
                slidingDiv.classList.remove('expanded');
            }
        }
    };

    // Mouse events
    const onMouseDown = (e) => {
        isDragging = true;
        startY = e.clientY;
        currentY = getCurrentTranslateY();
        header.style.cursor = 'grabbing';

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        const deltaY = e.clientY - startY;
        let newY = currentY + deltaY;
        newY = Math.max(-window.innerHeight * 0.55, Math.min(newY, 0));
        setPosition(newY);
    };

    const onMouseUp = (e) => {
        if (!isDragging) return;
        isDragging = false;
        header.style.cursor = 'grab';
        handleRelease(startY, e.clientY);

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    // Touch events
    const onTouchStart = (e) => {
        isDragging = true;
        startY = e.touches[0].clientY;
        currentY = getCurrentTranslateY();

        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    };

    const onTouchMove = (e) => {
        if (!isDragging) return;
        e.preventDefault(); // stop scrolling
        const deltaY = e.touches[0].clientY - startY;
        let newY = currentY + deltaY;
        newY = Math.max(-window.innerHeight * 0.55, Math.min(newY, 0));
        setPosition(newY);
    };

    const onTouchEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        handleRelease(startY, e.changedTouches[0].clientY);

        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    };

    // Attach event listeners
    header.addEventListener('mousedown', onMouseDown);
    header.addEventListener('touchstart', onTouchStart);
}); 