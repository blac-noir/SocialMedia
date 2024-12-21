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

// Function to convert image to Base64
async function convertImageToBase64(fileInput) {
  return new Promise((resolve, reject) => {
    const file = fileInput.files[0]; // Get the first selected file

    if (!file) {
      reject("No file selected.");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target.result.split(",")[1]; // Extract base64 data
      resolve(base64String);
    };

    reader.onerror = function (event) {
      reject("Error reading file: " + event.target.error.message);
    };

    reader.readAsDataURL(file); // Start reading the file as a data URL
  });
}

export { formatDate, capitalize, convertImageToBase64 };
