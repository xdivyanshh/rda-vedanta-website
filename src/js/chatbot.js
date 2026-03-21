document.addEventListener('DOMContentLoaded', () => {
    const chatbotWidget = document.getElementById('chatbotWidget');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotBody = document.getElementById('chatbotBody');
    const chatOptions = document.querySelectorAll('.chat-opt-btn');

    if (!chatbotWidget) return;

    chatbotToggle.addEventListener('click', () => {
        chatbotWidget.classList.toggle('active');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWidget.classList.remove('active');
    });

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;
        msgDiv.textContent = text;
        chatbotBody.appendChild(msgDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    const responses = {
        'price': "Our wire prices fluctuate daily based on the latest LME copper rates. I will redirect you to our Sales Team on WhatsApp to provide you with today's exact rate and any bulk discounts.",
        'distributor': "To become a distributor, you need a valid GST number and an initial bulk order capacity. Please use the WhatsApp button to connect directly with our ALL India Distribution Head.",
        'human': "Redirecting you to our Sales Team on WhatsApp..."
    };

    chatOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const replyType = btn.getAttribute('data-reply');
            
            // Render user message
            appendMessage(btn.textContent, 'user');
            
            // Hide options so they can only click once
            const optionsContainer = document.querySelector('.chat-options');
            if (optionsContainer) {
                optionsContainer.style.display = 'none';
            }

            // Simulate typing delay
            setTimeout(() => {
                appendMessage(responses[replyType], 'bot');
                
                // For all options right now, we offer a redirect to WhatsApp after a short delay since it's a B2B site
                setTimeout(() => {
                    window.open('https://wa.me/916392959815', '_blank');
                    // Reset widget state occasionally if needed
                }, 1800);
            }, 800);
        });
    });
});
