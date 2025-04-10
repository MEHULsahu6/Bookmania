document.addEventListener('DOMContentLoaded', function() {
    const editProfileBtn = document.querySelector('.action-btn.primary');
    const modal = document.getElementById('editProfileModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const profileImage = document.getElementById('profile-image');
    const previewImage = document.getElementById('preview-image');

    // Open modal
    editProfileBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal
    const closeModalFunction = () => {
        modal.style.display = 'none';
    };

    closeModal.addEventListener('click', closeModalFunction);
    cancelBtn.addEventListener('click', closeModalFunction);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunction();
        }
    });

    // Handle image preview
    profileImage.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});


function openReviewModal(bookId, bookTitle) {
    const modal = document.getElementById('reviewModal');
    document.getElementById('bookId').value = bookId;
    modal.style.display = 'block';
}

document.querySelector('.close').onclick = function() {
    document.getElementById('reviewModal').style.display = 'none';
}

document.getElementById('reviewForm').onsubmit = async function(e) {
    e.preventDefault();
    
    const bookId = document.getElementById('bookId').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const comment = document.getElementById('comment').value;

    try {
        const response = await fetch('/review/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookId, rating, comment })
        });

        const data = await response.json();
        
        if (data.success) {
            alert('Review submitted successfully!');
            location.reload();
        } else {
            alert(data.message || 'Error submitting review');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting review');
    }
};