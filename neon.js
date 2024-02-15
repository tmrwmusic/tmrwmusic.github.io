const logo = document.querySelector("header").querySelector("logo");

while (true) {
    logo.classList.toggle('neon');
    setTimeout({}, Math.random() * (500 - 100) + 100);
}