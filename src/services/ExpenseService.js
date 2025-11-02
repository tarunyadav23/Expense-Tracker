/**
 * ExpenseService
 * ---------------
 * Handles data operations for expenses such as saving, loading, updating, and clearing.
 * Uses LocalStorage to simulate basic data persistence.
 */

const STORAGE_KEY = "expenses";

/** Fetch all expenses */
export const getExpenses = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading expenses from storage:", error);
    return [];
  }
};

/** Save expenses */
export const saveExpenses = (expenses) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error("Error saving expenses to storage:", error);
  }
};

/** Clear all stored expenses */
export const clearExpenses = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/** Add a new expense */
export const addExpense = (expense) => {
  const expenses = getExpenses();
  expenses.unshift(expense);
  saveExpenses(expenses);
  return expense;
};

/** Delete expense by ID */
export const deleteExpense = (id) => {
  const filtered = getExpenses().filter((exp) => exp.id !== id);
  saveExpenses(filtered);
};

/** Update an existing expense by ID */
export const updateExpense = (updatedExpense) => {
  const updated = getExpenses().map((exp) =>
    exp.id === updatedExpense.id ? updatedExpense : exp
  );
  saveExpenses(updated);
  return updatedExpense;
};
