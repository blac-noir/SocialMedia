// forms.js

import * as api from "./api.js";
import * as utils from "./utils.js";
import { hideModal } from "./ui.js";

function createLoginForm() {
  // Creates and returns the login form element
  const form = document.createElement("form");
  form.innerHTML = `
          <div class="modal-header">
            <h2>Login</h2>
          </div>
          <form class="modal-form">
            <div class="form-group">
              <input type="email" id="login-email" placeholder="Email" required>
            </div>
            <div class="form-group">
              <input type="password" placeholder="Password" id="login-password" required>
            </div>
            <div class="form-group" align='center'>
              <div class="loader"></div>
              <p style="color:red;display:none;">Login failed. Please check your credentials.</p>
            </div>
            <button type="submit" class="modal-submit">Log In</button>
          </form>
          <div class="modal-links">
            <a href="#">Forgot password?</a>
          </div>
          </div>
      `;
  form.addEventListener("submit", handleLoginSubmit);
  return form;
}

async function handleLoginSubmit(event) {
  //Handles login form submissions
  event.preventDefault();
  const email = document.querySelector("#login-email").value;
  const password = document.querySelector("#login-password").value;
  document.querySelector(".loader").style.display = "block";

  try {
    const response = await api.login(email, password);
    console.log("Login successful:", response);
    hideModal();
  } catch (error) {
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".form-group p").style.display = "block";
    console.error("Login failed:", error);
  }
}

function createRegisterForm() {
  // Creates and returns the registration form element
  const form = document.createElement("form");
  form.innerHTML = `
        <div class="modal-header">
          <h2>Sign Up</h2>
        </div>
        <form class="modal-form">
          <div class="form-group">
            <input type="text" id="register-name" placeholder="Username" required>
          </div>
          <div class="form-group">
            <input type="email" id="register-email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <input type="password" id="register-password" placeholder="Password" id="login-password" required>
          </div>
          <div class="form-group" align='center'>
              <div class="loader"></div>
              <p style="color:red;display:none;">Registration failed. Please try again.</p>
          </div>
          <button type="submit" class="modal-submit">Register</button>
        </form>
        </div>
      `;
  form.addEventListener("submit", handleRegisterSubmit);
  return form;
}

async function handleRegisterSubmit(event) {
  //Handles the registration form submissions
  event.preventDefault();
  const name = document.querySelector("#register-name").value.toLowerCase();
  const email = document.querySelector("#register-email").value.toLowerCase();
  const password = document
    .querySelector("#register-password")
    .value.toLowerCase();
  document.querySelector(".loader").style.display = "block";


  try {
    const response = await api.register(name, email, password);
    await api.login(email, password);
    console.log("Registration successful:", response);
    hideModal();
  } catch (error) {
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".form-group p").style.display = "block";
    console.error("Registration failed:", error);
    // alert("Registration failed. Please try again.");
  }
}

function createPostForm() {
  //Creates and returns the new post form
  const form = document.createElement("form");
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
  form.addEventListener("submit", handlePostSubmit);
  return form;
}

async function handlePostSubmit(event) {
  event.preventDefault();
  const content = document.querySelector("#post-content").value;
  const image = document.querySelector("#post-image").value;

  try {
    const newPost = await api.createPost(content, image);
    console.log("New Post Created", newPost);
    hideModal();
    window.location.reload();
  } catch (error) {
    console.error("Failed to create the post: ", error);
    alert("Failed to create new post.");
  }
}

function createEditProfileForm(userData) {
  // Creates and returns a profile edit form
  const form = document.createElement("form");
  form.innerHTML = `
      <h2>Edit Profile</h2>
      <div class="form-group">
        <label for="edit-name">Username:</label>
        <input type="text" id="edit-name" value="${utils.capitalize(
          userData.name
        )}" required>
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
  form.addEventListener("submit", handleEditProfileSubmit);
  return form;
}

async function handleEditProfileSubmit(event) {
  event.preventDefault();
  const userId = Number(JSON.parse(localStorage.getItem("user")).user_id);
  const name = document.querySelector("#edit-name").value.toLowerCase();
  const email = document.querySelector("#edit-email").value.toLowerCase();
  const bio = document.querySelector("#edit-bio").value;

  try {
    const response = await api.updateProfile(userId, {
      name: name,
      email: email,
      bio: bio,
    });
    console.log("Profile update success: ", response);
    hideModal();
    window.location.reload();
  } catch (error) {
    console.error("Failed to update the profile: ", error);
    alert("Failed to update the profile");
  }
}
export {
  createLoginForm,
  createRegisterForm,
  createPostForm,
  createEditProfileForm,
};
