document.addEventListener("DOMContentLoaded", function() {
    let bars = document.querySelector('.bars');
    let close = document.querySelector('.close');
    let nav = document.querySelector('nav');

    bars.addEventListener('click', function () {
        bars.style.display = 'none';
        close.style.display = 'block';
        nav.classList.add('active');
        setTimeout(() => {
            nav.classList.add('active');
        }, 10); // Kis késleltetés az animáció elindításához
    });

    close.addEventListener('click', function () {
        bars.style.display = 'block';
        close.style.display = 'none';
        nav.classList.remove('active');
    });

    
});