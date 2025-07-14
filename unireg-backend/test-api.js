const axios = require('axios');

// Test registration
async function testRegistration() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            email: 'test@student.com',
            password: 'password123',
            name: 'Test Student',
            university: 'University of Nairobi',
            role: 'student'
        });
        console.log('Registration Response:', response.data);
    } catch (error) {
        console.error('Registration Error:', error.response?.data || error.message);
    }
}

// Test login
async function testLogin() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@student.com',
            password: 'password123'
        });
        console.log('Login Response:', response.data);
        return response.data.token;
    } catch (error) {
        console.error('Login Error:', error.response?.data || error.message);
        return null;
    }
}

// Test application submission
async function testApplication(token) {
    if (!token) return;

    try {
        const response = await axios.post(
            'http://localhost:5000/api/applications',
            {
                firstName: 'Test',
                lastName: 'Student',
                email: 'test@student.com',
                phone: '+254700000000',
                university: 'University of Nairobi',
                program: 'Computer Science',
                kcseIndex: '123456789',
                kcseYear: '2023'
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log('Application Response:', response.data);
    } catch (error) {
        console.error('Application Error:', error.response?.data || error.message);
    }
}

// Run tests
async function runTests() {
    await testRegistration();
    const token = await testLogin();
    await testApplication(token);
}

runTests();
