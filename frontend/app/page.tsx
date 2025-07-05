"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

// ✅ Type for transaction
type Transaction = {
  _id: string;
  amount: string;
  date: string;
  description: string;
  category: string;
};

const categories = ["Food", "Transport", "Utilities", "Entertainment", "Other"];
const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState({
    amount: "",
    date: "",
    description: "",
    category: categories[0],
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await axios.get("http://localhost:5000/api/transactions");
    setTransactions(res.data);
  };

  const handleAdd = async () => {
    if (!form.amount || !form.date || !form.description) {
      alert("All fields required");
      return;
    }

    await axios.post("http://localhost:5000/api/transactions", form);
    setForm({ amount: "", date: "", description: "", category: categories[0] });
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/transactions/${id}`);
    fetchTransactions();
  };

  // ✅ Monthly data summary
  const monthData = transactions.reduce((acc: Record<string, number>, tx) => {
    const month = tx.date.slice(0, 7);
    acc[month] = (acc[month] || 0) + Number(tx.amount);
    return acc;
  }, {});

  // ✅ Category pie chart data
  const pieData = categories.map((cat) => ({
    name: cat,
    value: transactions
      .filter((t) => t.category === cat)
      .reduce((a, b) => a + Number(b.amount), 0),
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Personal Finance Tracker</h1>

      {/* Add Transaction */}
      <Card className="mb-4">
        <CardContent className="flex flex-col gap-2 p-4">
          <Input
            placeholder="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="border rounded p-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <Button onClick={handleAdd}>Add Transaction</Button>
        </CardContent>
      </Card>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 font-medium">
            Total: ₹{transactions.reduce((a, b) => a + Number(b.amount), 0)}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 font-medium">
            Most Recent: ₹{transactions[transactions.length - 1]?.amount || 0}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 font-medium">
            Total Entries: {transactions.length}
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <h2 className="text-xl font-semibold mb-2">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={Object.entries(monthData).map(([name, value]) => ({
            name,
            value,
          }))}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Pie Chart */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Category Breakdown</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {pieData.map((_, idx) => (
              <Cell key={idx} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Transaction List */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Transaction List</h2>
      <ul className="space-y-2">
        {transactions.map((t) => (
          <li key={t._id} className="flex justify-between border p-2 rounded">
            <span>
              {t.date} - ₹{t.amount} - {t.description} ({t.category})
            </span>
            <Button onClick={() => handleDelete(t._id)} variant="destructive">
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
