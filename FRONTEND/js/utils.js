// utils.js
function formatDate(dateString) {
    // Utility function to format date
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

export { formatDate };