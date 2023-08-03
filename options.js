```javascript
let comments = [];

// Load comments from Chrome Storage API
chrome.storage.sync.get('comments', function(data) {
  if (data.comments) {
    comments = data.comments;
    showComments();
  }
});

// Function to display comments
function showComments() {
  const commentList = document.getElementById('commentList');
  commentList.innerHTML = '';
  comments.forEach(function(comment) {
    const li = document.createElement('li');
    li.textContent = comment.text;
    commentList.appendChild(li);
  });
}

// Listen for NEW_COMMENT message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'NEW_COMMENT') {
    comments.push(request.comment);
    showComments();
  }
});

// Listen for UPDATE_COMMENT message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'UPDATE_COMMENT') {
    const index = comments.findIndex(comment => comment.id === request.comment.id);
    if (index !== -1) {
      comments[index] = request.comment;
      showComments();
    }
  }
});

// Listen for DELETE_COMMENT message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'DELETE_COMMENT') {
    const index = comments.findIndex(comment => comment.id === request.comment.id);
    if (index !== -1) {
      comments.splice(index, 1);
      showComments();
    }
  }
});
```