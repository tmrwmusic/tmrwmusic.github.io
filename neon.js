const logo = document.querySelector("header").querySelector("logo");
function blinkRandomly() {
    randomInterval = Math.floor(Math.random() * 200 + 50);
    checkNumber = Math.floor(Math.random() * 2 + 2);
    function execute(iterations) {
        if (iterations > 0) {
            if (new Date() % checkNumber === 0) {
                logo.classList.toggle("neon");
            }
            setTimeout(() => execute(iterations - 1), Math.floor(Math.random() * 200 + 50));
        } else {
            setTimeout(blinkRandomly, Math.floor(Math.random() * 200 + 50));
        }
    }

    execute(Math.floor(Math.random() * 16 + 5));
}

var randomInterval;
var checkNumber;
blinkRandomly();