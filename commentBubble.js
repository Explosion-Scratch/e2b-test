```javascript
let comments = [];

chrome.storage.sync.get('comments', function(data) {
    if (data.comments) {
        comments = data.comments;
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
            bubble.addEventListener('mouseover', function() {
                bubble.classList.add('expanded');
            });
            bubble.addEventListener('mouseout', function() {
                bubble.classList.remove('expanded');
            });
            bubble.addEventListener('click', function() {
                chrome.runtime.sendMessage({type: 'SHOW_COMMENT', id: comment.id});
            });
            element.appendChild(bubble);
        }
    });
}

function addComment(comment) {
    comments.push(comment);
    chrome.storage.sync.set({comments: comments}, function() {
        showComments();
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'NEW_COMMENT') {
        addComment(request.comment);
    } else if (request.type === 'UPDATE_COMMENT') {
        comments = comments.map(comment => comment.id === request.comment.id ? request.comment : comment);
        chrome.storage.sync.set({comments: comments}, function() {
            showComments();
        });
    } else if (request.type === 'DELETE_COMMENT') {
        comments = comments.filter(comment => comment.id !== request.comment.id);
        chrome.storage.sync.set({comments: comments}, function() {
            showComments();
        });
    }
});

window.addEventListener('load', function() {
    showComments();
});
```