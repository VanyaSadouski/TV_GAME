(function () {
    document.getElementById('flappyStartBtn').addEventListener('click',function () {
        document.getElementById('flappyMenu').style.display = 'none';
        startGame();
    });
    document.getElementById('flappyScore').innerHTML = localStorage.getItem('flappyscore');
})();

function startGame() {
    let cvs = document.getElementById("canvas");
    let ctx = cvs.getContext("2d");

    let bird = new Image();
    let bg = new Image();
    let fg = new Image();
    let pipeNorth = new Image();
    let pipeSouth = new Image();

    bird.src = "images/Twitter.png";
    bg.src = "images/black.png";
    fg.src = "images/yellow.png";
    pipeNorth.src = "images/pipeNorth.png";
    pipeSouth.src = "images/pipeSouth.png";
    let gap = 85;
    let constant;
    let bX = 10;
    let bY = 150;
    let gravity = 1.5;
    let score = 0;

    document.addEventListener("keydown",moveUp);

    function moveUp(){
        bY -= 25;
    }

    let pipe = [];

    pipe[0] = {
        x : cvs.width,
        y : 0
    };


    (function () {
        draw();

    })();

    function draw(){
        ctx.drawImage(bg,0,0);
        for(let i = 0; i < pipe.length; i++){

            constant = pipeNorth.height+gap;
            ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
            ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);

            pipe[i].x--;

            if( pipe[i].x == 125 ){
                pipe.push({
                    x : cvs.width,
                    y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
                });
            }

            if( bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY+bird.height >= pipe[i].y+constant) || bY + bird.height >=  cvs.height - fg.height){
                document.getElementById('flappyMenu').style.display = 'block';
                return;
            }

            if(pipe[i].x == 20){
                score++;
            }
            if(!localStorage.getItem('flappyscore')){
                localStorage.setItem('flappyscore' , score);
            }else if (Number(localStorage.getItem('flappyscore')) < score){
                localStorage.setItem('flappyscore' , score);
            }

            document.getElementById('flappyScore').innerHTML = localStorage.getItem('flappyscore');

        }

        ctx.drawImage(fg,0,cvs.height - fg.height);

        ctx.drawImage(bird,bX,bY);

        bY += gravity;

        ctx.fillStyle = "#000";
        ctx.font = "20px Verdana";
        ctx.fillText("Score : "+score,10,cvs.height-20);

        requestAnimationFrame(draw);

    }
}































