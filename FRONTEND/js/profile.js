// profile.js
import * as api from "./api.js";
import * as dom from "./dom.js";
import * as forms from "./forms.js";
import * as ui from "./ui.js";
import * as utils from "./utils.js";

// Profile Page specific logic
// Check if the user is already logged in
function checkLoggedIn() {
  const loginButton = document.querySelector(".login-button");
  const registerButton = document.querySelector(".register-button");
  const logoutButton = document.querySelector(".logout-button");
  const createButton = document.querySelector(".create-post-button");
  const links = document.querySelector('header nav ul');

  if (api.isLoggedIn()) {
    // Hide login/register buttons if the user is logged in
    if (loginButton) {
      loginButton.style.display = "none";
    }
    if (registerButton) {
      registerButton.style.display = "none";
    }
    if (logoutButton) {
      logoutButton.style.display = "inline-block";
    }
    if (createButton) {
      createButton.style.display = "inline-block";
    }
    if (links) {
      links.style.display = "flex";
    }
  } else {
    if (loginButton) {
      loginButton.style.display = "inline-block";
    }
    if (registerButton) {
      registerButton.style.display = "inline-block";
    }
    if (logoutButton) {
      logoutButton.style.display = "none";
    }
    if (createButton) {
      createButton.style.display = "none";
    }
    if (links) {
      links.style.display = "none";
    }
  }
}

async function loadProfilePage() {
  if (window.location.pathname.includes("profile.html")) {
    await loadUserProfile();
  }
}
async function loadUserProfile() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.user_id !== null) {
      const userId = Number(user.user_id);

      const profile = await api.getUserProfile(userId);
      console.log("profile: " + profile);
      const profilePosts = await api.getUserPosts(userId);
      console.log("profilePosts: " + profilePosts);
      const followers = await api.getFollowers(userId);
      console.log("followers: " + followers);
      const following = await api.getFollowing(userId);
      console.log("following: " + following);

      const profileCover = document.querySelector(".profile-cover");
      profileCover.src = profile.profileCov
        ? profile.profileCov
        : profileCover.remove();

      const profilePic = document.querySelector(".profile-pic");
      profilePic.src = profile.profilePic;

      document.querySelector(".profile-name").textContent = profile.name;
      // document.querySelector(".profile-bio").textContent = profile.bio;
      document.querySelector("#profile-post-count").textContent =
        profilePosts.length;
      document.querySelector("#profile-follower-count").textContent =
        followers.length;
      document.querySelector("#profile-following-count").textContent =
        following.length;

      const profilePostsContainer = document.querySelector(".user-posts");
      profilePosts.forEach((post) => {
        dom.appendPost(profilePostsContainer, post);
      });

      const followerListContainer = document.querySelector("#follower-list");
      followers.forEach((follower) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<img src="${follower.profile_pic}" alt="${follower.name}"> <span class="follower-username">${follower.name}</span>`;
        followerListContainer.appendChild(listItem);
      });
    }
  } catch (error) {
    console.error("Failed to load profile: ", error);
  }
}
async function loadEditProfileModal(event) {
  try {
    const userId = Number(event.target.dataset.userId);
    const profile = await api.getUserProfile(userId);
    ui.showModal(forms.createEditProfileForm(profile));
  } catch (error) {
    console.error("Failed to load the edit profile modal: ", error);
  }
}

// Settings Page Specific Logic
async function loadSettingsPage() {
  if (window.location.pathname.includes("settings.html")) {
    try {
      const userId = Number(JSON.parse(localStorage.getItem("user")).user_id);
      const profile = await api.getUserProfile(userId);
      const nameInput = document.querySelector("#name");
      const emailInput = document.querySelector("#email");
      const bioTextArea = document.querySelector("#bio");
      nameInput.value = utils.capitalize(profile.name);
      emailInput.value = profile.email;
      bioTextArea.value = profile.bio;

      const settingForm = document.querySelector(".settings-form form");
      settingForm.addEventListener("submit", handleUpdateProfile);
    } catch (error) {
      console.error("Failed to load settings page: ", error);
    }
  }
}
async function handleUpdateProfile(event) {
  event.preventDefault();
  const userId = Number(JSON.parse(localStorage.getItem("user")).user_id);
  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const bioTextArea = document.querySelector("#bio");

  const updateData = {
    name: nameInput.value.toLowerCase(),
    email: emailInput.value.toLowerCase(),
    bio: bioTextArea.value.toLowerCase(),
  };
  try {
    await api.updateProfile(userId, updateData);
    alert("Profile updated successfully!"); // show success alert
  } catch (error) {
    console.error("Failed to update the profile: ", error);
  }
}

async function handleLogout() {
  try {
    api.logout();
    checkLoggedIn();
    alert("Logged out successfully!");
  } catch (error) {
    console.error("Error logging out: ", error);
    alert("Error logging out: " + error.message);
  }
}

export {
  checkLoggedIn,
  loadProfilePage,
  loadUserProfile,
  loadEditProfileModal,
  loadSettingsPage,
  handleUpdateProfile,
  handleLogout,
};
