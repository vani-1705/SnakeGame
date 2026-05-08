const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

const box = 20;

let snake;

let direction;

let apple;

let milk = null;

let score;

let lives;

let game = null;

let speed = 170;

let paused = false;

/* SOUNDS */

let eatSound = new Audio("/home/rgukt/Downloads/PRO/projects/snake-game/eat.mp3");

let hitSound = new Audio("/home/rgukt/Downloads/PRO/projects/snake-game/hit.mp3");

let bgMusic = new Audio("/home/rgukt/Downloads/PRO/projects/snake-game/bg.mp3");

bgMusic.loop = true;

bgMusic.volume = 0.5;

/* START GAME */

function startGame(){

    document
    .getElementById("startScreen")
    .classList.add("hidden");

    bgMusic.play();

    initGame();

    game = setInterval(drawGame, speed);
}

/* INIT */

function initGame(){

    snake = [

        {x:300, y:300},

        {x:280, y:300}
    ];

    direction = "RIGHT";

    apple = randomFood("apple");

    score = 0;

    lives = 3;

    updateScore();

    updateLives();
}

/* RANDOM FOOD */

function randomFood(type){

    return{

        x: Math.floor(Math.random()*30)*20,

        y: Math.floor(Math.random()*30)*20,

        type:type
    };
}

/* KEYBOARD */

document.addEventListener("keydown", (e)=>{

    if(e.key==="ArrowUp" &&
       direction!=="DOWN"){

        direction="UP";
    }

    if(e.key==="ArrowDown" &&
       direction!=="UP"){

        direction="DOWN";
    }

    if(e.key==="ArrowLeft" &&
       direction!=="RIGHT"){

        direction="LEFT";
    }

    if(e.key==="ArrowRight" &&
       direction!=="LEFT"){

        direction="RIGHT";
    }
});

/* MOBILE */

function setDirection(dir){

    if(dir==="UP" &&
       direction!=="DOWN"){

        direction="UP";
    }

    if(dir==="DOWN" &&
       direction!=="UP"){

        direction="DOWN";
    }

    if(dir==="LEFT" &&
       direction!=="RIGHT"){

        direction="LEFT";
    }

    if(dir==="RIGHT" &&
       direction!=="LEFT"){

        direction="RIGHT";
    }
}

/* MAIN GAME */

function drawGame(){

    moveSnake();

    drawBackground();

    drawSnake();

    drawFoods();
}

/* MOVE SNAKE */

function moveSnake(){

    let head = {...snake[0]};

    if(direction==="UP"){

        head.y -= box;
    }

    if(direction==="DOWN"){

        head.y += box;
    }

    if(direction==="LEFT"){

        head.x -= box;
    }

    if(direction==="RIGHT"){

        head.x += box;
    }

    /* WALL PASS */

    if(head.x < 0){

        head.x = 580;
    }

    if(head.x > 580){

        head.x = 0;
    }

    if(head.y < 0){

        head.y = 580;
    }

    if(head.y > 580){

        head.y = 0;
    }

    snake.unshift(head);

    /* APPLE */

    if(head.x===apple.x &&
       head.y===apple.y){

        score += 1;

        updateScore();

        eatSound.play();

        apple = randomFood("apple");
    }

    /* MILK */

    else if(milk &&
            head.x===milk.x &&
            head.y===milk.y){

        score += 5;

        updateScore();

        eatSound.play();

        milk = null;
    }

    else{

        snake.pop();
    }

    /* RANDOM MILK */

    if(Math.random()<0.003 &&
       milk===null){

        milk = randomFood("milk");

        setTimeout(()=>{

            milk = null;

        },30000);
    }

    /* SELF COLLISION */

    for(let i=1;i<snake.length;i++){

        if(head.x===snake[i].x &&
           head.y===snake[i].y){

            hitSound.play();

            loseLife();

            return;
        }
    }
}

/* BACKGROUND */

function drawBackground(){

    ctx.fillStyle = "black";

    ctx.fillRect(0,0,600,600);

    ctx.strokeStyle = "white";

    ctx.lineWidth = 8;

    ctx.strokeRect(0,0,600,600);
}

/* DRAW SNAKE */

function drawSnake(){

    snake.forEach((part,index)=>{

        if(index===0){

            ctx.fillStyle = "yellow";
        }

        else{

            ctx.fillStyle = "green";
        }

        ctx.fillRect(
            part.x,
            part.y,
            box,
            box
        );
    });
}

/* DRAW FOOD */

function drawFoods(){

    /* APPLE */

    ctx.fillStyle = "red";

    ctx.beginPath();

    ctx.arc(
        apple.x+10,
        apple.y+10,
        10,
        0,
        Math.PI*2
    );

    ctx.fill();

    /* MILK */

    if(milk){

        ctx.shadowColor = "cyan";

        ctx.shadowBlur = 20;

        ctx.fillStyle = "white";

        ctx.fillRect(
            milk.x,
            milk.y,
            box,
            box
        );

        ctx.shadowBlur = 0;
    }
}

/* SCORE */

function updateScore(){

    document
    .getElementById("score")
    .innerText =
    "Score: " + score;
}

/* LIVES */

function updateLives(){

    let text = "";

    for(let i=0;i<3;i++){

        if(i<lives){

            text += "❤️ ";
        }

        else{

            text += "💔 ";
        }
    }

    document
    .getElementById("lives")
    .innerText =
    "Lives: " + text;
}

/* LIFE LOST */

function loseLife(){

    clearInterval(game);

    lives--;

    updateLives();

    if(lives<=0){

        document
        .getElementById("menuScreen")
        .classList.remove("hidden");

        document
        .getElementById("menuTitle")
        .innerText =
        "💀 GAME OVER 💀";

        document
        .getElementById("continueBtn")
        .style.display =
        "none";
    }

    else{

        document
        .getElementById("menuScreen")
        .classList.remove("hidden");

        document
        .getElementById("menuTitle")
        .innerText =
        "Continue?";

        document
        .getElementById("continueBtn")
        .style.display =
        "inline-block";
    }
}

/* CONTINUE */

function continueGame(){

    document
    .getElementById("menuScreen")
    .classList.add("hidden");

    let length = snake.length;

    snake = [

        {x:300,y:300},

        {x:280,y:300}
    ];

    while(snake.length < length){

        snake.push({

            x: snake[snake.length-1].x - 20,

            y:300
        });
    }

    game = setInterval(drawGame, speed);
}

/* STATUS MESSAGE */

function showStatus(text){

    let status =
    document.getElementById("statusText");

    status.innerText = text;

    status.classList.remove("hidden-status");

    setTimeout(()=>{

        status.classList.add("hidden-status");

    },1500);
}

/* PAUSE */

function pauseGame(){

    if(!paused){

        clearInterval(game);

        paused = true;

        showStatus("⏸️ GAME PAUSED");
    }
}

/* RESUME */

function resumeGame(){

    if(paused){

        game = setInterval(drawGame, speed);

        paused = false;

        showStatus("▶️ GAME RESUMED");
    }
}

/* RESTART */

function restartGame(){

    location.reload();
}

/* SETTINGS */

function toggleSettings(){

    document
    .getElementById("settings")
    .classList.toggle("hidden");
}

/* SPEED */

function changeSpeed(newSpeed){

    speed = newSpeed;

    clearInterval(game);

    game = setInterval(drawGame, speed);
}

/* SOUND */

function changeVolume(v){

    bgMusic.volume = v;

    eatSound.volume = v;

    hitSound.volume = v;
}
