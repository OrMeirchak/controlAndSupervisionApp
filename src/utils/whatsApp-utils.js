export async function sendWhatsappFromClient(phoneNumber, message) {
    try {
        const response = await fetch('http://localhost:5000/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber, message })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Message sent:', result);
    } catch (error) {
        console.error('❌ Failed to send WhatsApp message:', error);
    }
}