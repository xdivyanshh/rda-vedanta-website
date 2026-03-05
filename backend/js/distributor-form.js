document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('distributorForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the default page reload

            // Get values from the form
            const companyName = document.getElementById('companyName').value;
            const region = document.getElementById('region').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const submitBtn = form.querySelector('.form-submit');

            // UI Feedback
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = {
                companyName,
                region,
                phoneNumber
            };

            try {
                // Send data to the Node.js backend
                const response = await fetch('http://localhost:3000/api/distributors', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Success: ' + result.message);
                    form.reset(); // Clear the form
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Failed to connect to the server. Please ensure the backend is running.');
            } finally {
                // Reset button
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
