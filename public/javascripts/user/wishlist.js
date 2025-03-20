// Show/Hide empty state based on wishlist items
function toggleEmptyState() {
    const wishlistContent = document.getElementById('wishlistContent');
    const emptyWishlist = document.getElementById('emptyWishlist');
    
    if (wishlistContent.children.length === 0) {
        emptyWishlist.style.display = 'block';
        wishlistContent.style.display = 'none';
    } else {
        emptyWishlist.style.display = 'none';
        wishlistContent.style.display = 'grid';
    }
}

// Remove item from wishlist
document.querySelectorAll('.wishlist__remove').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.wishlist__card');
        card.remove();
        toggleEmptyState();
    });
});

// Initialize empty state
document.addEventListener('DOMContentLoaded', toggleEmptyState);