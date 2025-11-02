/**
 * SummaryPage
 * ------------
 * Displays filtered expense data, summaries, and category-wise charts.
 * Allows users to switch between daily, weekly, monthly, and all-time views.
 */
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  CalendarRange,
  Infinity,
  Filter,
} from "lucide-react";
import { getExpenses } from "../services/ExpenseService";
import ExpenseSummary from "../components/ExpenseSummary";
import ChartComponent from "../components/ChartComponent";
import { categories } from "../utils/categoryUtils";
import { filterExpenses } from "../utils/expenseUtils";
import backgroundImg from "../assets/background.jpg";

const SummaryPage = () => {
  const allExpenses = useMemo(() => getExpenses(), []);

  //Default dates setup
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}`;
  const monday = new Date(today);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  //State management
  const [filterType, setFilterType] = useState("Daily");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dailyDate, setDailyDate] = useState(today);
  const [weeklyStart, setWeeklyStart] = useState(
    monday.toISOString().slice(0, 10)
  );
  const [weeklyEnd, setWeeklyEnd] = useState(sunday.toISOString().slice(0, 10));
  const [monthly, setMonthly] = useState(currentMonth);

  const filterOptions = [
    { key: "Daily", icon: <Calendar className="w-4 h-4" /> },
    { key: "Weekly", icon: <CalendarDays className="w-4 h-4" /> },
    { key: "Monthly", icon: <CalendarRange className="w-4 h-4" /> },
    { key: "All Time", icon: <Infinity className="w-4 h-4" /> },
  ];

  
  const toggleCategory = (cat) => {
    if (cat === "All") {
      setSelectedCategories([]); 
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearCategoryFilters = () => setSelectedCategories([]);

  //Weekly end date auto-adjustment
  const handleWeeklyStartChange = (dateStr) => {
    const start = new Date(dateStr);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    setWeeklyStart(dateStr);
    setWeeklyEnd(end.toISOString().slice(0, 10));
  };

  //Use helper function from expenseUtils.js
  const filteredExpenses = useMemo(
    () =>
      filterExpenses(allExpenses, {
        filterType,
        dailyDate,
        weeklyStart,
        weeklyEnd,
        monthly,
        selectedCategories,
      }),
    [
      allExpenses,
      filterType,
      dailyDate,
      weeklyStart,
      weeklyEnd,
      monthly,
      selectedCategories,
    ]
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-6 px-3"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(255,255,255,0.75)",
      }}
    >
      {/*Back Button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full p-2 hover:bg-indigo-200 shadow-sm"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>

      {/*Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-indigo-700 mb-6">
        📊 Expense Summary
      </h1>

      {/*Time Filters Section */}
      <div className="max-w-full mx-auto mb-6">
        <div className="flex justify-center flex-wrap gap-3 mb-3 items-center">
          <div className="flex items-center gap-2 mr-2 text-gray-500">
            <Filter className="w-5 h-5" />
            <span className="font-medium text-sm">Filters</span>
          </div>

          {filterOptions.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border transition ${
                filterType === f.key
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {f.icon}
              <span>{f.key}</span>
            </button>
          ))}
        </div>

        {/*Date Inputs */}
        <div className="mt-3 flex justify-center gap-3 flex-wrap">
          {filterType === "Daily" && (
            <input
              type="date"
              value={dailyDate}
              onChange={(e) => setDailyDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            />
          )}
          {filterType === "Weekly" && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Start</label>
              <input
                type="date"
                value={weeklyStart}
                onChange={(e) => handleWeeklyStartChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
              />
              <div className="text-sm text-gray-500">→</div>
              <input
                type="date"
                value={weeklyEnd}
                onChange={(e) => setWeeklyEnd(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}
          {filterType === "Monthly" && (
            <input
              type="month"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
            />
          )}
        </div>
      </div>

      {/*Summary + Chart */}
      <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg overflow-y-auto max-h-[80vh]">
          <ExpenseSummary
            expenses={filteredExpenses}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            clearCategoryFilters={clearCategoryFilters}
            categoriesList={["All", ...categories]}
          />
        </div>

        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg flex flex-col items-center overflow-y-auto max-h-[80vh]">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Category-wise Spending
          </h2>
          <div className="w-full">
            <ChartComponent expenses={filteredExpenses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;



