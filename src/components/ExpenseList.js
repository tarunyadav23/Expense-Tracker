import React, { useState, useMemo } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { formatDDMMYYYY } from "../utils/dateUtils";
import { getCategoryIcon, categories } from "../utils/categoryUtils";

/**
 * ExpenseList Component
 * ---------------------
 * - Sorts expenses by date (latest first)
 * - Groups by formatted date
 * - Adds "Today", "Yesterday", and "Earlier" labels
 */
function ExpenseList({ expenses, onDelete, onEdit }) {
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  /**Sort expenses by date only (latest first) */
  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  /**Group expenses by formatted date */
  const groupedExpenses = useMemo(() => {
    return sortedExpenses.reduce((groups, expense) => {
      const formattedDate = formatDDMMYYYY(expense.date);
      if (!groups[formattedDate]) groups[formattedDate] = [];
      groups[formattedDate].push(expense);
      return groups;
    }, {});
  }, [sortedExpenses]);

  /**Sort date groups (latest first) */
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split("/").map(Number);
    const [dayB, monthB, yearB] = b.split("/").map(Number);
    return new Date(yearB, monthB - 1, dayB) - new Date(yearA, monthA - 1, dayA);
  });

  /**Helper: Label date as Today / Yesterday / Earlier */
  const getDateLabel = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return "Earlier";
  };

  /** Handlers */
  const handleEditClick = (expense) => {
    setEditingExpense(expense.id);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onEdit({
      ...formData,
      id: editingExpense,
      amount: parseFloat(formData.amount),
    });
    setEditingExpense(null);
  };

  const closeModal = () => setEditingExpense(null);

  if (!expenses || expenses.length === 0) {
    return (
      <p className="text-gray-500 text-center italic">
        No expenses added yet.
      </p>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      {/*Scrollable Expense List */}
      <div className="flex-1 overflow-y-auto pr-2 max-h-[80vh] custom-scrollbar">
        {sortedDates.map((date) => (
          <div key={date} className="mb-4">
            {/*Smart Date Header */}
            <h3 className="text-indigo-700 font-bold text-sm mb-1">
              {getDateLabel(date)}{" "}
              <span className="text-gray-500 font-normal text-xs ml-2">
                ({date})
              </span>
            </h3>
            <div className="border-b border-indigo-200 mb-2"></div>

            {/* Expenses for this date */}
            <div className="flex flex-col gap-2">
              {groupedExpenses[date].map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white shadow-sm rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Top Row */}
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-lg font-semibold text-indigo-700">
                      ₹{expense.amount.toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(expense)}
                        className="text-blue-500 hover:text-blue-700 transition"
                        title="Edit Expense"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this expense?"
                            )
                          ) {
                            onDelete(expense.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete Expense"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  {expense.title && (
                    <p className="text-gray-800 text-sm font-medium truncate mb-1">
                      {expense.title}
                    </p>
                  )}

                  {/* Category only */}
                  <div className="flex justify-start items-center text-xs text-gray-600">
                    {getCategoryIcon(expense.category)}
                    <span className="ml-1">{expense.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/*Edit Modal */}
      {editingExpense && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Expense
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, category: cat }))
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition duration-150 ${
                        formData.category === cat
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {getCategoryIcon(cat)}
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
