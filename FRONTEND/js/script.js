// script.js
import * as api from "./api.js";
import * as dom from "./dom.js";
import * as state from "./state.js";
import * as forms from "./forms.js";
import * as ui from "./ui.js";
import * as profile from "./profile.js";

// Event listeners to show different modals
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("login-button")) {
    ui.showModal(forms.createLoginForm());
  }
  if (event.target.classList.contains("register-button")) {
    ui.showModal(forms.createRegisterForm());
  }
  if (event.target.classList.contains("create-post-button")) {
    ui.showModal(forms.createPostForm());
  }
  if (event.target.classList.contains("edit-profile-button")) {
    //get user profile and create the edit profile form
    profile.loadEditProfileModal();
  }
  if (event.target.classList.contains("modal-close")) {
    ui.hideModal();
  }
  if (event.target.classList.contains("logout-button")) {
    const lc = confirm("Are you sure you want to log out?");

    if (lc) {
      profile.handleLogout();
    }
  }
});

//Home Page Specific Logic
async function loadHomePage() {
  if (document.querySelector(".feed")) {
    // Checks if it's the home page before applying logic
    await loadPosts();
  }
}
async function loadPosts(page = 1) {
  // Fetches and displays posts for the feed with infinite scroll
  state.setAppState({ loading: true }); // set loading state
  try {
    const posts = await api.getPosts(page);
    const feedContainer = document.querySelector(".feed");

    if (page === 1) {
      feedContainer.innerHTML = ""; // clear the container on new page load
      state.setAppState({ currentFeed: posts });
    } else {
      state.setAppState({
        currentFeed: [...state.getAppState().currentFeed, ...posts],
      });
    }
    state.getAppState().currentFeed.forEach((post) => {
      dom.appendPost(feedContainer, post);
    });
  } catch (error) {
    console.error("Failed to load posts:", error);
  } finally {
    state.setAppState({ loading: false }); // Set loading to false once posts have loaded or in case of an error
  }
}

//Post Page Specific Logic
async function loadPostPage() {
  if (window.location.pathname.includes("post.html")) {
    // Get the post ID from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    if (postId) {
      await loadSinglePost(postId);
    }
  }
}
async function loadSinglePost(postId) {
  // Fetches and displays a single post and its comments
  try {
    const post = await api.getSinglePost(postId);
    dom.createPostElement(post, true);

    // load the comments
    const commentContainer = document.querySelector(".comments");
    post.comments.forEach((comment) => {
      console.log(comment);
      dom.appendComment(commentContainer, comment);
    });

    const commentForm = document.querySelector(".comment-form");
    const commentButton = document.querySelector(".comment-button2");
    commentButton.addEventListener("click", async (event) => {
      const commentText = commentForm.querySelector("textarea").value; // get comment text
      try {
        const newComment = await api.addComment(postId, commentText); //post a comment
        dom.appendComment(commentContainer, newComment); // Append new comment
        commentForm.querySelector("textarea").value = ""; //clear comment input
      } catch (error) {
        console.error("Failed to add the comment: ", error);
      }
    });
  } catch (error) {
    console.error("Failed to load post: ", error);
  }
}

//Infinite Scroll Implementation
function handleInfiniteScroll() {
  const scrollBottom =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = window.sclocrollY;

  if (scrollBottom - scrolled <= 200 && !state.getAppState().loading) {
    // Load more when near bottom and not already loading
    loadPosts(state.getAppState().currentFeed.length + 2); // Assuming 2 posts per page
    console.log("Loading more posts...");
  }
}

// Initialize functionality on different pages
function init() {
  loadHomePage();
  loadPostPage();
  profile.loadProfilePage();
  profile.loadSettingsPage();
  profile.checkLoggedIn();
  // Add event listeners for global interactions
  document.addEventListener("click", ui.handleLikeClick);
  document.addEventListener("click", ui.handleCommentClick);
  window.addEventListener("scroll", handleInfiniteScroll);
}

init();
