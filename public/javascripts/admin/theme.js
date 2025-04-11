const themeButton = document.getElementById('theme-button');
const body = document.body;

const darkTheme = 'dark-theme';
const iconTheme = 'ri-sun-line';

const selectedTheme = localStorage.getItem('admin-theme');
const selectedIcon = localStorage.getItem('admin-icon');

if (selectedTheme) {
    body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'ri-sun-line' ? 'add' : 'remove'](iconTheme);
}

const getCurrentTheme = () => body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

function toggleTheme() {
    body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    localStorage.setItem('admin-theme', getCurrentTheme());
    localStorage.setItem('admin-icon', getCurrentIcon());
}

themeButton.addEventListener('click', toggleTheme);