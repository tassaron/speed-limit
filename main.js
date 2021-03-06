"use strict";

// from the Rainey Arcade parent repo
import { send_score, hide_send_score_button } from "../send_score.js";

const gamediv = document.getElementById("game");
const canvas = document.createElement("canvas");
gamediv.appendChild(canvas);
canvas.width = gamediv.offsetWidth; canvas.height = gamediv.offsetHeight;
const ctx = canvas.getContext("2d");
ctx.width = canvas.width; ctx.height = canvas.height;
const fps_ratio = ms => { return Math.min(ms / (1000 / 60), 2) }
ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = "36pt Sans";
ctx.fillStyle = "#fff";
ctx.fillText("Loading...", canvas.width / 2 - 132, canvas.height / 2 - 32);

let game;
let timer = 0;
let then = Date.now();

let keys_pressed = {
    "up": false,
    "down": false,
    "left": false,
    "right": false,
    "number": -1,
    "mouse": false,
    "mouse_pos": [0, 0]
};

import { Game } from './game.js';

/*
*  PRELOAD ASSETS
*/
let preloaded = 0;
let sprites = {
    cars: new Image(),
    cars2: new Image(),
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

const prefix = "/static/client/rainey_arcade/js/speed-limit/assets/";
sprites.cars.addEventListener("load", preload_success)
sprites.cars.src = prefix + "cars_2x.png";
sprites.cars2.addEventListener("load", preload_success)
sprites.cars2.src = prefix + "mycars.png";
sprites.walls.addEventListener("load", preload_success)
sprites.walls.src = prefix + "walls.png";
sprites.grass.addEventListener("load", preload_success)
sprites.grass.src = prefix + "grass.png";
sprites.skid.addEventListener("load", preload_success)
sprites.skid.src = prefix + "skid.png";
sprites.fuel.addEventListener("load", preload_success)
sprites.fuel.src = prefix + "fuel.png";
sprites.cone.addEventListener("load", preload_success)
sprites.cone.src = prefix + "cone.png";
sprites.explosion.addEventListener("load", preload_success)
sprites.explosion.src = prefix + "explosion.png";
sprites.coin.addEventListener("load", preload_success)
sprites.coin.src = prefix + "coin.png";

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
    canvas.addEventListener("mouseup", mouseUpHandler, false);
    canvas.addEventListener("mousedown", mouseDownHandler, false);
    canvas.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener('contextmenu', function (e) {
        if (gamediv.contains(e.target)) {
            e.preventDefault();
        }
    }, false);
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
}

function touchStartHandler(e) {
    touchMoveHandler(e);
    keys_pressed.mouse = true;
    e.preventDefault();
}

function touchEndHandler(e) {
    if (game.game_over == true && game.paused == false) {
        startGame();
    }
    keys_pressed.mouse = false;
    e.preventDefault();
}

function touchMoveHandler(e) {
    // get relative (to canvas) coords of touch
    let touch = e.changedTouches[0];
    keys_pressed.mouse_pos = [touch.pageX - gamediv.offsetLeft, touch.pageY - gamediv.offsetTop];
    e.preventDefault();
}

