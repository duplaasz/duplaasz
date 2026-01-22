const button = document.getElementById("form_button");


button.addEventListener("mousedown", (e) => {
    if (e.button == 0) {
        button.classList.add("active");
    };
});

button.addEventListener("mouseup", (e) => {
    if (e.button == 0) {
        button.classList.remove("active");
    };
});
