// ui.js
import * as api from "./api.js";
import * as state from "./state.js";
import * as script from "./script.js";

const modalContainer = document.querySelector(".modal-overlay");
const modalContent = document.querySelector("#modal-form-container");

function showModal(form) {
  //Shows the modal with the provided form
  modalContent.innerHTML = "";
  modalContent.appendChild(form);
  modalContainer.classList.add("active");
}

function hideModal() {
  //Hides the modal
  modalContainer.classList.remove("active");
}
function handleCloseModal() {
  // Closes modal from close button click
  hideModal();
}

async function handleLikeClick(event) {
  // Handles liking a post
  if (event.target.classList.contains("like-button")) {
    const postId = event.target.dataset.postId;
    const likeText = event.target.querySelector(".like-text");
    const likeCount = event.target.querySelector(".like-count");
    const likedText = event.target.querySelector(".liked-text");
    try {
      if (event.target.classList.contains("liked")) {
        // User unliked the post
        event.target.classList.remove("liked"); // Remove 'liked' class

        // Unlike Animation
        likeCount.classList.add("slideDown");

        likeCount.addEventListener(
          "animationend",
          () => {
            const currentLikes = Number(likeCount.innerHTML);
            likeCount.innerHTML = currentLikes > 0 ? currentLikes - 1 : 0;

            likeCount.classList.remove("slideDown");
            likedText.classList.remove("show");
            likeText.classList.remove("moveUp");
          },
          { once: true }
        );

        console.log(`Post ${postId} unliked`);
        // Send an API call to mark as unliked
        await api.unlikePost(postId);
      } else {
        // User liked the post
        event.target.classList.add("liked"); // Add 'liked' class
        // Like Animation
        likeText.classList.add("moveUp");
        likeCount.classList.add("slideUp");

        const currentLikes = parseInt(likeCount.innerHTML);
        // Increase count after like animation
        likeText.addEventListener(
          "animationend",
          () => {
            event.target.classList.add("liked");
            likeCount.innerHTML = currentLikes + 1;
            likedText.classList.add("show"); // Show liked text once animation finishes
          },
          { once: true }
        );

        console.log(`Post ${postId} liked`);
        // Send an API call to mark as liked
        await api.likePost(postId);
      }
    } catch (error) {
      console.error("Failed to like the post: ", error);
    }
  }
}

async function handleCommentClick(event) {
  // Handles clicking comment button on a post
  if (event.target.classList.contains("comment-button")) {
    const postId = event.target.dataset.postId;
    window.location.href = `post.html?id=${postId}`; // Redirect to post page with the post id
  }
}

export {
  showModal,
  hideModal,
  handleCloseModal,
  handleLikeClick,
  handleCommentClick,
};
