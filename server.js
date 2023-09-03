const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  // Read the notes from the db.json file and send them as JSON
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8'));

  // Generate a unique ID for the new note (you can use a package like 'uuid' for this)
  newNote.id = generateUniqueId();

  // Add the new note to the array of notes
  notes.push(newNote);

  // Write the updated notes back to the db.json file
  fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2));

  res.json(newNote);
});

// Bonus: Delete Route
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8'));

  // Find the index of the note with the given id
  const noteIndex = notes.findIndex((note) => note.id === noteId);

  if (noteIndex !== -1) {
    // Remove the note from the array
    notes.splice(noteIndex, 1);

    // Write the updated notes back to the db.json file
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2));

    res.sendStatus(204); // No Content
  } else {
    res.sendStatus(404); // Not Found
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Function to generate a unique ID (for example, using the 'uuid' package)
function generateUniqueId() {
  // Implement your logic to generate a unique ID here
}
