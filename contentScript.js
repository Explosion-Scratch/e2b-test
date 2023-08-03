```javascript
let comments = [];

chrome.storage.sync.get('comments', function(data) {
    if (data.comments) {
        comments = data.comments;
        showComments();
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === 'NEW_COMMENT') {
        comments.push(request.comment);
        showComments();
    } else if (request.message === 'UPDATE_COMMENT') {
        const index = comments.findIndex(comment => comment.id === request.comment.id);
        comments[index] = request.comment;
        showComments();
    } else if (request.message === 'DELETE_COMMENT') {
        comments = comments.filter(comment => comment.id !== request.comment.id);
        showComments();
    }
});

function showComments() {
    comments.forEach(comment => {
        const element = document.getElementById(comment.elementId);
        if (element) {
            const bubble = document.createElement('div');
            bubble.id = `comment-bubble-${comment.id}`;
            bubble.className = 'comment-bubble';
            bubble.textContent = comment.text;
            bubble.addEventListener('click', function() {
                chrome.runtime.sendMessage({message: 'SHOW_COMMENT', comment: comment});
            });
            element.appendChild(bubble);
        }
    });
}

function hideComments() {
    const bubbles = document.querySelectorAll('.comment-bubble');
    bubbles.forEach(bubble => bubble.remove());
}
```