"use strict";
const gamediv = document.getElementById("game");
const canvas = document.getElementById("game-layer");
const ctx = canvas.getContext("2d");
ctx.width = canvas.width; ctx.height = canvas.height;
const fps_ratio = ms => { return Math.min(ms / (1000 / 60), 2) }

let game;
let timer = 0;
let mouseX = 0;
let mouseY = 0;
let then = Date.now();

let keys_pressed = {
    "up": false,
    "down": false,
    "left": false,
    "right": false,
    "number": -1,
};    

import { Game } from './game.js';

/*
*  PRELOAD ASSETS
*/
let preloaded = 0;
let sprites = {
    cars: new Image(),
    walls: new Image(),
    grass: new Image(),
    skid: new Image(),
    fuel: new Image(),
    cone: new Image(),
    explosion: new Image(),
    coin: new Image()
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
sprites.skid.addEventListener("load", preload_success)
sprites.skid.src = "assets/skid.png";
sprites.fuel.addEventListener("load", preload_success)
sprites.fuel.src = "assets/fuel.png";
sprites.cone.addEventListener("load", preload_success)
sprites.cone.src = "assets/cone.png";
sprites.explosion.addEventListener("load", preload_success)
sprites.explosion.src = "assets/explosion.png";
sprites.coin.addEventListener("load", preload_success)
sprites.coin.src = "assets/coin.png";

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
    if (game.game_over == true && game.paused == false) {
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
        if (game.game_over == true && game.paused == false) {
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
        e.preventDefault();
    } else if (e.keyCode == 40) {
        keys_pressed.down = true;
        e.preventDefault();
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
    } else if (e.keyCode == 32 && game.game_over == true && game.paused == false) {
        startGame();
    } else if (e.keyCode == 80) {
        pauseGame();
    } else if (e.keyCode > 47 && e.keyCode < 58) {
        keys_pressed.number = e.keyCode - 48;
    }
    console.log(e.keyCode);
    e.preventDefault()
}

/*
*  DRAWING FUNCTIONS
*/
function darkenCanvas() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGameOver() {
    darkenCanvas();
    ctx.fillStyle = "#000";
    ctx.fillRect(canvas.width / 4, (canvas.height / 2) - canvas.height / 6, canvas.width / 2, canvas.height / 4);
    ctx.fillStyle = "#800000";
    ctx.fillRect((canvas.width / 4) + 2, ((canvas.height / 2) - canvas.height / 6) + 2, (canvas.width / 2) - 4, (canvas.height / 4) - 4);
    ctx.font = "36pt Sans";
    ctx.fillStyle = "#fff";
    ctx.fillText("Game Over", canvas.width / 2 - 132, canvas.height / 2 - 32);
    ctx.font = "16pt Sans";
    ctx.fillText("tap or click to restart", canvas.width / 2 - 92, canvas.height / 2 + 22);
}

function drawPauseScreen() {
    ctx.fillStyle = "#000";
    ctx.fillRect(canvas.width / 4, (canvas.height / 2) - canvas.height / 6, canvas.width / 2, canvas.height / 4);
    ctx.fillStyle = "#fff";
    ctx.fillRect((canvas.width / 4) + 2, ((canvas.height / 2) - canvas.height / 6) + 2, (canvas.width / 2) - 4, (canvas.height / 4) - 4);
    ctx.font = "36pt Sans";
    ctx.fillStyle = "#000";
    ctx.fillText("Paused", canvas.width / 2 - 86, canvas.height / 2 - 6);
}

const draw_sprite = {
    pink_up: function(x, y) {ctx.drawImage(sprites.cars, 106, 0, 32, 79, Math.floor(x), Math.floor(y), 32, 79)},
    pink_down: function(x, y) {ctx.drawImage(sprites.cars, 140, 0, 32, 79, Math.floor(x), Math.floor(y), 32, 79)},
    blue_up: function(x, y) {ctx.drawImage(sprites.cars, 106, 79, 32, 79, Math.floor(x), Math.floor(y), 32, 79)},
    blue_down: function(x, y) {ctx.drawImage(sprites.cars, 140, 79, 32, 79, Math.floor(x), Math.floor(y), 32, 79)},
    blue2_up: function(x, y) {ctx.drawImage(sprites.cars, 138, 79*2, 34, 79, Math.floor(x), Math.floor(y), 34, 79)},
    blue2_down: function(x, y) {ctx.drawImage(sprites.cars, 102, 79*2, 34, 79, Math.floor(x), Math.floor(y), 34, 79)},
    green_up: function(x, y) {ctx.drawImage(sprites.cars, 106, 79*3+1, 32, 79, Math.floor(x), Math.floor(y), 32, 79)},
    green_down: function(x, y) {ctx.drawImage(sprites.cars, 140, 79*3+1, 32, 79, Math.floor(x), Math.floor(y), 32, 79)},
    wall_left: function(x, y) {ctx.drawImage(sprites.walls, 40, 0, 39, 598, Math.floor(x), Math.floor(y), 39, 598)},
    wall_right: function(x, y) {ctx.drawImage(sprites.walls, 0, 0, 39, 598, Math.floor(x), Math.floor(y), 39, 598)},
    grass: function(i, x, y) {ctx.drawImage(sprites.grass, 32 * i - (i > 6 ? 6 : 0), i > 6 ? 32 : 0, 32, 32, Math.floor(x), Math.floor(y), 32, 32)},
    skid: function(x, y) {ctx.drawImage(sprites.skid, x, y)},
    fuel: function(x, y) {ctx.drawImage(sprites.fuel, Math.floor(x), Math.floor(y))},
    cone: function(x, y) {ctx.drawImage(sprites.cone, Math.floor(x), Math.floor(y))},
    explosion: function(i, x, y) {ctx.drawImage(sprites.explosion, 32 * i, 0, 32, 32, Math.floor(x), Math.floor(y), 32, 32)},
    coin: function(i, v, x, y) {ctx.drawImage(sprites.coin, 32 * i, 32 * v, 32, 32, Math.floor(x), Math.floor(y), 32, 32)}
};

function initGame() {
    addUIEventListeners();
    startGame();
}

function startGame() {
    /* Starts a new game */
    game = new Game()
    timer = 0;
    ctx.clearRect(0,0,canvas.width,canvas.height)
    then = Date.now();
    /* Start game loop by drawing the first frame */
    draw();
}

/*
*  MAIN GAME LOOP
*/

function draw() {
    if (game.paused == true) {
        drawPauseScreen();
        requestAnimationFrame(draw);
        return;
    }
    let now = Date.now();
    let delta = now - then;
    let ratio = fps_ratio(delta);

    game.update(keys_pressed, ratio);

    /* If the player is dying, tick down the timer that will cause a game_over soon */
    if (timer > 0) {
        timer -= 1 * ratio;
        if (timer < 1) {
            game.game_over = true;
        }
    } else {
        if (game.player.crashed) {timer = 60}
    }

    game.draw(ctx, draw_sprite);
    
    if (game.game_over) {
        drawGameOver();
    }
    requestAnimationFrame(draw);
    then = Date.now();
}

function pauseGame() {
    game.paused = !game.paused;
    if (game.paused) {
        darkenCanvas();
    }
}
