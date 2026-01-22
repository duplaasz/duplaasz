let resizeTimer;
const nav = document.querySelector('nav')
window.addEventListener("resize", () => {
    // Csak akkor nyúlunk a DOM-hoz, ha még nincs rajta az osztály
    // Ez megspórol pár CPU ciklust, bár az eredeti sem volt lassú
    if (!nav.classList.contains("resize-animation-stopper")) {
        nav.classList.add("resize-animation-stopper");
    }

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        nav.classList.remove("resize-animation-stopper");
    }, 400);
});