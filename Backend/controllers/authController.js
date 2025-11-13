const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(' Login attempt for username:', username);

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    
    const user = await User.findOne({ username: username }).select('+password');
    
    if (!user) {
      console.log(' User not found:', username);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    console.log(' User found:', user.username);

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log(' Invalid password for user:', username);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    const token = generateToken(user._id);

    console.log(' Login successful for user:', username);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        baseId: user.baseId
      }
    });
  } catch (error) {
    console.error(' Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password, role, baseId } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
      baseId
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        baseId: user.baseId
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { login, register, verifyToken };