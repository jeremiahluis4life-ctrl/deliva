// Sidebar functionality
const sidebar = document.getElementById('sidebar');
const closeBtns = document.querySelectorAll('.close-btnnn'); // Now selects all close buttons
const menuBtn = document.getElementById('menu-btn');

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        } else {
            sidebar.classList.toggle('collapsed');
            adjustGrid();
        }
    });
});

menuBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
});

function adjustGrid() {
    if (sidebar.classList.contains('collapsed')) {
        document.querySelector('.container').style.gridTemplateColumns = '150px 1fr';
    } else {
        document.querySelector('.container').style.gridTemplateColumns = '280px 1fr';
    }
}

function handleResize() {
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('collapsed');
        document.querySelector('.container').style.gridTemplateColumns = '1fr';
    } else {
        adjustGrid();
    }
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);

function initializeDiv() {
    const div = document.getElementById('myDiv');
    if (window.innerWidth <= 768) {
        div.classList.add('show');
    } else {
        div.classList.remove('show');
    }
}

initializeDiv();
window.addEventListener('resize', initializeDiv);
