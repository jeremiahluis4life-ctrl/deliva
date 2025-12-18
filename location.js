// Location functionality
document.addEventListener('DOMContentLoaded', () => {
    const getLocationBtn = document.getElementById('getLocation');
    
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', function(event) {
            event.preventDefault();

            fetch("https://ipapi.co/json/")
                .then(response => response.json())
                .then(data => {
                    const locationOutput = document.getElementById('locationOutput');
                    if (locationOutput) {
                        locationOutput.innerText = `${data.city}, ${data.region}, ${data.country_name}`;
                    }
                })
                .catch(error => {
                    const locationOutput = document.getElementById('locationOutput');
                    if (locationOutput) {
                        locationOutput.innerText = "Error fetching location.";
                    }
                });
        });
    }
}); 