import {
  FaUtensils,
  FaShoppingBag,
  FaLightbulb,
  FaCoins,
  FaBusAlt,
  FaHome,
  FaFilm,
  FaBook,
  FaHeartbeat,
  FaWifi,
} from "react-icons/fa";

/**
 * Returns a category icon based on category name
 * ------------------------------------------------
 * Icons are color-coded and readable for better UI clarity
 */
export const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "food":
      return <FaUtensils className="text-red-500" />;
    case "travel":
      return <FaBusAlt className="text-blue-500" />;
    case "shopping":
      return <FaShoppingBag className="text-pink-500" />;
    case "bills":
      return <FaLightbulb className="text-yellow-500" />;
    case "rent":
      return <FaHome className="text-orange-500" />;
    case "entertainment":
      return <FaFilm className="text-purple-500" />;
    case "education":
      return <FaBook className="text-indigo-500" />;
    case "health":
      return <FaHeartbeat className="text-rose-500" />;
    case "subscriptions":
      return <FaWifi className="text-cyan-500" />;
    default:
      return <FaCoins className="text-green-500" />; // other / misc
  }
};

/**
 * Export available category list — use in forms or filters
 */
export const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Rent",
  "Entertainment",
  "Education",
  "Health",
  "Subscriptions",
  "Other",
];
