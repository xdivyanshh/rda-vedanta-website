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

    function appendMessage(text, sender, i18nKey = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;
        if (i18nKey) {
            msgDiv.setAttribute('data-i18n', i18nKey);
        }
        msgDiv.textContent = text;
        chatbotBody.appendChild(msgDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
        if (window.updateDOM) window.updateDOM();
    }

    const responses = {
        'price': {
            text: "Our wire prices fluctuate daily based on the latest LME copper rates. I will redirect you to our Sales Team on WhatsApp to provide you with today's exact rate and any bulk discounts.",
            key: "chat-bot-price"
        },
        'distributor': {
            text: "To become a distributor, you need a valid GST number and an initial bulk order capacity. Please use the WhatsApp button to connect directly with our ALL India Distribution Head.",
            key: "chat-bot-dist"
        },
        'human': {
            text: "Redirecting you to our Sales Team on WhatsApp...",
            key: "chat-bot-human"
        }
    };

    chatOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const replyType = btn.getAttribute('data-reply');
            
            const i18nKeyUser = btn.getAttribute('data-i18n'); // Carry over user's button key

            // Render user message
            appendMessage(btn.textContent, 'user', i18nKeyUser);
            
            // Hide options so they can only click once
            const optionsContainer = document.querySelector('.chat-options');
            if (optionsContainer) {
                optionsContainer.style.display = 'none';
            }

            // Simulate typing delay
            setTimeout(() => {
                const responseData = responses[replyType];
                appendMessage(responseData.text, 'bot', responseData.key);
                
                // Only redirect to WhatsApp when explicitly requested
                if (replyType === 'human') {
                    setTimeout(() => {
                        window.open('https://wa.me/916392959815', '_blank');
                    }, 1800);
                }
            }, 800);
        });
    });
});
