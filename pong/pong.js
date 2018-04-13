(function () {
    document.getElementById('pongStartBtn').addEventListener('click',function () {
        document.getElementById('pongMenu').style.display = 'none';
        startGame();

    });
    document.getElementById('pongScore').innerHTML = localStorage.getItem('scorepong');
})();


function startGame(){
let lifeCount = document.getElementById('lifeLeft');
let time = document.getElementById('time');
let finalTime;
let animate = window.requestAnimationFrame ;
let canvas = document.getElementById("canvas");
let width = 400;
let height = 600;
canvas.width = width;
canvas.height = height;
let context = canvas.getContext('2d');
let player = new Player();
let computer = new Computer();
let ball = new Ball(200, 300);
let keysDown = {};
let life = 5;
let clocktimer;
let startDate = new Date();

   let startTIME = function () {
        let thisDate = new Date();
        let t = thisDate.getTime() - startDate.getTime();
        let ms = t % 1000;
        t -= ms;
        ms = Math.floor(ms / 10);
        t = Math.floor(t / 1000);
        let s = t % 60;
        t -= s;
        t = Math.floor(t / 60);
        let m = t % 60;
        t -= m;
        t = Math.floor(t / 60);
        let h = t % 60;
        if (h < 10) h = '0' + h;
        if (m < 10) m = '0' + m;
        if (s < 10) s = '0' + s;
        if (ms < 10) ms = '0' + ms;
        finalTime = h + ':' + m + ':' + s;
        time.innerHTML = h + ':' + m + ':' + s + '.' + ms;
        clocktimer = setTimeout(startTIME, 10);
    };


let render = function () {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
};

let update = function () {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);

};

let step = function () {
    let i = 0;
    while (i<1){
        startTIME();
        i++
    }
    update();
    render();

    if (life<1){
        document.getElementById('pongMenu').style.display = 'block';
        if (!localStorage.getItem('scorepong')){
            localStorage.setItem('scorepong',finalTime);
        }else if (localStorage.getItem('scorepong')< finalTime){
            localStorage.setItem('scorepong',finalTime);
            document.getElementById('pongScore').innerHTML = localStorage.getItem('scorepong');
        }

        clearTimeout(clocktimer);
        return;
    }
    animate(step);
};

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function () {
    context.fillStyle = "#ff4d84";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > 400) {
        this.x = 400 - this.width;
        this.x_speed = 0;
    }
};

function Computer() {
    this.paddle = new Paddle(175, 10, 50, 10);
}

Computer.prototype.render = function () {
    this.paddle.render();
};

Computer.prototype.update = function (ball) {
    let x_pos = ball.x;
    let diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    if (diff < 0 && diff < -4) {
        diff = -17;
    } else if (diff > 0 && diff > 4) {
        diff = 17;
    }
    this.paddle.move(diff, 0);
    if (this.paddle.x < 0) {
        this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > 400) {
        this.paddle.x = 400 - this.paddle.width;
    }
};

function Player() {
    this.paddle = new Paddle(175, 580, 50, 10);
}

Player.prototype.render = function () {
    this.paddle.render();
};

Player.prototype.update = function () {
    for (let key in keysDown) {
        let value = Number(key);
        if (value == 37) {
            this.paddle.move(-4, 0);
        } else if (value == 39) {
            this.paddle.move(4, 0);
        } else {
            this.paddle.move(0, 0);
        }
    }
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 4;
    this.y_speed = 3;
}

Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, 10, 2 * Math.PI, false);
    context.fillStyle = "#ffffff";
    context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    let top_x = this.x - 5;
    let top_y = this.y - 5;
    let bottom_x = this.x + 5;
    let bottom_y = this.y + 5;

    if (this.x - 5 < 0) {
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if (this.x + 5 > 400) {
        this.x = 395;
        this.x_speed = -this.x_speed;
    }

    if (this.y < 0) {
        this.x_speed = 1;
        this.y_speed = 3;
        this.x = 200;
        this.y = 300;
        ++life;
    }

    if ( this.y > 600){
        this.x_speed = 1;
        this.y_speed = 3;
        this.x = 200;
        this.y = 300;
        --life;
    }

    lifeCount.innerHTML = life;



    if (top_y > 300) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -3;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    } else {
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = 3;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};


if (life>0) {
    animate(step);
}

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});
}