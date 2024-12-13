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