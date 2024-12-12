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