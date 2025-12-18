const themeToggler = document.querySelector(".theme-toggler");
const sunIcon = themeToggler.querySelector('.fa-sun');
const moonIcon = themeToggler.querySelector('.fa-moon');

// Load saved theme
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark-theme-variables") {
    document.body.classList.add("dark-theme-variables");
    sunIcon.classList.remove("active");
    moonIcon.classList.add("active");
} else {
    sunIcon.classList.add("active");
    moonIcon.classList.remove("active");
}

// Toggle theme on click
themeToggler.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme-variables");

    if (isDark) {
        localStorage.setItem("theme", "dark-theme-variables");
        sunIcon.classList.remove("active");
        moonIcon.classList.add("active");
    } else {
        localStorage.setItem("theme", "light-theme-variables");
        sunIcon.classList.add("active");
        moonIcon.classList.remove("active");
    }
});
// Add event listener for theme toggler