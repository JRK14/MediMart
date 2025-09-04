const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001; //

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle all routes by sending the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Also try http://127.0.0.1:${PORT}/`);
});

