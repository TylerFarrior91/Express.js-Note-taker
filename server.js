const express = require('express');
const { readFromFile,
    readAndAppend,
    readAndDelete } = require("./utils/helpers")
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// Serve static files from the 'public' directory
app.use(express.static('public'));

// HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    // Generate a unique ID for the new note (you can use a package like 'uuid' for this)
    // Function to generate a unique ID (for example, using the 'uuid' package)
    newNote.id = Math.floor(Math.random() * 100000000000)
    
    readAndAppend(newNote, "./db/db.json")
    res.json(newNote)
});

// Bonus: Delete Route
app.delete('/api/notes/:id', (req, res) => {
    readAndDelete(req.params.id, "./db/db.json")
    res.json({ok: true})
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});