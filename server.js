const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

app.use(bodyParser.json());

// Utility functions
function readUsers() {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const users = readUsers();

    if (users.find(user => user.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    users.push({ username, email, password });
    writeUsers(users);
    res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
