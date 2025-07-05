const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
