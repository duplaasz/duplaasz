const lastname = document.getElementById('lastname');
const lastname_error = document.getElementById('lastname_error');
const firstname = document.getElementById('firstname');
const firstname_error = document.getElementById('firstname_error');
const phone = document.getElementById('phone');
const phone_error = document.getElementById('phone_error');
const email = document.getElementById('email');
const email_error = document.getElementById('email_error');
const desc = document.getElementById('desc');
const desc_error = document.getElementById('desc_error');
const images = document.getElementById('images');
const images_error = document.getElementById('images_error');
const form = document.getElementById('form');
const email_regex = /^(?=.*@)(?=.*\.).+$/;
const phone_regex = /^\+?\d+$/;
const form_success = document.getElementById('form_success');
const form_button = document.getElementById('form_button');
const loader = document.getElementById('loader');
const success_text = document.getElementById('success_text');
const close_success = document.getElementById('close_success');

function showPreviews(files) {
    let fileError = false;
    const output = document.querySelector("#file_list");
    output.innerHTML = "";

    [...files].forEach(file => {
        if (!file.type.startsWith("image/")){
            fileError = true;
            images_error.innerHTML = 'Csak képfájlok tölthetők fel.';
            images.value = "";
            output.innerHTML = "";
            return;
        };
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            const div = document.createElement("div");
            div.innerHTML = `<img class="thumbnail" src="${img.src}" title="${file.name}"/> <p>${file.name}</p>`;
            output.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}


function formSuccess(success) {
    loader.style.display = 'none';
    form_button.style.display = 'block';
    form_success.classList.add('active');
    close_success.addEventListener('click', () => {
        form_success.classList.remove('active');
    });
    setTimeout(function () {
        form_success.classList.remove("active");
    }, 5000);
    if (success == true) {
        success_text.innerHTML = 'Árajánlat beküldése sikeres!';
        form_success.classList.add('true');
    }
    else if (success == false) {
        success_text.innerHTML = 'Árajánlat beküldése sikertelen!';
        form_success.classList.add('false');
    }
    else if (success == 'server_error') {
        success_text.innerHTML = 'Szerver hiba, próbálja újra később!';
        form_success.classList.add('false');
    }

}

form.addEventListener('submit', async (e) => {
    /*VALIDATION*/
    form_error = false;
    e.preventDefault();
    /*név*/
    if (lastname.value == '' || lastname.value == null) {
        lastname_error.innerHTML = 'Nem lehet üres.';
        form_error = true;
    }
    else {
        lastname_error.innerHTML = '';
    }

    if (firstname.value == '' || firstname.value == null) {
        firstname_error.innerHTML = 'Nem lehet üres.';
        form_error = true;
    }
    else {
        firstname_error.innerHTML = '';
    }
    /*telefonszám*/
    if (phone.value == '' || phone.value == null) {
        phone_error.innerHTML = 'Nem lehet üres.';
        form_error = true;
    }
    else if (!phone_regex.test(phone.value)) {
        phone_error.innerHTML = 'Nem lehet benne betű.';
        form_error = true;
    }
    else if (phone.value.length < 7) {
        phone_error.innerHTML = 'Minimum 7 karakter.';
        form_error = true;
    }
    else {
        phone_error.innerHTML = '';
    }

    /*email*/
    if (email.value == '' || email.value == null) {
        email_error.innerHTML = 'Nem lehet üres.';
        form_error = true;
    }
    else if (!email_regex.test(email.value)) {
        email_error.innerHTML = 'Érvénytelen formátum.';
        form_error = true;
    }
    else {
        email_error.innerHTML = '';
    }

    /*leírás*/
    if (desc.value == '' || desc.value == null) {
        desc_error.innerHTML = 'Nem lehet üres.';
        form_error = true;
    }
    else {
        desc_error.innerHTML = '';
    }
    /*képek*/
    if (images.files.length === 0) {
        images_error.innerHTML = 'Minimum 1 kép feltöltése kötelező.'
        form_error = true;
    }
    else {
        images_error.innerHTML = '';
    }
    /* beküldés, visszajelző üzenet */
    form_success.className = '';

    if (!form_error) {
        loader.style.display = 'block';
        form_button.style.display = 'none';
        const formData = new FormData(form);
        try {
            const response = await fetch("https://httpbin.org/post", { /* teszt link */
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            console.log(JSON.stringify(data, null, 2));
            formSuccess(true);
        } catch (error) {
            formSuccess("server_error");
        }
    }
    else {
        formSuccess(false);
    }

});
/*írásnál validation reset*/

firstname.addEventListener('input', () => {
    firstname_error.innerHTML = '';
});

lastname.addEventListener('input', () => {
    lastname_error.innerHTML = '';
});

phone.addEventListener('input', () => {
    phone_error.innerHTML = '';
});

email.addEventListener('input', () => {
    email_error.innerHTML = '';
});

desc.addEventListener('input', () => {
    desc_error.innerHTML = '';
});

images.addEventListener('focus', () => {
    images_error.innerHTML = '';
});

/*drag-and-drop*/
const dropzone = document.getElementById('dropzone');


dropzone.addEventListener("click", (e) => {
    images.click();

});

dropzone.addEventListener("dragover", (e) => {

    dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
    dropzone.classList.remove("dragover");
    images.files = e.dataTransfer.files;  // hozzárendeljük az inputhoz
    showPreviews(images.files);
});



const clear_images = document.getElementById("clear_images");
clear_images.addEventListener("click", (e) => {
    images.value = "";
    e.stopPropagation();
    document.querySelector("#file_list").innerHTML = "";
})

images.addEventListener("change", (e) => {
    showPreviews(e.target.files);
});
