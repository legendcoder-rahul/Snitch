import express from 'express';
import dotenv from 'dotenv';
import connectToDB from './src/config/database.js';
dotenv.config();

const app = express();

connectToDB()

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Snitch API' });
});

// Start Server

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
