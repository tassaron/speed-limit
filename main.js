"use strict";
const gamediv = document.getElementById("game");
const canvas = document.getElementById("game-layer");
const ctx = canvas.getContext("2d");
const fps_ratio = ms => { return Math.min(ms / (1000 / 60), 2) }

let player;
let timer = 0;
let mouseX = 0;
let mouseY = 0;
let gameOver = false;
let gamePaused = false;
let then = Date.now();

let keys_pressed = {
    "up": false,
    "down": false,
    "left": false,
    "right": false
};    

import { background } from './background.js';
import { Player } from './player.js';

/*
*  PRELOAD ASSETS
*/
let preloaded = 0;
let sprites = {
    cars: new Image(),
    walls: new Image(),
    grass: new Image()
}

function preload_success() {
    preloaded += 1;
    if (preloaded == Object.keys(sprites).length) {
        initGame();
    }
}

sprites.cars.addEventListener("load", preload_success)
sprites.cars.src = "assets/cars_2x.png";
sprites.walls.addEventListener("load", preload_success)
sprites.walls.src = "assets/walls.png";
sprites.grass.addEventListener("load", preload_success)
sprites.grass.src = "assets/grass.png";

/*
 * CONTROL HANDLERS
 */
function addUIEventListeners() {
    /* Connect onclick events to HTML "buttons" */
    let pause_button = document.getElementById("pause_button");
    pause_button.addEventListener('click', pauseGame, false);

    /* Connect keyboard/mouse/touch events to canvas */
    canvas.addEventListener("touchstart", touchStartHandler, false);
    canvas.addEventListener("touchend", touchEndHandler, false);
    canvas.addEventListener("touchmove", touchMoveHandler, false);
    canvas.addEventListener("mousedown", mouseDownHandler, false);
    canvas.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
}

function touchStartHandler(e) {
    touchMoveHandler(e);
    e.preventDefault();
}

function touchEndHandler(e) {
    if (gameOver == true && gamePaused == false) {
        startGame();
    }
    e.preventDefault();
}

function touchMoveHandler(e) {
    // get relative (to canvas and scroll position) coords of touch
    let touch = e.changedTouches[0];
    let scroll_position = document.getScroll();
    mouseX = touch.pageX - gamediv.offsetLeft + scroll_position[0];
    mouseY = touch.pageY - gamediv.offsetTop + scroll_position[1];
    e.preventDefault();
}

document.getScroll = function () {
    // https://stackoverflow.com/revisions/2481776/3
    if (window.pageYOffset != undefined) {
        return [pageXOffset, pageYOffset];
    } else {
        let sx, sy, d = document,
            r = d.documentElement,
            b = d.body;
        sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        return [sx, sy];
    }
}

function mouseMoveHandler(e) {
    // Get relative (to canvas and scroll position) coords of mouse
    let scroll_position = document.getScroll();
    mouseX = e.clientX - gamediv.offsetLeft + scroll_position[0];
    mouseY = e.clientY - gamediv.offsetTop + scroll_position[1];
}

function mouseDownHandler(e) {
    if (e.button == 0) {
        if (gameOver == true && gamePaused == false) {
            startGame();
        }
    } else if (e.button > 0) {
        pauseGame();
    }
}

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        keys_pressed.right = true;
    } else if (e.keyCode == 37) {
        keys_pressed.left = true;
    } else if (e.keyCode == 38) {
        keys_pressed.up = true;
    } else if (e.keyCode == 40) {
        keys_pressed.down = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        keys_pressed.right = false;
    } else if (e.keyCode == 37) {
        keys_pressed.left = false;
    } else if (e.keyCode == 38) {
        keys_pressed.up = false;
    } else if (e.keyCode == 40) {
        keys_pressed.down = false;
    } else if (e.keyCode == 32 && gameOver == true && gamePaused == false) {
        startGame();
    } else if (e.keyCode == 80) {
        pauseGame();
    }
    e.preventDefault()
}

/*
*  DRAWING FUNCTIONS
*/
function drawGameOver() {
    ctx.font = "36pt Sans";
    ctx.fillStyle = "#33aaff";
    ctx.fillText("Game Over", canvas.width / 2 - 132, canvas.height / 2 - 32);
    ctx.font = "16pt Sans";
    ctx.fillText("tap or click to restart", canvas.width / 2 - 92, canvas.height / 2 + 22);
}

function drawPauseScreen() {
    ctx.font = "36pt Sans";
    ctx.fillStyle = "#000";
    ctx.fillText("Paused", canvas.width / 2 - 90, canvas.height / 2);
}

const draw_sprite = {
    pink_up: function(x, y) {ctx.drawImage(sprites.cars, 106, 0, 32, 78, x, y, 32, 78)},
    blue_down: function(x, y) {ctx.drawImage(sprites.cars, 140, 79, 32, 78, x, y, 32, 78)},
    wall_left: function(x, y) {ctx.drawImage(sprites.walls, 40, 0, 39, 598, x, y, 39, 598)},
    wall_right: function(x, y) {ctx.drawImage(sprites.walls, 0, 0, 39, 598, x, y, 39, 598)},
    grass: function(i, x, y) {ctx.drawImage(sprites.grass, 32 * i - (i > 6 ? 6 : 0), i > 6 ? 32 : 0, 32, 32, x, y, 32, 32)}
};

function initGame() {
    addUIEventListeners();
    startGame();
}

function startGame() {
    /* Starts a new game */
    ctx.clearRect(0,0,canvas.width,canvas.height)
    gameOver = false;
    timer = 0;
    /* Start game loop by drawing the first frame */
    player = new Player();
    draw();
}

/*
*  MAIN GAME LOOP
*/

function draw() {
    let now = Date.now()
    let delta = now - then;

    if (gamePaused == true) {
        drawPauseScreen();
        requestAnimationFrame(draw);
        return;
    }
    ctx.fillStyle = "#0e6b00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let ratio = fps_ratio(delta);
    background.draw(ctx, draw_sprite, ratio);
    player.update(keys_pressed, ratio);

    /* If the player is dying, tick down the timer that will cause a gameOver soon */
    if (timer > 0) {
        timer -= 1 * ratio;
        if (timer < 1) {
            gameOver = true;
        }
    } else {
        if (player.crashed) {timer = 60}
    }
    draw_sprite.pink_up(player.x, player.y);
    
    if (gameOver) {
        drawGameOver();
    }
    requestAnimationFrame(draw);
    then = Date.now();
}

function pauseGame() {
    gamePaused = !gamePaused;
}
