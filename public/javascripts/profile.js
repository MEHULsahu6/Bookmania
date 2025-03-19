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