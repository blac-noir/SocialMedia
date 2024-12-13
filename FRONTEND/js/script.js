// script.js
import * as api from './api.js';
import * as dom from './dom.js';
import * as state from './state.js';
import * as utils from './utils.js';
import * as forms from './forms.js';
import * as ui from './ui.js';

// Event listeners to show different modals
document.addEventListener('click', function (event) {
    if(event.target.classList.contains('login-button')){
       ui.showModal(forms.createLoginForm());
       console.log('login');
    }
    if(event.target.classList.contains('register-button')){
        ui.showModal(forms.createRegisterForm());
        console.log('register');
    }
    if (event.target.classList.contains('create-post-button')){
         ui.showModal(forms.createPostForm());
    }
     if (event.target.classList.contains('edit-profile-button')){
         //get user profile and create the edit profile form
          loadEditProfileModal();
    }
});

//Home Page Specific Logic
async function loadHomePage(){
    if (document.querySelector('.feed')) { // Checks if it's the home page before applying logic
         await loadPosts();
        document.addEventListener('mouseover', handleTooltipShow); //enable tooltips for home page
        document.addEventListener('mouseout', handleTooltipHide); //enable tooltips for home page

    }
}
async function loadPosts(page = 1) {
    // Fetches and displays posts for the feed with infinite scroll
      state.setAppState({loading: true}); // set loading state
    try {
        const posts = await api.getPosts(page);
        const feedContainer = document.querySelector('.feed');

        if (page === 1) {
          feedContainer.innerHTML = ''; // clear the container on new page load
            state.setAppState({currentFeed: posts})
        } else {
             state.setAppState({currentFeed: [...state.getAppState().currentFeed, ...posts]});
         }
        state.getAppState().currentFeed.forEach(post => {
              dom.appendPost(feedContainer, post);
           })
    } catch(error){
         console.error('Failed to load posts:', error);
    } finally {
        state.setAppState({ loading: false}); // Set loading to false once posts have loaded or in case of an error
    }
}
async function handleLikeClick(event) {
    // Handles liking a post
    if (event.target.classList.contains('like-button')) {
        const postId = event.target.dataset.postId;
        try{
            await api.likePost(postId);
            // visual update for the like button if needed
            console.log('Post liked successfully', postId);
            ui.showTooltip(event.target, 'Liked!');
        } catch(error){
            console.error('Failed to like the post: ', error);
              ui.showTooltip(event.target, 'Failed to like post!');
        }
    }
}

async function handleCommentClick(event) {
    // Handles clicking comment button on a post
   if(event.target.classList.contains('comment-button')){
      const postId = event.target.dataset.postId;
      window.location.href = `post.html?id=${postId}`; // Redirect to post page with the post id
    }
}
function handleTooltipShow(event){
    if(event.target.classList.contains('like-button')){
        ui.showTooltip(event.target, 'Like the Post')
    } else if(event.target.classList.contains('comment-button')){
        ui.showTooltip(event.target, 'Comment on this post')
    }
}
function handleTooltipHide(){
    ui.hideTooltip();
}

//Post Page Specific Logic
async function loadPostPage(){
    if(window.location.pathname.includes("post.html")){
         // Get the post ID from the query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('id');
         if(postId){
           await loadSinglePost(postId);
         }
    }
}
async function loadSinglePost(postId) {
    // Fetches and displays a single post and its comments
    try {
        const post = await api.getSinglePost(postId);
          const mainContainer = document.querySelector('.container');
          mainContainer.innerHTML = ''; //Clear the initial content

          const postArticle = dom.createPostElement(post);
           mainContainer.appendChild(postArticle);
          // load the comments
          const commentContainer = document.querySelector('.comments');
          post.comments.forEach(comment => {
               dom.appendComment(commentContainer, comment);
            })

          const commentForm = document.querySelector('.comment-form');
           commentForm.addEventListener('submit', async (event) => {
            event.preventDefault(); //prevent the default form action
             const commentText = commentForm.querySelector('textarea').value; // get comment text
                try{
                     const newComment = await api.addComment(postId, commentText); //post a comment
                    dom.appendComment(commentContainer, newComment) // Append new comment
                    commentForm.querySelector('textarea').value = ''; //clear comment input
                } catch(error){
                  console.error('Failed to add the comment: ', error);
                }
            })

    } catch (error) {
        console.error('Failed to load post: ', error);
    }
}

