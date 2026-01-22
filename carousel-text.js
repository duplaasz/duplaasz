document.addEventListener('DOMContentLoaded',function(){
    const text = document.querySelectorAll('.carousel-text');
    let current = 0;
    text[current].classList.add('active');

    setInterval(() => {
        text[current].classList.remove('active');
        current = (current + 1) % text.length;
        text[current].classList.add('active');

    }, 7000);
});