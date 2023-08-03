```javascript
let comments = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ comments: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "NEW_COMMENT") {
    addComment(request.comment);
  } else if (request.type === "UPDATE_COMMENT") {
    updateComment(request.comment);
  } else if (request.type === "DELETE_COMMENT") {
    deleteComment(request.commentId);
  }
});

function addComment(comment) {
  comments.push(comment);
  chrome.storage.sync.set({ comments: comments });
}

function updateComment(updatedComment) {
  comments = comments.map(comment =>
    comment.id === updatedComment.id ? updatedComment : comment
  );
  chrome.storage.sync.set({ comments: comments });
}

function deleteComment(commentId) {
  comments = comments.filter(comment => comment.id !== commentId);
  chrome.storage.sync.set({ comments: comments });
}

chrome.storage.sync.get("comments", data => {
  if (data.comments) {
    comments = data.comments;
  }
});
```