```javascript
let comments = [];

// Load comments from Chrome Storage API
chrome.storage.sync.get(['comments'], function(result) {
  comments = result.comments || [];
  showComments();
});

// Listen for UPDATE_COMMENT message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'UPDATE_COMMENT') {
    updateComment(request.comment);
  }
});

// Listen for DELETE_COMMENT message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'DELETE_COMMENT') {
    deleteComment(request.commentId);
  }
});

function showComments() {
  const commentList = document.getElementById('commentList');
  commentList.innerHTML = '';
  comments.forEach(comment => {
    const listItem = document.createElement('li');
    listItem.textContent = comment.text;
    commentList.appendChild(listItem);
  });
}

function hideComments() {
  const commentList = document.getElementById('commentList');
  commentList.innerHTML = '';
}

function updateComment(updatedComment) {
  comments = comments.map(comment => 
    comment.id === updatedComment.id ? updatedComment : comment
  );
  chrome.storage.sync.set({comments: comments}, function() {
    showComments();
  });
}

function deleteComment(commentId) {
  comments = comments.filter(comment => comment.id !== commentId);
  chrome.storage.sync.set({comments: comments}, function() {
    showComments();
  });
}

document.getElementById('replyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const replyText = e.target.elements.replyText.value;
  const commentId = e.target.elements.commentId.value;
  const reply = { text: replyText, timestamp: Date.now() };
  const updatedComment = comments.find(comment => comment.id === commentId);
  updatedComment.replies.push(reply);
  updateComment(updatedComment);
});
```