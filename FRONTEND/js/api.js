// api.js
const API_BASE_URL = "http://localhost:8080/sm-backend-1.0-SNAPSHOT/api"; // Replace with your actual API base URL

async function fetchData(url, options = {}) {
  // Wrapper for fetch to handle errors and base URL
  try {
    const response = await fetch(API_BASE_URL + url, options);
    if (!response.ok) {
      const errorData = await response.json(); // Try to get the error data
      console.error("API Error:", errorData);
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${
          errorData?.message || "Unknown error"
        }`
      );
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Network Error:", error);
    throw error; // Re-throw to handle in component
  }
}

async function getPosts(page = 1) {
  // Fetches posts for the home page feed
  return fetchData(`/posts?page=${page}`);
}

async function getUserPosts(userId) {
  // Fetches posts for a user's profile
  return fetchData(`/users/${userId}/posts`);
}

async function getSinglePost(postId) {
  // Fetches a single post
  return fetchData(`/posts/${postId}`);
}

async function likePost(postId) {
  // Likes a post
  return fetchData(`/posts/${postId}/like`, { method: "POST" });
}

async function addComment(postId, commentText) {
  // Adds a comment to a post
  return fetchData(`/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: commentText }),
  });
}

async function getUserProfile(userId) {
  return fetchData(`/users/${userId}`);
}
async function getFollowers(userId) {
  return fetchData(`/users/${userId}/followers`);
}
async function getFollowing(userId) {
  return fetchData(`/users/${userId}/following`);
}
async function updateProfile(profileData) {
  return fetchData(`/users/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
}
async function login(email, password) {
  return fetchData("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@gmail.com", password: "1234" }),
  });
}
async function register(name, email, password) {
  return fetchData("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, email: email, password: password }),
  });
}

export {
  getPosts,
  getUserPosts,
  getSinglePost,
  likePost,
  addComment,
  getUserProfile,
  getFollowers,
  getFollowing,
  updateProfile,
  login,
  register,
};


// curl -X POST http://localhost:8080/sm-backend-1.0-SNAPSHOT/api/auth/register -H "Content-Type: application/json" -d '{"username": "testuser", "password": "testpassword", "email": "testuser@example.com"}'

// async function readFileAsBytes(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = () => {
//       // The result is an ArrayBuffer
//       resolve(reader.result);
//     };

//     reader.onerror = () => {
//       reject(new Error("Error reading file"));
//     };

//     reader.readAsArrayBuffer(file);
//   });
// }