// Profile Page specific logic
async function loadProfilePage(){
  if(window.location.pathname.includes('profile.html')){
      await loadUserProfile();
       document.addEventListener('mouseover', handleTooltipShow); //enable tooltips for profile page
        document.addEventListener('mouseout', handleTooltipHide); //enable tooltips for profile page
    }
}
async function loadUserProfile(){
    try {
      // Hardcoded user id for demo purposes, replace when you have real users
       const userId = 1;
       const profile = await api.getUserProfile(userId);
       const profilePosts = await api.getUserPosts(userId);
       const followers = await api.getFollowers(userId);
        const following = await api.getFollowing(userId);
       document.querySelector('.profile-name').textContent = profile.name;
       document.querySelector('.profile-bio').textContent = profile.bio;
        document.querySelector('#profile-post-count').textContent = profilePosts.length;
        document.querySelector('#profile-follower-count').textContent = followers.length;
        document.querySelector('#profile-following-count').textContent = following.length;

        const profilePostsContainer = document.querySelector('.user-posts');
        profilePosts.forEach(post => {
            dom.appendPost(profilePostsContainer, post);
        });

      const followerListContainer = document.querySelector('#follower-list');
      followers.forEach(follower =>{
            const listItem = document.createElement('li');
           listItem.innerHTML = `<img src="${follower.profile_pic}" alt="${follower.name}"> <span class="follower-username">${follower.name}</span>`;
           followerListContainer.appendChild(listItem);
        });

    } catch(error){
         console.error('Failed to load profile: ', error);
    }
}
async function loadEditProfileModal(){
    try {
      // Hardcoded user id for demo purposes, replace when you have real users
        const userId = 1;
       const profile = await api.getUserProfile(userId);
      ui.showModal(forms.createEditProfileForm(profile));
    } catch(error){
        console.error('Failed to load the edit profile modal: ', error);
    }

}


// Settings Page Specific Logic
async function loadSettingsPage() {
    if(window.location.pathname.includes('settings.html')){
        try{
           //hard coded for demo, this should come from current user
            const userId = 1;
             const profile = await api.getUserProfile(userId);
           const nameInput = document.querySelector('#name');
            const emailInput = document.querySelector('#email');
            const bioTextArea = document.querySelector('#bio');
            nameInput.value = profile.name;
             emailInput.value = profile.email;
            bioTextArea.value = profile.bio;


            const settingForm = document.querySelector('.settings-form form');
            settingForm.addEventListener('submit', handleUpdateProfile);

        } catch(error){
            console.error('Failed to load settings page: ', error)
        }
     }
}
async function handleUpdateProfile(event){
    event.preventDefault();
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const bioTextArea = document.querySelector('#bio');

   const updateData = {
         name: nameInput.value,
         email: emailInput.value,
         bio: bioTextArea.value
    }
   try {
         await api.updateProfile(updateData);
         alert('Profile updated successfully!'); // show success alert

    } catch(error){
        console.error('Failed to update the profile: ', error);
    }
}


//Infinite Scroll Implementation
function handleInfiniteScroll() {
    const scrollBottom = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = window.scrollY;

    if (scrollBottom - scrolled <= 200 && !state.getAppState().loading) {
        // Load more when near bottom and not already loading
      loadPosts(state.getAppState().currentFeed.length / 10 + 1); // Assuming 10 posts per page
        console.log('Loading more posts...')
    }
}

// Initialize functionality on different pages
function init(){
    loadHomePage();
    loadPostPage();
    loadProfilePage();
    loadSettingsPage();
    // close modal from button
    ui.modalCloseButton.addEventListener('click', ui.handleCloseModal);
    // Add event listeners for global interactions
    document.addEventListener('click', handleLikeClick);
    document.addEventListener('click', handleCommentClick);

    // Add infinite scrolling event
    window.addEventListener('scroll', handleInfiniteScroll);
}

init();