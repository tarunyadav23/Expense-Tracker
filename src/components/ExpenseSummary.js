import React, { useMemo, useState, useEffect } from "react";
import { getCategoryIcon } from "../utils/categoryUtils";
import { formatDDMMYYYY } from "../utils/dateUtils";
import { XCircle } from "lucide-react";

/**
 * ExpenseSummary Component
 * -------------------------
 * - Groups expenses by category and calculates totals
 * - Displays category-level summaries with expandable details
 * - Allows filtering by category using toggle buttons
 * - Provides a clear-all option to reset filters
 * - Shows detailed transactions when a category is expanded
 * - Displays the total of all visible (filtered) expenses
 */

const ExpenseSummary = ({
  expenses = [],
  selectedCategories,
  toggleCategory,
  clearCategoryFilters,
  categoriesList,
}) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Reset expanded when expenses change
  useEffect(() => {
    setExpandedCategory(null);
  }, [expenses]);

  /**Group expenses by category */
  const groupedByCategory = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push({ ...e, amount: Number(e.amount) });
    });

    Object.keys(map).forEach((cat) => {
      map[cat].sort((a, b) => new Date(b.date) - new Date(a.date));
      map[cat].total = map[cat].reduce((sum, item) => sum + item.amount, 0);
    });

    return map;
  }, [expenses]);

  const categories = Object.keys(groupedByCategory);

  /**Total of all currently visible expenses */
  const totalFiltered = useMemo(() => {
    return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  return (
    <div className="relative">
      {/*Category Filters */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-full border transition ${
              (cat === "All" && selectedCategories.length === 0) ||
              selectedCategories.includes(cat)
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat !== "All" && getCategoryIcon(cat)}
            <span>{cat}</span>
          </button>
        ))}

        <button
          onClick={clearCategoryFilters}
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-red-400 text-red-500 text-sm font-medium hover:bg-red-50 transition"
        >
          <XCircle className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/*Expense Summary Section */}
      {categories.length === 0 ? (
        <p className="text-gray-500 text-center italic mt-6">
          No expenses to summarize yet.
        </p>
      ) : (
        <>
          {/*Category Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {categories.map((cat) => {
              const { total, length: count } = groupedByCategory[cat];
              const isOpen = expandedCategory === cat;

              return (
                <div
                  key={cat}
                  onClick={() => setExpandedCategory(isOpen ? null : cat)}
                  className={`cursor-pointer bg-white border rounded-xl shadow-md p-5 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                    isOpen ? "ring-2 ring-indigo-400" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                        {getCategoryIcon(cat)} {cat}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {count} transaction{count > 1 ? "s" : ""}
                      </div>
                    </div>
                    <div className="text-indigo-700 font-bold text-xl">
                      ₹{total.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/*Expanded Category Details */}
          {expandedCategory && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-inner mb-6">
              <h3 className="text-lg font-semibold text-indigo-700 mb-3 flex items-center gap-2">
                {getCategoryIcon(expandedCategory)} {expandedCategory} — Detailed
                Transactions
              </h3>

              {(() => {
                const transactions = groupedByCategory[expandedCategory] || [];
                const groupedByDate = {};

                transactions.forEach((t) => {
                  const ymd = new Date(t.date).toISOString().slice(0, 10);
                  if (!groupedByDate[ymd]) groupedByDate[ymd] = [];
                  groupedByDate[ymd].push(t);
                });

                const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
                  a < b ? 1 : -1
                );

                return (
                  <div className="space-y-4">
                    {sortedDates.length === 0 ? (
                      <p className="text-gray-500 italic">
                        No transactions for this category.
                      </p>
                    ) : (
                      sortedDates.map((ymd) => (
                        <div key={ymd}>
                          <div className="text-sm text-gray-500 mb-2">
                            {formatDDMMYYYY(ymd)}
                          </div>
                          <ul className="space-y-2">
                            {groupedByDate[ymd].map((t) => (
                              <li
                                key={t.id}
                                className="flex justify-between items-center bg-gray-50 rounded-md p-3"
                              >
                                <div>
                                  <div className="font-medium text-gray-800">
                                    {t.title || "Unnamed Expense"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {t.category}
                                  </div>
                                </div>
                                <div className="text-indigo-700 font-semibold">
                                  ₹{t.amount.toFixed(2)}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/*Total Spent Summary */}
          <div className="flex justify-end">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 w-full sm:w-1/5 shadow-md text-right">
              <p className="text-sm text-gray-600">TOTAL</p>
              <p className="text-2xl font-semibold text-indigo-700">
                ₹{totalFiltered.toFixed(2)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseSummary;
