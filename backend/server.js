const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed CORS origins (replace with your actual frontend Vercel URL)
const allowedOrigins = [
  "https://your-frontend.vercel.app", // Replace this with your real frontend domain
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// ✅ Load Transaction model
const Transaction = require('./models/Transaction');

// ✅ API Routes

// GET all transactions
app.get('/api/transactions', async (req, res) => {
  const txs = await Transaction.find();
  res.json(txs);
});

// POST new transaction
app.post('/api/transactions', async (req, res) => {
  const tx = await Transaction.create(req.body);
  res.json(tx);
});

// DELETE transaction
app.delete('/api/transactions/:id', async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ✅ Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
