const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { sequelize, User, Store, Rating } = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('dev'));

// ================= AUTH MIDDLEWARE =================
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

// ================= SYNC DB =================
sequelize.sync().then(() => console.log('✅ DB Synced'));

// ================= AUTH ROUTES =================
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    let finalRole = role;
    const totalUsers = await User.count();
    if (totalUsers === 0) finalRole = 'admin'; // first user is admin

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role: finalRole });
    res.json({ message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, role: user.role, user_id: user.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= ADMIN DASHBOARD =================
app.get('/admin/dashboard', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const totalUsers = await User.count();
  const totalStores = await Store.count();
  const totalRatings = await Rating.count();
  res.json({ totalUsers, totalStores, totalRatings });
});

app.get('/admin/users', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post('/admin/users', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/admin/users/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.json({ message: 'User deleted' });
});

// ================= STORE CRUD =================
app.post('/stores', authMiddleware, roleMiddleware('admin', 'store_owner'), async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    let finalOwnerId = owner_id;
    if (req.user.role === 'store_owner') {
      finalOwnerId = req.user.id;
    }
    const store = await Store.create({ name, email, address, owner_id: finalOwnerId });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= STORE UPDATE =================
app.put('/stores/:id', authMiddleware, roleMiddleware('admin', 'store_owner'), async (req, res) => {
  let store;
  if (req.user.role === 'store_owner') {
    store = await Store.findOne({ where: { id: req.params.id, owner_id: req.user.id } });
  } else {
    store = await Store.findByPk(req.params.id); // admin can edit any
  }
  if (!store) return res.status(403).json({ message: 'Forbidden' });
  await store.update(req.body);
  res.json(store);
});

// ================= STORE DELETE =================
app.delete('/stores/:id', authMiddleware, roleMiddleware('admin', 'store_owner'), async (req, res) => {
  let store;
  if (req.user.role === 'store_owner') {
    store = await Store.findOne({ where: { id: req.params.id, owner_id: req.user.id } });
  } else {
    store = await Store.findByPk(req.params.id); // admin can delete any
  }
  if (!store) return res.status(403).json({ message: 'Forbidden' });
  await store.destroy();
  res.json({ message: 'Store deleted' });
});

app.get('/stores', authMiddleware, async (req, res) => {
  let where = {};
  if (req.user.role === 'store_owner') {
    where.owner_id = req.user.id;
  }
  const stores = await Store.findAll({
    where,
    include: [{ model: Rating, include: [User] }]
  });
  res.json(stores);
});

// ================= STORE OWNER DASHBOARD =================
app.get('/store/dashboard', authMiddleware, roleMiddleware('store_owner'), async (req, res) => {
  const stores = await Store.findAll({
    where: { owner_id: req.user.id },
    include: [{ model: Rating }]
  });

  const result = stores.map(s => {
    const ratings = s.Ratings.map(r => r.ratings);
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    return { ...s.toJSON(), avgRating };
  });

  res.json(result);
});

// ================= RATINGS =================
app.post('/ratings', authMiddleware, async (req, res) => {
  try {
    const { store_id, ratings } = req.body;
    if (!store_id || !ratings) return res.status(400).json({ message: 'store_id and ratings are required' });

    const store = await Store.findByPk(store_id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    let existingRating = await Rating.findOne({ where: { store_id, user_id: req.user.id } });
    if (existingRating) {
      existingRating.ratings = ratings;
      await existingRating.save();
      return res.json({ message: 'Rating updated', rating: existingRating });
    }

    const newRating = await Rating.create({ store_id, user_id: req.user.id, ratings });
    res.json({ message: 'Rating created', rating: newRating });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
