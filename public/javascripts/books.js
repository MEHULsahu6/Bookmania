// Get DOM elements
const addBookBtn = document.getElementById('addBookBtn');
const bookModal = document.getElementById('bookModal');
const deleteModal = document.getElementById('deleteModal');
const closeButtons = document.querySelectorAll('.close-modal');
const cancelButtons = document.querySelectorAll('.cancel-btn');
const bookForm = document.getElementById('bookForm');
const imagePreview = document.getElementById('imagePreview');

// Show/Hide Modals
function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (modal === bookModal) {
        bookForm.reset();
        imagePreview.innerHTML = '';
    }
}

// Handle Image Preview
document.getElementById('bookCover').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

// Event Listeners
addBookBtn.addEventListener('click', () => {
    showModal(bookModal);
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        hideModal(modal);
    });
});

cancelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        hideModal(modal);
    });
});

// Edit Book
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function() {
        const bookCard = this.closest('.book-card');
        const bookTitle = bookCard.querySelector('h3').textContent;
        const bookAuthor = bookCard.querySelector('.author').textContent;
        const bookPrice = bookCard.querySelector('.price').textContent.replace('$', '');
        const bookStock = bookCard.querySelector('.stock').textContent.replace('In Stock: ', '');
        
        // Fill form with current book data
        document.getElementById('bookTitle').value = bookTitle;
        document.getElementById('bookAuthor').value = bookAuthor;
        document.getElementById('bookPrice').value = bookPrice;
        document.getElementById('bookStock').value = bookStock;
        
        showModal(bookModal);
    });
});

// Delete Book
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
        showModal(deleteModal);
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        hideModal(e.target);
    }
});

// Form submission handling
bookForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Here you would typically send the data to your server
    // For now, we'll just close the modal
    hideModal(bookModal);
});

// Add notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="ri-${type === 'success' ? 'checkbox-circle-line' : 'error-warning-line'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}