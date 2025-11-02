/**
 * ExpensePage
 * ------------
 * Main application page for managing expenses.
 * Uses LocalStorage for persistent storage.
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../services/ExpenseService";
import backgroundImage from "../assets/background.jpg";

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);

  /**Load all expenses from LocalStorage */
  useEffect(() => {
    const data = getExpenses();
    setExpenses(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

  /**Add new expense */
  const handleAddExpense = (expense) => {
    const saved = addExpense(expense);
    setExpenses((prev) => [saved, ...prev]);
  };

  /**Delete expense */
  const handleDeleteExpense = (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    deleteExpense(id);
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  /**Edit expense */
  const handleEditExpense = (editedExpense) => {
    updateExpense(editedExpense);
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === editedExpense.id ? editedExpense : exp))
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-6 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(255,255,255,0.75)",
      }}
    >
      {/*Summary Button */}
      <Link
        to="/summary"
        className="fixed top-6 right-6 z-50 px-5 py-2.5 rounded-full text-white font-medium bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-400/70 transition-all duration-300 transform hover:scale-105"
      >
        View Detailed Expenses / Summary
      </Link>

      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-10 drop-shadow-md">
        💰EXPENSE TRACKER
      </h1>

      {/* Main Section: Form (Left) + List (Right) */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-[95%] mx-auto">
        {/* Left: Expense Form */}
        <div className="w-full lg:w-1/2 bg-white/90 rounded-2xl shadow-xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
            Add New Expense
          </h2>
          <ExpenseForm onAddExpense={handleAddExpense} />
        </div>

        {/* Right: Expense List */}
        <div className="w-full lg:w-1/2 bg-white/90 rounded-2xl shadow-xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4 text-center">
            Your Expenses
          </h2>
          <ExpenseList
            expenses={expenses}
            onDelete={handleDeleteExpense}
            onEdit={handleEditExpense}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
