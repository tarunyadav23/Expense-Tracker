import { parseDate } from "./dateUtils";

export const filterExpenses = (expenses, { filterType, dailyDate, weeklyStart, weeklyEnd, monthly, selectedCategories }) => {
  const isInMonth = (expDate, ym) => {
    if (!ym) return true;
    const [y, m] = ym.split("-");
    return (
      expDate.getFullYear() === Number(y) &&
      expDate.getMonth() + 1 === Number(m)
    );
  };

  return expenses.filter((exp) => {
    const expDate = new Date(exp.date + "T00:00:00");

    if (filterType === "Daily") {
      const sel = new Date(dailyDate + "T00:00:00");
      if (
        expDate.getFullYear() !== sel.getFullYear() ||
        expDate.getMonth() !== sel.getMonth() ||
        expDate.getDate() !== sel.getDate()
      )
        return false;
    }

    if (filterType === "Weekly") {
      const start = parseDate(weeklyStart);
      const end = new Date(weeklyEnd + "T23:59:59.999");
      if (expDate < start || expDate > end) return false;
    }

    if (filterType === "Monthly") {
      if (!isInMonth(expDate, monthly)) return false;
    }

    if (selectedCategories.length > 0) {
      return selectedCategories.includes(exp.category);
    }

    return true;
  });
};
