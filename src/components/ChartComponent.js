import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

/**
 * ChartComponent
 * ---------------
 * Displays a pie chart visualization of total expenses per category.
 *
 * @param {Array} expenses - List of all expenses
 */
const ChartComponent = ({ expenses }) => {
  // Group total expenses by category
  const data = expenses.reduce((acc, exp) => {
    const existing = acc.find((item) => item.category === exp.category);
    if (existing) {
      existing.amount += exp.amount;
    } else {
      acc.push({ category: exp.category, amount: exp.amount });
    }
    return acc;
  }, []);

  if (data.length === 0) {
    return (
      <p className="text-gray-500 text-center italic mt-4">
        No expenses to visualize.
      </p>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        📊 Expense Breakdown
      </h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#4f46e5"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartComponent;
