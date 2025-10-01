const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const USERS_FILE = './users.json';

app.use(bodyParser.json());
app.use(express.static('public')); // Serve HTML/JS

// Helper: load all users
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return {};
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Helper: save all users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Sign up
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  if (users[username]) return res.status(400).json({ error: 'User exists' });
  users[username] = { password, checkboxes: [] };
  saveUsers(users);
  res.json({ success: true });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  if (!users[username] || users[username].password !== password)
    return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true });
});

// Load checkboxes
app.post('/load', (req, res) => {
  const { username } = req.body;
  const users = loadUsers();
  if (!users[username]) return res.status(404).json({ error: 'Not found' });
  res.json({ checkboxes: users[username].checkboxes });
});

// Save checkboxes
app.post('/save', (req, res) => {
  const { username, checkboxes } = req.body;
  const users = loadUsers();
  if (!users[username]) return res.status(404).json({ error: 'Not found' });
  users[username].checkboxes = checkboxes;
  saveUsers(users);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));