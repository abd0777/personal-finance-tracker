const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed CORS origins (update as needed)
const allowedOrigins = [
  "https://personal-finance-tracker-dgoitx7cv-abduls-projects-c389ef07.vercel.app",
  "https://personal-finance-tracker-pearl-theta.vercel.app",
  "https://personal-finance-tracker-three-black.vercel.app",
  "https://personal-finance-tracker-git-main-abduls-projects-c389ef07.vercel.app",
  "https://personal-finance-tracker-m3lj4v9sg-abduls-projects-c389ef07.vercel.app"
];

// ✅ CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Not allowed by server'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Load Transaction model
const Transaction = require('./models/Transaction');

// ✅ API Routes

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const txs = await Transaction.find();
    res.json(txs);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching transactions' });
  }
});

// Create new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const tx = await Transaction.create(req.body);
    res.status(201).json(tx);
  } catch (error) {
    res.status(400).json({ error: 'Invalid transaction data' });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

// ✅ Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
