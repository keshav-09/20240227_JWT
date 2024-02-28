// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create Express application
const app = express();
const port = 3000;

// Connect to MongoDB database
// mongoose.connect('mongodb+srv://shubham:12345@cluster0.ir13lqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect('mongodb+srv://root:root@cluster0.y04qx.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User schema
const userSchema = new mongoose.Schema({
  userId: String,
  password: String,
  personName: String,
  city: String,
});

// Create User model from the schema
const User = mongoose.model('User', userSchema);

// Middleware to parse JSON request bodies
app.use(express.json());

// POST endpoint for user authentication
app.post('/login', async (req, res) => {
  // Extract userId and password from request body
  const { userId, password } = req.body;

  try {
    // Find user by userId in the database
    const user = await User.findOne({ userId });

    // If user not found, return error
    if (!user) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    // Compare password from request with hashed password stored in the database
    if (password === user.password) { // Note: For security reasons, it's recommended to use bcrypt for password comparison
      // If passwords match, generate JWT token
      const token = jwt.sign({ userId: user.userId }, "your-secret-key", { expiresIn: '1h' });

      // Send the token in the response
      res.json({ token });
    } else {
      // If passwords don't match, return error
      res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    // If an error occurs, return internal server error
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
