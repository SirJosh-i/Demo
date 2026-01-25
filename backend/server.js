const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Name Entry API is running' });
});

// Get all names
app.get('/api/names', async (req, res) => {
  try {
    const names = await db.getAllNames();
    res.json({ success: true, data: names });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a new name
app.post('/api/names', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const result = await db.insertName(name.trim());
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a name
app.delete('/api/names/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.deleteName(id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});