## Detailed Explanation of JavaScript Code

This document provides a comprehensive explanation of the JavaScript code for a social media platform, broken down by module for clarity.

### 1. `api.js` - API Interaction Module

This module is responsible for all communication with the backend API. It handles fetching data, sending requests, and managing responses.

```javascript
// api.js
const API_BASE_URL = 'https://your-backend-api.com/api'; // Replace with your actual API base URL

async function fetchData(url, options = {}) {
    // Wrapper for fetch to handle errors and base URL
    try {
        const response = await fetch(API_BASE_URL + url, options);
        if (!response.ok) {
            const errorData = await response.json(); // Try to get the error data
            console.error('API Error:', errorData);
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData?.message || 'Unknown error'}`);
        }
         const contentType = response.headers.get("content-type");
          if(contentType && contentType.indexOf("application/json") !== -1) {
                return await response.json();
            } else {
                return await response.text();
            }
    } catch (error) {
        console.error('Network Error:', error);
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
    return fetchData(`/posts/${postId}/like`, { method: 'POST' });
}

async function addComment(postId, commentText) {
    // Adds a comment to a post
    return fetchData(`/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText }),
    });
}

async function getUserProfile(userId){
    return fetchData(`/users/${userId}`);
}
async function getFollowers(userId){
    return fetchData(`/users/${userId}/followers`);
}
async function getFollowing(userId){
    return fetchData(`/users/${userId}/following`);
}
async function updateProfile(profileData){
     return fetchData(`/users/update`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(profileData)
     });
}
async function login(email, password){
   return fetchData('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: email, password: password})
   });
}
async function register(name, email, password){
    return fetchData('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name: name, email: email, password: password})
    })
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
    register
};
```

*   **`API_BASE_URL`:**
    *   A constant string that holds the base URL for the backend API. It's crucial for setting the foundation for each API request by ensuring each endpoint request is using the correct base URL.
    *   **Usage:** Used as a prefix for all API endpoint URLs.

*   **`fetchData(url, options = {})` Function:**
    *   **Purpose:** A reusable function that handles all fetch requests to the backend API. It encapsulates error handling, base URL appending, and JSON parsing.
    *   **Parameters:**
        *   `url`: The API endpoint URL to fetch, relative to the base URL.
        *   `options`: Optional request options object, such as `method`, `headers`, and `body`.
    *   **Logic:**
        1.  Constructs the full API URL by appending `url` to `API_BASE_URL`.
        2.  Uses `fetch` to make the request.
        3.  Checks if the response is ok (status code 200-299). If not, parses the error message from response, logs the error, and throws a new error.
        4.  Parses the response body by checking if the `content-type` of the response contains `application/json`. If yes, the response is parsed as JSON, otherwise the response is returned as plain text.
        5.  Catches any network errors, logs them, and re-throws the error so the code that called the function can handle errors.
    *   **Usage:**  This function is called by other API functions to perform requests.

*   **`getPosts(page = 1)` Function:**
    *   **Purpose:** Fetches a list of posts for the home page feed.
    *   **Parameter:** `page`: The page number for pagination (default is 1).
    *   **Logic:** Calls `fetchData` with the `/posts?page=${page}` endpoint.
    *   **Returns:** A promise that resolves to the list of posts.
    *   **Usage:** Used in `script.js` to load posts for the feed.

*   **`getUserPosts(userId)` Function:**
    *   **Purpose:** Fetches posts created by a specific user.
    *   **Parameter:** `userId`: The ID of the user.
    *   **Logic:** Calls `fetchData` with the `/users/${userId}/posts` endpoint.
    *   **Returns:** A promise that resolves to the list of user posts.
    *   **Usage:** Used in `script.js` to load posts for a user's profile.

*   **`getSinglePost(postId)` Function:**
    *   **Purpose:** Fetches a single post by ID along with all the comments on that post.
    *   **Parameter:** `postId`: The ID of the post.
    *   **Logic:** Calls `fetchData` with the `/posts/${postId}` endpoint.
    *   **Returns:** A promise that resolves to the single post object.
    *   **Usage:** Used in `script.js` to load a post and comments for a specific post page.

*   **`likePost(postId)` Function:**
    *   **Purpose:** Likes a post by sending a POST request to the like endpoint.
    *   **Parameter:** `postId`: The ID of the post to like.
    *   **Logic:** Calls `fetchData` with the `/posts/${postId}/like` endpoint and `POST` method.
    *   **Returns:** A promise that resolves when the post has been liked successfully.
    *   **Usage:** Used in `script.js` when a user likes a post.

*   **`addComment(postId, commentText)` Function:**
    *   **Purpose:** Adds a comment to a post.
    *   **Parameters:**
        *   `postId`: The ID of the post to comment on.
        *   `commentText`: The text content of the comment.
    *   **Logic:** Calls `fetchData` with the `/posts/${postId}/comments` endpoint, `POST` method, and comment as the request body.
    *   **Returns:** A promise that resolves to the new comment object.
    *   **Usage:** Used in `script.js` to create new comments.

*   **`getUserProfile(userId)` Function:**
    *   **Purpose:** Fetches user profile details
    *   **Parameter:** `userId`: The ID of the user whose profile to fetch
    *  **Logic:** Calls `fetchData` with the `/users/${userId}` endpoint.
    *  **Returns:** A promise that resolves to the user profile object.
    *   **Usage:** Used in `script.js` to load user profile.
*   **`getFollowers(userId)` Function:**
    *   **Purpose:** Fetches user follower's data
    *   **Parameter:** `userId`: The ID of the user whose followers to fetch
    *  **Logic:** Calls `fetchData` with the `/users/${userId}/followers` endpoint.
    *  **Returns:** A promise that resolves to the array of user objects of followers.
    *   **Usage:** Used in `script.js` to load a list of followers.

*   **`getFollowing(userId)` Function:**
    *   **Purpose:** Fetches user's following data
    *   **Parameter:** `userId`: The ID of the user whose following list to fetch
    *  **Logic:** Calls `fetchData` with the `/users/${userId}/following` endpoint.
    *  **Returns:** A promise that resolves to the array of user objects of following.
    *   **Usage:** Used in `script.js` to load list of following users.

*   **`updateProfile(profileData)` Function:**
    *   **Purpose:** Updates a users profile data
    *   **Parameter:** `profileData`:  An object containing profile data such as `name`, `email`, `bio` etc.
    *  **Logic:** Calls `fetchData` with the `/users/update` endpoint, the `PUT` method and the data in the request body.
    *  **Returns:** A promise that resolves to the updated profile object.
    *   **Usage:** Used in `script.js` to save updated profile data.

*   **`login(email, password)` Function:**
    *   **Purpose:** Handles user login by sending credentials to the authentication endpoint.
    *   **Parameters:**
        *   `email`: The user's email address.
        *   `password`: The user's password.
    *   **Logic:** Calls `fetchData` with the `/auth/login` endpoint, `POST` method, and credentials in the body.
    *   **Returns:** A promise that resolves with the login response (e.g. the authentication token).
    *   **Usage:** Used in `forms.js` to log in users.

*   **`register(name, email, password)` Function:**
    *   **Purpose:** Handles user registration by sending user data to the authentication endpoint.
    *   **Parameters:**
        *   `name`: The user's username.
        *   `email`: The user's email address.
        *   `password`: The user's password.
    *   **Logic:** Calls `fetchData` with the `/auth/register` endpoint, `POST` method, and user information in the body.
    *   **Returns:** A promise that resolves with the registration response.
    *   **Usage:** Used in `forms.js` to register users.

*   **`export` Statement:** Exports all the API functions to be used in other modules such as `script.js`.

### 2. `dom.js` - DOM Manipulation Module

This module is responsible for creating and manipulating DOM elements. It helps keep the DOM manipulation logic separate from the main application logic.

```javascript
// dom.js
function createPostElement(post) {
  // Creates a single post element
    const article = document.createElement('article');
    article.classList.add('post');

    article.innerHTML = `
      <header class="post-header">
          <div class="post-author-info">
              <img src="${post.author_profile_pic}" alt="Author's Profile Picture" class="post-author-pic">
              <h3 class="post-author-name">${post.author_name}</h3>
          </div>
          <time class="post-date" datetime="${post.date}">${formatDate(post.date)}</time>
      </header>
      <div class="post-content">
          <p>${post.content}</p>
          ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
      </div>
      <footer class="post-footer">
            <button class="like-button" data-post-id="${post.id}">Like</button>
          <button class="comment-button" data-post-id="${post.id}">Comment</button>
      </footer>
      `;

    return article;
}

function createCommentElement(comment) {
  // Creates a single comment element
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    commentDiv.innerHTML = `<p>${comment.author}: ${comment.text}</p>`;
  return commentDiv;
}

function appendPost(container, post){
  container.appendChild(createPostElement(post));
}

function appendComment(container, comment){
    container.appendChild(createCommentElement(comment));
}

export { createPostElement, createCommentElement, appendPost, appendComment};
```

*   **`createPostElement(post)` Function:**
    *   **Purpose:** Creates and returns a single post `article` element with content loaded from the `post` object.
    *   **Parameter:** `post`: An object containing post details such as `author`, `date`, `content`, `image`, and `id`.
    *   **Logic:**
        1.  Creates an `article` element with class `post`.
        2.  Dynamically generates the inner HTML using template literals and data from the `post` object.
            *   Includes author profile picture, author name, post date (formatted with `formatDate`), post content, optional image, and like/comment buttons.
        3.  Returns the generated `article` element.
    *   **Usage:** Used in `script.js` to render a single post on the feed.
*   **`createCommentElement(comment)` Function:**
    *   **Purpose:** Creates and returns a single `comment` `div` element with data loaded from the `comment` object.
    *   **Parameter:** `comment`: An object containing comment details such as `author` and `text`.
    *   **Logic:**
        1.  Creates a `div` element with class `comment`.
        2.  Dynamically generates the inner HTML with the comment author and comment text.
        3.  Returns the generated `div` element.
    *   **Usage:** Used in `script.js` to display comments on a post.

*   **`appendPost(container, post)` Function:**
    *   **Purpose:** Appends a post to a given container.
    *   **Parameters:**
        *   `container`: The DOM element to append the post to.
        *   `post`: The post object.
    *   **Logic:** Creates a new post element and appends it to the specified container.
    *   **Usage:** Used in `script.js` to add new posts to the page.

*    **`appendComment(container, comment)` Function:**
     *   **Purpose:** Appends a comment to a given container.
    *   **Parameters:**
        *   `container`: The DOM element to append the comment to.
        *   `comment`: The comment object.
    *   **Logic:** Creates a new comment element and appends it to the specified container.
    *   **Usage:** Used in `script.js` to add new comments to the page.

*   **`export` Statement:** Exports all the functions to be used in other modules like `script.js`.

### 3. `state.js` - State Management Module

This module manages the application's state, providing a centralized place to store and update data.

```javascript
// state.js
let appState = {
    user: null,
    currentFeed: [],
    loading: false,
};

function setAppState(newState){
    appState = { ...appState, ...newState};
    console.log('State updated:', appState);
    return appState;
}

function getAppState(){
   return appState;
}

export { setAppState, getAppState };
```

*   **`appState`:**
    *   **Purpose:** An object that stores application-wide data, in this case `user`, `currentFeed`, and `loading`.
    *   `user`: Stores information about the logged-in user (initially `null`).
    *   `currentFeed`: Stores the current array of posts for the home page feed.
    *   `loading`: A boolean that indicates whether the app is in loading state.
    *   **Usage:**  Used by different parts of the application to access and modify state data.

*   **`setAppState(newState)` Function:**
    *   **Purpose:** Updates the `appState` with new state data.
    *   **Parameter:** `newState`: An object containing new state data to be updated.
    *   **Logic:**
        1.  Uses the spread operator (`...`) to merge the existing state with `newState`, creates a new object using the spread operator.
        2.  Logs the updated state to the console.
        3. Returns the updated app state.
    *   **Usage:**  Used in `script.js` to update the loading state, the current feed, and other properties.

*    **`getAppState()` Function:**
     *   **Purpose:** Returns the current value of the app state.
     *  **Logic:** Returns the current value of the `appState` object.
     *  **Returns:** Returns the current value of the `appState` object.
     *  **Usage:**  Used in `script.js` to access the current app state.

*   **`export` Statement:** Exports the `setAppState` and `getAppState` to be used in other modules.

### 4. `utils.js` - Utility Functions Module

This module contains utility functions such as formatting dates.

```javascript
// utils.js
function formatDate(dateString) {
    // Utility function to format date
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

export { formatDate };
```

*   **`formatDate(dateString)` Function:**
    *   **Purpose:** Formats a date string into a user-friendly format.
    *   **Parameter:** `dateString`: A string representation of a date.
    *   **Logic:**
        1.  Creates a `Date` object from the `dateString`.
        2.  Formats the date using `toLocaleDateString` with specified options (`year`, `month`, and `day`).
        3.  Returns the formatted date string.
    *   **Usage:** Used in `dom.js` to format post dates in the correct format.
*   **`export` Statement:** Exports the `formatDate` function to be used in other modules.

### 5. `forms.js` - Form Creation and Handling Module

This module creates dynamic HTML form elements and handles user form submissions.

```javascript
// forms.js

import * as api from './api.js';
import { showModal, hideModal } from './ui.js';

function createLoginForm() {
  // Creates and returns the login form element
    const form = document.createElement('form');
    form.innerHTML = `
      <h2>Login</h2>
      <div class="form-group">
        <label for="login-email">Email:</label>
        <input type="email" id="login-email" required>
      </div>
      <div class="form-group">
        <label for="login-password">Password:</label>
        <input type="password" id="login-password" required>
      </div>
       <button type="submit">Login</button>
      `;
    form.addEventListener('submit', handleLoginSubmit);
    return form;
}

async function handleLoginSubmit(event) {
    //Handles login form submissions
  event.preventDefault();
  const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    try{
       const response = await api.login(email, password);
        console.log('Login successful:', response);
        hideModal();
    } catch(error){
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
    }
}

function createRegisterForm() {
    // Creates and returns the registration form element
     const form = document.createElement('form');
    form.innerHTML = `
      <h2>Register</h2>
      <div class="form-group">
        <label for="register-name">Username:</label>
        <input type="text" id="register-name" required>
      </div>
      <div class="form-group">
        <label for="register-email">Email:</label>
        <input type="email" id="register-email" required>
      </div>
      <div class="form-group">
         <label for="register-password">Password:</label>
        <input type="password" id="register-password" required>
      </div>
       <button type="submit">Register</button>
      `;
    form.addEventListener('submit', handleRegisterSubmit);
    return form;
}

async function handleRegisterSubmit(event) {
    //Handles the registration form submissions
    event.preventDefault();
    const name = document.querySelector('#register-name').value;
    const email = document.querySelector('#register-email').value;
     const password = document.querySelector('#register-password').value;

    try{
       const response = await api.register(name, email, password);
         console.log('Registration successful:', response);
        hideModal();
    } catch(error){
         console.error('Registration failed:', error);
         alert('Registration failed. Please try again.');
    }

}

function createPostForm(){
    //Creates and returns the new post form
    const form = document.createElement('form');
    form.innerHTML = `
      <h2>Create a new Post</h2>
      <div class="form-group">
           <label for="post-content">Content:</label>
           <textarea id="post-content" required></textarea>
      </div>
       <div class="form-group">
        <label for="post-image">Image URL (Optional):</label>
         <input type="text" id="post-image">
       </div>
      <button type="submit">Post</button>
      `;
  form.addEventListener('submit', handlePostSubmit);
  return form;

}

async function handlePostSubmit(event) {
    event.preventDefault();
    const content = document.querySelector('#post-content').value;
    const image = document.querySelector('#post-image').value;

    try {
          const newPost = await api.createPost(content, image);
        console.log('New Post Created', newPost);
        hideModal();
        window.location.reload();
    } catch(error){
       console.error('Failed to create the post: ', error);
      alert('Failed to create new post.');
    }
}

function createEditProfileForm(userData){
    // Creates and returns a profile edit form
    const form = document.createElement('form');
    form.innerHTML = `
      <h2>Edit Profile</h2>
      <div class="form-group">
        <label for="edit-name">Username:</label>
        <input type="text" id="edit-name" value="${userData.name}" required>
      </div>
      <div class="form-group">
        <label for="edit-email">Email:</label>
         <input type="email" id="edit-email" value="${userData.email}" required>
      </div>
       <div class="form-group">
          <label for="edit-bio">Bio:</label>
         <textarea id="edit-bio" required>${userData.bio}</textarea>
       </div>
      <button type="submit">Save</button>
      `;
    form.addEventListener('submit', handleEditProfileSubmit);
   return form;
}

async function handleEditProfileSubmit(event){
   event.preventDefault();
    const name = document.querySelector('#edit-name').value;
    const email = document.querySelector('#edit-email').value;
    const bio = document.querySelector('#edit-bio').value;

    try {
      const response = await api.updateProfile({name: name, email: email, bio: bio});
        console.log('Profile update success: ', response);
      hideModal();
      window.location.reload();
    } catch(error){
         console.error('Failed to update the profile: ', error);
         alert('Failed to update the profile');
    }
}
export { createLoginForm, createRegisterForm, createPostForm, createEditProfileForm };
```

*   **`createLoginForm()` Function:**
    *   **Purpose:** Creates and returns the HTML for the login form as a DOM element.
    *   **Logic:**
        1.  Creates a new `form` element.
        2.  Sets the inner HTML of the form element with a template literal including input fields for email and password, labels, and a submit button.
        3.  Attaches an event listener on `submit` to the `handleLoginSubmit` function.
        4.  Returns the newly created `form` element.
    *   **Usage:** Used in `script.js` to load the login form into the modal.
*   **`handleLoginSubmit(event)` Function:**
    *   **Purpose:** Handles the submission of the login form
    *   **Parameter:** The `event` object.
    *   **Logic:**
        1.  Prevents default form submission using `event.preventDefault()`.
        2. Gets the value of the `email` and `password` inputs.
        3.  Calls the `api.login()` function with the user provided `email` and `password`.
        4.  Logs success message on successful login and hides the modal.
        5. If login fails, logs the error on the console and shows a pop-up alert.
    *   **Usage:** Called when the login form is submitted.
*   **`createRegisterForm()` Function:**
    *   **Purpose:** Creates and returns the HTML for the register form as a DOM element.
    *   **Logic:**
        1.  Creates a new `form` element.
        2. Sets the inner HTML of the form with input fields for `name`, `email` and `password`, labels, and a submit button.
        3. Attaches an event listener on `submit` to the `handleRegisterSubmit` function.
        4.  Returns the newly created `form` element.
    *   **Usage:** Used in `script.js` to load the register form into the modal.
*   **`handleRegisterSubmit(event)` Function:**
    *   **Purpose:** Handles the submission of the registration form
    *   **Parameter:** The `event` object.
    *   **Logic:**
        1. Prevents default form submission using `event.preventDefault()`.
        2. Gets the value of the `name`, `email` and `password` inputs.
        3. Calls the `api.register()` function with the user provided details.
        4. Logs success message on successful registration and hides the modal.
        5. If registration fails, logs the error on the console and shows a pop-up alert.
    *   **Usage:** Called when the registration form is submitted.

*   **`createPostForm()` Function:**
    *   **Purpose:** Creates and returns the HTML for the post form as a DOM element.
    *   **Logic:**
        1.  Creates a new `form` element.
        2.  Sets the inner HTML of the form with a `textarea` field for the `content`, a text input for an optional `image URL`, labels, and a submit button.
        3.  Attaches an event listener on `submit` to the `handlePostSubmit` function.
        4. Returns the newly created `form` element.
    *   **Usage:** Used in `script.js` to load the new post form into the modal.

*   **`handlePostSubmit(event)` Function:**
    *   **Purpose:** Handles the submission of the new post form
    *   **Parameter:** The `event` object.
    *   **Logic:**
        1.  Prevents default form submission using `event.preventDefault()`.
        2. Gets the value of the `content` and the `image` inputs.
        3.  Calls the `api.createPost()` function with the user provided values for `content` and an optional `image`.
        4.  Logs a success message on successful posting of the new post, hides the modal and reloads the page.
        5. If creating a new post fails, logs the error on the console and shows a pop-up alert.
    *   **Usage:** Called when the new post form is submitted.

*  **`createEditProfileForm(userData)` Function:**
    *   **Purpose:** Creates and returns the HTML for the edit profile form as a DOM element.
    *   **Parameter:** `userData`: User object containing current user profile data.
    *   **Logic:**
        1.  Creates a new `form` element.
        2.  Sets the inner HTML of the form using the `userData` including input fields for the `name` and the `email`, `textarea` for `bio` with their current values and a save button.
        3. Attaches an event listener on `submit` to the `handleEditProfileSubmit` function.
        4.  Returns the newly created `form` element.
    *   **Usage:** Used in `script.js` to load the edit profile form into the modal.

*    **`handleEditProfileSubmit(event)` Function:**
    *   **Purpose:** Handles the submission of the edit profile form.
    *   **Parameter:** The `event` object.
    *   **Logic:**
        1.  Prevents default form submission using `event.preventDefault()`.
        2. Gets the value of the `name`, `email` and `bio` inputs.
        3. Calls the `api.updateProfile()` function with user provided values for `name`, `email` and `bio`.
        4. Logs success message on successful update of the profile data, hides the modal and reloads the page.
        5. If the profile update fails, logs the error on the console and shows a pop-up alert.
    *   **Usage:** Called when the edit profile form is submitted.
*   **`export` Statement:** Exports all the form creation functions to be used in other modules like `script.js`.

### 6. `ui.js` - User Interface Module

This module handles the display of modals and tooltips.

```javascript
// ui.js
const modalContainer = document.querySelector('#modal-container');
const modalContent = document.querySelector('#modal-form-container');
const modalCloseButton = document.querySelector('.modal-close');
const tooltip = document.querySelector('.tooltip');

function showModal(form){
    //Shows the modal with the provided form
  modalContent.innerHTML = '';
  modalContent.appendChild(form);
  modalContainer.classList.remove('hidden');
}

function hideModal() {
    //Hides the modal
  modalContainer.classList.add('hidden');
}
function handleCloseModal() {
    // Closes modal from close button click
    hideModal();
}
function showTooltip(element, message){
  //Shows a tooltip with a given message
    tooltip.textContent = message;
  const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
  tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
    tooltip.setAttribute('aria-hidden', 'false'); // Make the tooltip visible for screen readers
  tooltip.classList.add('visible');
}

function hideTooltip(){
   tooltip.setAttribute('aria-hidden', 'true');
    tooltip.classList.remove('visible');
}
export { showModal, hideModal, handleCloseModal, showTooltip, hideTooltip };
```

*   **DOM Element Selectors:**
    *   `modalContainer`: Selects the modal container element from the document.
    *   `modalContent`: Selects the modal content container where forms will be added in the DOM
    *  `modalCloseButton`: Selects the close button element in the modal.
    *   `tooltip`: Selects the tooltip element from the document.
    *   **Usage:** Used to show, hide, and position the modal and tooltip elements.

*   **`showModal(form)` Function:**
    *   **Purpose:** Displays the modal with the specified form inside of it.
    *   **Parameter:** `form`: The DOM element of the form that needs to be displayed.
    *   **Logic:**
        1.  Clears the previous content of the modal using `innerHTML = '';`.
        2. Appends the new form content to the modal content using `appendChild()`.
        3. Removes the `hidden` class from the modal container, making the modal visible.
    *   **Usage:** Called by other modules such as `forms.js` to show different modals.

*   **`hideModal()` Function:**
    *   **Purpose:** Hides the modal.
    *   **Logic:** Adds the `hidden` class to the modal container, hiding it from view.
    *   **Usage:** Called by other modules like `forms.js` when the modal needs to be hidden.

*   **`handleCloseModal()` Function:**
    *   **Purpose:** A helper function that hides the modal.
    *   **Logic:** Calls the `hideModal()` function.
    *   **Usage:** Called when the close modal button is clicked.

*   **`showTooltip(element, message)` Function:**
    *   **Purpose:** Displays a tooltip with a given message at the bottom of the selected element.
    *  **Parameters:**
       *   `element`: The DOM element relative to which tooltip needs to be positioned.
       *   `message`: The text message of the tooltip.
    *   **Logic:**
        1.  Sets the text content of the tooltip to the provided `message`.
        2.  Gets the `ClientRect` of the `element` to position the tooltip relative to the `element`.
        3.  Sets the `left` and the `top` styles of the tooltip using the element position and add scroll offset.
        4.  Makes the tooltip visible to the screen readers by setting the `aria-hidden` to false.
        5.  Adds the `visible` class to make the tooltip visible.
    *  **Usage:** Called in `script.js` on event listeners on elements that need tooltips.

*   **`hideTooltip()` Function:**
    *   **Purpose:** Hides the tooltip.
    *   **Logic:**
       1. Sets the `aria-hidden` attribute to `true` to make the tooltip invisible to screen readers.
        2. Removes the `visible` class from the tooltip, hiding it.
    *   **Usage:** Called in `script.js` to hide tooltips on mouse out events.

*   **`export` Statement:** Exports all the UI functions to be used in other modules such as `script.js`.

### 7. `script.js` - Main Script

This is the main script that ties everything together, orchestrating the interactions and events on the