document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContent = document.querySelector('.modal-content');
    const modalClose = document.querySelector('.modal-close');

    // Toggle modal
    document.querySelectorAll('.toggle-details').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const bookId = button.getAttribute('data-book-id');
            const card = button.closest('.explore__card');
            
            // Get book details from the data attribute
            const books = JSON.parse(document.getElementById('booksData').value);
            const book = books.find(b => b.id == bookId);
            
            if (book) {
                modalContent.querySelector('.modal-title').textContent = book.title;
                modalContent.querySelector('.modal-description').innerHTML = `<strong>Description:</strong> ${book.description || 'No description available'}`;
                modalContent.querySelector('.modal-publisher').innerHTML = `<strong>Publisher:</strong> ${book.publisher || 'Not specified'}`;
                modalContent.querySelector('.modal-isbn').innerHTML = `<strong>ISBN:</strong> ${book.isbn || 'Not specified'}`;
                modalContent.querySelector('.modal-tags').innerHTML = book.tags && book.tags.length > 0 
                    ? `<strong>Tags:</strong> ${book.tags.join(', ')}` 
                    : '';
                
                modalOverlay.classList.add('active');
            }
        });
    });

    // Close modal functionality
    modalClose.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            modalOverlay.classList.remove('active');
        }
    });

    // Search functionality
    const searchInput = document.querySelector('.search__input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('.explore__card').forEach(card => {
                const title = card.querySelector('.explore__title').textContent.toLowerCase();
                const author = card.querySelector('.explore__author').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.explore__button');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const bookId = button.getAttribute('data-id');
            if (!bookId) {
                console.error('Book ID is missing');
                alert('Error: Book ID is missing');
                return;
            }

            try {
                const response = await fetch('/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bookId })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    alert('Item added to cart successfully!');
                } else {
                    console.warn('Add to cart failed:', data.message || 'Unknown error');
                    alert(`Failed to add item to cart: ${data.message || 'Please try again'}`);
                }
            } catch (error) {
                console.error('Error adding to cart:', error.message);
                alert('Error adding item to cart. Please check your connection and try again.');
            }
        });
    });

    // Wishlist functionality
    const wishlistIcons = document.querySelectorAll('.wishlist-icon');
    wishlistIcons.forEach(icon => {
        icon.addEventListener('click', async (e) => {
            e.preventDefault();
            const bookId = icon.getAttribute('data-id');
            try {
                const response = await fetch('/wishlist/toggle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bookId })
                });
                
                const data = await response.json();
                if (data.success) {
                    if (data.isAdded) {
                        icon.classList.remove('ri-heart-line');
                        icon.classList.add('ri-heart-fill', 'active');
                    } else {
                        icon.classList.remove('ri-heart-fill', 'active');
                        icon.classList.add('ri-heart-line');
                    }
                    alert(data.message);
                } else {
                    alert('Failed to update wishlist');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating wishlist');
            }
        });
    });
});