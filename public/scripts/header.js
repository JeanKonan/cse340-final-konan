const header = document.querySelector('header');
const nav = document.getElementById('site-navigation');
const toggle = document.querySelector('.nav-toggle');

if (header && nav && toggle) {
    const setOpen = (isOpen) => {
        header.classList.toggle('nav-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
    };

    toggle.addEventListener('click', () => {
        setOpen(!header.classList.contains('nav-open'));
    });

    nav.addEventListener('click', (event) => {
        if (event.target.closest('a, button')) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setOpen(false);
        }
    });
}
