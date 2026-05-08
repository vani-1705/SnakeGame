const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");

const box = 20;

let snake = [];

let direction = "RIGHT";

let apple = {};

let milk = null;

let score = 0;

let lives = 3;

let game;

let speed = 140;

let paused = false;

/* SOUNDS */

let eatSound =
new Audio("/home/rgukt/Downloads/PRO/projects/snake-game/eat.mp3");

let hitSound =
new Audio("/home/rgukt/Downloads/PRO/projects/snake-game/hit.mp3");

let bgMusic =
new Audio("/home/rgukt/Downloads/PRO/projects/snake-game/bg.mp3");

bgMusic.loop = true;

bgMusic.volume = 0.5;

/* START */

function startGame(){

document
.getElementById("startScreen")
.classList.add("hidden");

bgMusic.play();

initGame();

clearInterval(game);

game =
setInterval(drawGame,speed);
}

/* INIT */

function initGame(){

snake = [

{x:300,y:300},

{x:280,y:300}
];

direction = "RIGHT";

apple = randomFood();

milk = null;

score = 0;

lives = 3;

updateScore();

updateLives();
}

/* RANDOM FOOD */

function randomFood(){

return{

x:Math.floor(Math.random()*30)*20,

y:Math.floor(Math.random()*30)*20
};
}

/* KEYBOARD */

document.addEventListener(
"keydown",

function(e){

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
}
);

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

/* DRAW GAME */

function drawGame(){

moveSnake();

drawBackground();

drawSnake();

drawFoods();
}

/* MOVE */

function moveSnake(){

let head = {

x:snake[0].x,

y:snake[0].y
};

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

apple = randomFood();
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

milk = randomFood();

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

ctx.fillStyle="black";

ctx.fillRect(0,0,600,600);

ctx.strokeStyle="white";

ctx.lineWidth=8;

ctx.strokeRect(0,0,600,600);
}

/* DRAW SNAKE */

function drawSnake(){

for(let i=0;i<snake.length;i++){

if(i===0){

ctx.fillStyle="yellow";
}

else{

ctx.fillStyle="green";
}

ctx.fillRect(

snake[i].x,

snake[i].y,

box,

box
);
}
}

/* DRAW FOODS */

function drawFoods(){

/* APPLE */

ctx.fillStyle="red";

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

ctx.shadowColor="cyan";

ctx.shadowBlur=20;

ctx.fillStyle="white";

ctx.fillRect(

milk.x,

milk.y,

box,

box
);

ctx.shadowBlur=0;
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

/* LOSE LIFE */

function loseLife(){

clearInterval(game);

lives--;

updateLives();

document
.getElementById("menuScreen")
.classList.remove("hidden");

if(lives<=0){

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

game =
setInterval(drawGame,speed);
}

/* PAUSE */

function pauseGame(){

if(!paused){

clearInterval(game);

paused = true;

showStatus(
"⏸️ GAME PAUSED"
);
}
}

/* RESUME */

function resumeGame(){

if(paused){

clearInterval(game);

game =
setInterval(drawGame,speed);

paused = false;

showStatus(
"▶️ GAME RESUMED"
);
}
}

/* STATUS */

function showStatus(text){

let status =
document.getElementById(
"statusText"
);

status.innerText = text;

status.classList.remove(
"hidden-status"
);

setTimeout(()=>{

status.classList.add(
"hidden-status"
);

},1500);
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

game =
setInterval(drawGame,speed);
}

/* SOUND */

function changeVolume(v){

bgMusic.volume = v;

eatSound.volume = v;

hitSound.volume = v;
}
