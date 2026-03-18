document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('distributorForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const companyName = document.getElementById('companyName').value;
            const region = document.getElementById('region').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const submitBtn = form.querySelector('.form-submit');

            // UI Feedback
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Send data via Web3Forms (no backend needed)
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: 'ac9cd8de-b3de-413e-a716-99d851070bae',
                        subject: 'New Distributor Application - RDA Vedanta',
                        from_name: 'RDA Vedanta Website',
                        Company_Name: companyName,
                        Region: region,
                        Phone_Number: phoneNumber
                    })
                });

                const result = await response.json();

                if (result.success) {
                    alert('✅ Thank you! Your application has been submitted successfully. Our team will contact you within 24 hours.');
                    form.reset();
                } else {
                    alert('❌ Something went wrong. Please try again or contact us directly.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('❌ Network error. Please check your internet connection and try again.');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
