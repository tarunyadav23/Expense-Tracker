// src/utils/dateUtils.js

/** Format a date object or ISO string into DD/MM/YYYY format */
export const formatDDMMYYYY = (dateInput) => {
  const d = new Date(dateInput);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

/** Convert YYYY-MM-DD to a Date safely */
export const parseDate = (s) => new Date(s + "T00:00:00");