document.getScroll = function () {
    // https://stackoverflow.com/revisions/2481776/3
    if (window.scrollY != undefined) {
        return [scrollX, scrollY];
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
    keys_pressed.mouse_pos = [e.clientX - gamediv.offsetLeft + scroll_position[0], e.clientY - gamediv.offsetTop + scroll_position[1]];
}

function mouseUpHandler(e) {
    keys_pressed.mouse = false;
}

function mouseDownHandler(e) {
    if (e.button == 0) {
        if (game.game_over == true && game.paused == false) {
            startGame();
        } else {
            keys_pressed.mouse = true;
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
    } else if (e.keyCode > 47 && e.keyCode < 58) {
        keys_pressed.number = e.keyCode - 48;
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
        keys_pressed.number = -1;
    }
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
    ctx.fillRect(canvas.width / 4, (canvas.height / 3) - canvas.height / 6, canvas.width / 2, canvas.height / 4);
    ctx.fillRect(canvas.width / 4 + 16, (canvas.height / 3) + 50, canvas.width / 2 - 32, canvas.height / 3 + 44);
    ctx.fillStyle = "#fff";
    ctx.fillRect(canvas.width / 4 + 18, (canvas.height / 3) + 52, canvas.width / 2 - 36, (canvas.height / 3) + 40);
    ctx.fillStyle = "#800000";
    ctx.fillRect((canvas.width / 4) + 2, ((canvas.height / 3) - canvas.height / 6) + 2, (canvas.width / 2) - 4, (canvas.height / 4) - 4);
    ctx.font = "36pt Sans";
    ctx.fillStyle = "#fff";
    ctx.fillText("Game Over", canvas.width / 2 - 132, canvas.height / 3 - 32);
    ctx.font = "16pt Sans";
    ctx.fillText("tap or click to restart", canvas.width / 2 - 92, canvas.height / 3 + 22);
    ctx.fillStyle = "#000";
    ctx.font = "18pt Serif";
    ctx.fillText("Cars Passed", canvas.width / 4 + 90, canvas.height / 3 + 90);
    ctx.fillRect(canvas.width / 4 + 90, canvas.height / 3 + 92, ctx.measureText("Cars Passed").width, 2);
    ctx.fillText(game.player.score, canvas.width / 4 + 160 - ctx.measureText(game.player.score).width / 2, canvas.height / 3 + 120);
    ctx.fillText("Money Earned", canvas.width / 4 + 80, canvas.height / 3 + 160);
    ctx.fillRect(canvas.width / 4 + 80, canvas.height / 3 + 162, ctx.measureText("Money Earned").width, 2);
    let text = "";
    text = `\$${Intl.NumberFormat('en-US').format(game.player.total_money)}`;
    ctx.fillText(text, canvas.width / 4 + 160 - ctx.measureText(text).width / 2, canvas.height / 3 + 190);
    ctx.fillText("Total Explosions", canvas.width / 4 + 70, canvas.height / 3 + 230);
    ctx.fillRect(canvas.width / 4 + 70, canvas.height / 3 + 232, ctx.measureText("Total Explosions").width, 2);
    if (game.player.explosions == 1) {
        text = "(yours)";
    } else if (game.player.explosions > 99) {
        text = "(wow!)"
    } else {
        text = "";
    }
    text = `${game.player.explosions}${text}`;
    ctx.fillText(text, canvas.width / 4 + 160 - ctx.measureText(text).width / 2, canvas.height / 3 + 260);
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
    pink_right: function(x, y) {ctx.drawImage(sprites.cars, 4, 48, 98, 40, x, y, 98, 40)},
    blue_up: function(x, y) {ctx.drawImage(sprites.cars, 106, 79, 32, 79, Math.floor(x), Math.floor(y), 32, 79)},
    blue_down: function(x, y) {ctx.drawImage(sprites.cars, 140, 79, 32, 79, Math.floor(x), Math.floor(y), 32, 79)},
    blue2_up: function(x, y) {ctx.drawImage(sprites.cars, 138, 79*2, 34, 79, Math.floor(x), Math.floor(y), 34, 79)},
    blue2_down: function(x, y) {ctx.drawImage(sprites.cars, 102, 79*2, 34, 79, Math.floor(x), Math.floor(y), 34, 79)},
    green_up: function(x, y) {ctx.drawImage(sprites.cars, 106, 79*3+1, 32, 79, Math.floor(x), Math.floor(y), 32, 79)},
    green_down: function(x, y) {ctx.drawImage(sprites.cars, 140, 79*3+1, 32, 79, Math.floor(x), Math.floor(y), 32, 79)},
    green2_up: function(x, y) {ctx.drawImage(sprites.cars2, 0, 0, 32, 74, Math.floor(x), Math.floor(y), 32, 74)},
    green2_down: function(x, y) {ctx.drawImage(sprites.cars2, 0, 74, 32, 72, Math.floor(x), Math.floor(y), 32, 72)},
    red_up: function(x, y) {ctx.drawImage(sprites.cars2, 32, 0, 32, 74, Math.floor(x), Math.floor(y), 32, 74)},
    red_down: function(x, y) {ctx.drawImage(sprites.cars2, 32, 74, 32, 72, Math.floor(x), Math.floor(y), 32, 72)},
    yellow_up: function(x, y) {ctx.drawImage(sprites.cars2, 64, 0, 32, 74, Math.floor(x), Math.floor(y), 32, 74)},
    yellow_down: function(x, y) {ctx.drawImage(sprites.cars2, 64, 74, 32, 72, Math.floor(x), Math.floor(y), 32, 72)},
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
    hide_send_score_button();
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
        if (timer < 1 && timer != 0) {
            timer = 0;
            game.game_over = true;
            show_send_score_button();
        }
    } else {
        if (!game.game_over && game.player.crashed) {timer = 60}
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

function show_send_score_button() {
    // If embedded on Rainey Arcade, integrate with the send_score_button
    const send_score_button = document.getElementById("send_score_button");
    if (send_score_button) {
        function sendScore(e) {
            send_score(
                document.getElementById("game_title").dataset.filename,
                game.player.money,
                send_score_button.dataset.csrfToken,
            );
            e.currentTarget.setAttribute("style", "display: none;");
            e.currentTarget.removeEventListener("click", sendScore);
            e.stopPropagation();
        }
        send_score_button.setAttribute("style", "z-index: 100; display: block; left: 50%; bottom: 1em; transform: translate(-50%);");
        send_score_button.addEventListener("click", sendScore);
    }
}