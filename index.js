var editMode = false;
var editedPostId = null;

// Function to add or update a blog post
function addOrUpdateBlog() {
    var title = document.getElementById('blogTitle').value;
    var imageUrl = document.getElementById('blogURL').value;
    var description = document.getElementById('blogDescription').value;

    var blogPost = {
        title: title,
        imageUrl: imageUrl,
        description: description
    };

    if (editMode) {
        // If in edit mode, perform an update
        console.log(blogPost)
        fetch('https://crudcrud.com/api/be9af90eecc84e8eb4ec496cd0640646/blogs/' + editedPostId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(blogPost)
        })
            
            .then(data => {
                console.log('Blog post updated:', data);
                // Display the updated blog post on the page
                updateDisplayedBlog({...blogPost,_id:editedPostId});
                // Reset the form and button to their original state
                resetFormAndButton();
            })
            .catch(error => {
                console.error('Error updating blog post:', error);
            });
    } else {
        // If not in edit mode, perform an add
        fetch('https://crudcrud.com/api/be9af90eecc84e8eb4ec496cd0640646/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(blogPost)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Blog post added:', data);
                // Display the added blog post on the page
                displayBlogPost(data);
                // Reset the form
                document.getElementById('blogForm').reset();
            })
            .catch(error => {
                console.error('Error adding blog post:', error);
            });
    }
}

// Function to display a blog post
function displayBlogPost(blogPost) {
    var blogContainer = document.getElementById('blogContainer');

    var postElement = document.createElement('div');
    postElement.classList.add('blogPost');
    postElement.setAttribute('data-id', blogPost._id);
    var img = document.createElement('img');
    img.src = blogPost.imageUrl;
    img.alt = blogPost.title;

    var titleElement = document.createElement('h3');
    titleElement.textContent = blogPost.title;

    var descriptionElement = document.createElement('p');
    descriptionElement.textContent = blogPost.description;

    // Create "Edit" and "Delete" buttons
    var editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('editButton');
    editButton.onclick = function () {
        // Set the form fields with the current blog post values
        document.getElementById('blogTitle').value = blogPost.title;
        document.getElementById('blogURL').value = blogPost.imageUrl;
        document.getElementById('blogDescription').value = blogPost.description;
        // Set the form in edit mode
        editMode = true;
        // Save the edited post id for updating later
        editedPostId = blogPost._id;
        console.log(editedPostId)
        // Change the button text to "Edit post"
        document.getElementById('submitButton').textContent = 'Edit post';
    };

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('deleteButton');
    deleteButton.onclick = function () {
        // Perform a DELETE request to remove the blog post
        fetch('https://crudcrud.com/api/be9af90eecc84e8eb4ec496cd0640646/blogs/' + blogPost._id, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete blog post');
                }
                blogContainer.removeChild(postElement);
            })
            // .then(data => {
            //     console.log('Blog post deleted:', data);
            //     // Remove the blog post element from the page
            //     blogContainer.removeChild(postElement);
            // })
            .catch(error => {
                console.error('Error deleting blog post:', error);
            });
    };

    postElement.appendChild(titleElement);
    postElement.appendChild(img);
    postElement.appendChild(descriptionElement);
    postElement.appendChild(editButton);
    postElement.appendChild(deleteButton);

    blogContainer.appendChild(postElement);
}

// Function to update the displayed blog post
function updateDisplayedBlog(blogPost) {
    var blogContainer = document.getElementById('blogContainer');
    console.log(blogContainer.children)
    var postElement = blogContainer.querySelector('.blogPost[data-id="' + blogPost._id + '"]');

    if (postElement) {
        // Update the existing blog post element
        postElement.querySelector('img').src = blogPost.imageUrl;
        postElement.querySelector('h3').textContent = blogPost.title;
        postElement.querySelector('p').textContent = blogPost.description;
    } else {
        // If the post is not found, display it as a new post
        displayBlogPost(blogPost);
    }
}

// Function to reset the form and button to their original state
function resetFormAndButton() {
    editMode = false;
    editedPostId = null;
    document.getElementById('submitButton').textContent = 'Add post';
    document.getElementById('blogForm').reset();
}

// Fetch and display existing blog posts when the page loads
window.onload = function () {
    fetchAndDisplayBlogs();
};

function fetchAndDisplayBlogs() {
    fetch('https://crudcrud.com/api/be9af90eecc84e8eb4ec496cd0640646/blogs')
        .then(response => response.json())
        .then(data => {
            data.forEach(blogPost => {
                displayBlogPost(blogPost);
            });
        })
        .catch(error => {
            console.error('Error fetching blog posts:', error);
        });
}

