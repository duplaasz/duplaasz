document.addEventListener("DOMContentLoaded", function() {
    let help_button = document.querySelectorAll('.imagebox h3 span img');
    let help = document.querySelectorAll('.imagebox .help');
    let isOpen = false;

    help_button.forEach(function(clicked){
        clicked.addEventListener('click', function() {
            let help_button_id = parseInt(clicked.id);
            console.log(help_button_id);
            if (!isOpen){
                help[help_button_id].classList.add('active');
                isOpen = true;
            }
            else{
                help[help_button_id].classList.remove('active');
                isOpen = false;
            } 
        });
    });
});