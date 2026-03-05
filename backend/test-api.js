async function runTest() {
    try {
        const res = await fetch('http://localhost:3000/api/distributors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                companyName: 'API Test',
                region: 'Andhra Pradesh',
                phoneNumber: '9876543210'
            })
        });
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Response:', text);
    } catch (e) {
        console.error('Fetch error:', e);
    }
}
runTest();
