// Password toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.querySelector('.togglePassword');
    const password = document.querySelector('.password');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function () {
            // Toggle the type attribute
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);

            // Change the icon based on the input type
            if (type === 'password') {
                this.innerHTML = '<i class="fas fa-eye"></i>'; // Show eye icon
            } else {
                this.innerHTML = '<i class="fas fa-eye-slash"></i>'; // Slashed eye icon
            }
        });
    }
}); 