// utils.js
function formatDate(dateArray) {
  const [year, month, day, hour, minute] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute); // Month is 0-indexed for Date
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  return date.toLocaleString(undefined, options);
}

function capitalize(string) {
  if (!string) return ""; // Handle empty or null strings
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export { formatDate, capitalize };
