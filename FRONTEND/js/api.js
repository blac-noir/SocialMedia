// api.js
const API_BASE_URL = "http://localhost:8080/sm-backend-1.0-SNAPSHOT/api";

// Function to fetch data from the backend
async function fetchData(url, options = {}) {
  // Wrapper for fetch to handle errors and base URL
  try {
    let token = getToken();
    if (token) {
      if (isTokenExpired()) {
        token = await refreshAccessToken();
        if (!token) {
          // The user has been logged out. Return or redirect to login page.
          throw new Error("Token expired and refresh failed. User logged out");
        }
      }
      options.headers = {
        ...options.headers, //Keep the existing headers if they exist
        Authorization: `Bearer ${token}`, // Add Bearer token
      };
    }
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

// Auth
function getToken() {
  return localStorage.getItem("access_token");
}
function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}
function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
function isLoggedIn() {
  return !!getToken();
}
function decodeJwtToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}
function isTokenExpired() {
  const token = getToken();
  if (!token) {
    return true; // No token, consider it expired
  }

  const decodedToken = decodeJwtToken(token);
  if (!decodedToken || !decodedToken.exp) {
    return true; // Unable to decode or expiration not found.
  }
  const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
  return Date.now() >= expirationTime; // Check if current time has passed the expiration.
}
async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    // No refresh token, log the user out
    logout();
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      // Assume you have /auth/refresh in the backend
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    if (!response.ok) {
      console.error("Failed to refresh token", response);
      // No refresh token, log the user out
      logout();
      return null;
    }
    const data = await response.json();

    if (data && data.data && data.data.access_token) {
      localStorage.setItem("access_token", data.data.access_token);
      return data.data.access_token;
    }
    // No refresh token, log the user out
    logout();
    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    // No refresh token, log the user out
    logout();
    return null;
  }
}
async function login(email, password) {
  try {
    const response = await fetchData("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    // Store the access token and user info
    if (response && response.data && response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.location.reload();
      // Return the response
      return response;
    }
    throw new Error("Login failed: Invalid response");
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
async function register(name, email, password) {
  try {
    const response = await fetchData("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, email: email, password: password }),
    });
    // Return the response
    return response;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}
function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  window.location.href = `index.html`;
}

//
async function createPost(content, image) {
  return fetchData(`/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: content, image: image }),
  });
}
async function getPosts(page = 1) {
  // Fetches posts for the home page feed
  return fetchData(`/posts?page=${page}`);
}
async function getUserPosts(userId) {
  // Fetches posts for a user's profile
  return fetchData(`/posts/user/${userId}/posts`);
}
async function getSinglePost(postId) {
  // Fetches a single post
  return fetchData(`/posts/${postId}`);
}
async function likePost(postId) {
  // Likes a post
  return fetchData(`/posts/${postId}/like`, { method: "POST" });
}
async function unlikePost(postId) {
  // Likes a post
  return fetchData(`/posts/${postId}/unlike`, { method: "POST" });
}

async function addComment(postId, commentText) {
  console.log(JSON.stringify({ text: commentText }));
  // Adds a comment to a post
  return fetchData(`/posts/${postId}/comments?userId=1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: commentText }),
  });
}

// Profile
async function getUserProfile(userId) {
  return fetchData(`/users/${userId}`);
}
async function getFollowers(userId) {
  return fetchData(`/users/${userId}/followers`);
}
async function getFollowing(userId) {
  return fetchData(`/users/${userId}/following`);
}
async function updateProfile(userId, profileData) {
  return fetchData(`/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
}

export {
  createPost,
  getPosts,
  getUserPosts,
  getSinglePost,
  likePost,
  unlikePost,
  addComment,
  getUserProfile,
  getFollowers,
  getFollowing,
  updateProfile,
  login,
  register,
  logout,
  isLoggedIn,
  getUser,
};
