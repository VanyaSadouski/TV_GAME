const app = require('electron').remote.app;

let au = document.getElementById('audio');


document.getElementById('offBtn').addEventListener('click', function () {
   app.quit();
});

document.getElementById('toMenu').addEventListener('click',function () {
    if (window.location === "index.html") return;
   location.href = "../index.html";
});


document.getElementById('play').addEventListener('click',function () {
    au.play();
});

document.getElementById('mute').addEventListener('click',function () {
    au.pause();
});

function resetSnake () {
    localStorage.setItem('score', 0);
    document.getElementById('snakeScore').innerHTML = '0';
}

function resetFlappy() {
    localStorage.setItem('flappyscore', 0);
    document.getElementById('flappyScore').innerHTML = '0';
}

function resetPong() {
    localStorage.setItem('scorepong', 0);
    document.getElementById('pongScore').innerHTML = '0';
}