```javascript
let comments = [];

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('commentForm').addEventListener('submit', addComment);
    chrome.storage.sync.get('comments', function(data) {
        if (data.comments) {
            comments = data.comments;
            showComments();
        }
    });
});

function addComment(e) {
    e.preventDefault();
    let text = document.getElementById('commentText').value;
    let comment = { id: Date.now(), text: text, replies: [] };
    comments.push(comment);
    chrome.storage.sync.set({ 'comments': comments }, function() {
        document.getElementById('commentText').value = '';
        showComments();
        chrome.runtime.sendMessage({ type: 'NEW_COMMENT', comment: comment });
    });
}

function showComments() {
    let commentList = document.getElementById('commentList');
    commentList.innerHTML = '';
    comments.forEach(function(comment) {
        let li = document.createElement('li');
        li.textContent = comment.text;
        li.addEventListener('click', function() {
            chrome.runtime.sendMessage({ type: 'UPDATE_COMMENT', comment: comment });
        });
        commentList.appendChild(li);
    });
}

function deleteComment(id) {
    comments = comments.filter(comment => comment.id !== id);
    chrome.storage.sync.set({ 'comments': comments }, function() {
        showComments();
        chrome.runtime.sendMessage({ type: 'DELETE_COMMENT', id: id });
    });
}
```