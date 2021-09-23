const button = {
    "x": 340,
    "y": 302,
    "width": 260,
    "height": 66,
    "spacing": 70
}

function repairButton(game) {
    if (game.player.money >= 5000) {
        game.player.money -= 5000;
        game.player.hp = game.max_hp;
    }
}

function refuelButton(game) {
    if (game.player.money >= 1000) {
        game.player.money -= 1000;
        game.player.fuel = game.max_fuel;
    }
}

function upgradeFuelButton(game) {
    if (game.player.money >= 10000) {
        game.player.money -= 10000;
        game.max_fuel += 500.0;
    }
}

function upgradeHpButton(game) {
    if (game.player.money >= 15000) {
        game.player.money -= 15000;
        game.max_hp += 40.0;
    }
}

export let meters = {
    update: function(keys_pressed, game) {
        switch (keys_pressed.number) {
            case 1:
                repairButton(game);
                break;
            case 2:
                refuelButton(game);
                break;
            case 3:
                upgradeFuelButton(game);
                break;
            case 4:
                upgradeHpButton(game);
                break;
        }
        let spacing = button.spacing - button.height;
        if (keys_pressed.number < 0 && keys_pressed.mouse && keys_pressed.mouse_pos[0] >= button.x && keys_pressed.mouse_pos[0] <= button.x + button.width) {
            if (keys_pressed.mouse_pos[1] >= button.y && keys_pressed.mouse_pos[1] <= button.y + button.height) {
                repairButton(game);
            } else if (keys_pressed.mouse_pos[1] >= button.y + button.height + spacing && keys_pressed.mouse_pos[1] <= button.y + (button.height*2) + spacing) {
                refuelButton(game);
            } else if (keys_pressed.mouse_pos[1] >= button.y + (button.height * 2) + (spacing * 2) && keys_pressed.mouse_pos[1] <= button.y + (button.height*3) + (spacing*2)) {
                upgradeFuelButton(game);
            } else if (keys_pressed.mouse_pos[1] >= button.y + (button.height * 3) + (spacing * 3) && keys_pressed.mouse_pos[1] <= button.y + (button.height*4) + (spacing*3)) {
                upgradeHpButton(game);
            }
        }
    },

    draw: function(ctx, draw_sprite, game) {
        drawLevel(ctx, game.level, game.progress);
        drawScore(ctx, game.player.score);
        drawMoney(ctx, game.player.money);
        drawCar(ctx, draw_sprite, game.player);
        drawFuel(ctx, game.player.fuel, game.max_fuel);
        drawHp(ctx, game.player.hp, game.max_hp);
        drawButtons(ctx, game);
    }
}

function drawLevel(ctx, level, progress) {
    ctx.fillStyle = "#000";
    ctx.font = "24pt Sans";
    ctx.fillText(`Level ${level}`, 340, 50);
    ctx.fillRect(340, 52, 100, 2);
    ctx.font = "16pt Sans";
    ctx.fillText(`${Math.floor((level * 1000) - progress)}km until next level`, 340, 78);
}

function drawScore(ctx, score) {
    ctx.fillStyle = "#000";
    ctx.font = "18pt Sans";
    ctx.fillText(`Cars Passed: ${score}`, 340, 102);
}

function drawMoney(ctx, money) {
    ctx.fillStyle = "#000";
    ctx.font = "18pt Sans";
    ctx.fillText(`Money: \$${money}`, 340, 128);
}

function drawCar(ctx, draw_sprite, player) {
    draw_sprite.pink_right(400, 177);
    if (player.fuel < 500) {
        draw_sprite.fuel(506, 180);
        ctx.fillStyle = "#800000";
        ctx.font = "36pt Sans";
        ctx.fillText("!", 546, 210);
    }
}

function drawFuel(ctx, fuel, max_fuel) {
    ctx.fillStyle = "#000";
    ctx.fillRect(400, 226, 200, 28);
    ctx.font = "18pt Sans";
    ctx.fillText("Fuel", 340, 248);
    ctx.fillStyle = "#800000";
    ctx.fillRect(402, 228, 196, 24);
    ctx.fillStyle = "#7FFF00";
    ctx.fillRect(402, 228, (196 / max_fuel) * fuel, 24);
}

function drawHp(ctx, hp, max_hp) {
    ctx.fillStyle = "#000";
    ctx.fillRect(400, 260, 200, 28);
    ctx.font = "18pt Sans";
    ctx.fillText("HP", 340, 282);
    ctx.fillStyle = "#800000";
    ctx.fillRect(402, 262, 196, 24);
    ctx.fillStyle = "#7FFF00";
    ctx.fillRect(402, 262, (196 / max_hp) * hp, 24);
}

function drawButtons(ctx, game) {
    function drawButton(text, y, outline, colour) {
        ctx.fillStyle = outline;
        ctx.fillRect(button.x, y, button.width, button.height);
        ctx.fillStyle = colour;
        ctx.fillRect(button.x + 2, y + 2, button.width - 4, button.height - 4);
        ctx.fillStyle = outline;
        ctx.font = "16pt Sans";
        ctx.fillText(text, button.x + 20, y + 42);
    }
    function enable() {
        outline = "rgba(0, 0, 0, 1.0)";
        colour = "rgba(0, 55, 245, 1.0)";
    }
    function disable() {
        outline = "rgba(0, 0, 0, 0.5)";
        colour = "rgba(55, 55, 200, 0.5)";
    }

    // Repair button
    let outline, colour;
    if (game.player.money >= 5000) {enable()} else {disable()}
    drawButton("1. Repair ($5k)", button.y, outline, colour);
    if (game.player.money >= 1000) {enable()} else {disable()}
    drawButton("2. Refuel ($1k)", button.y + button.spacing, outline, colour);
    if (game.player.money >= 10000) {enable()} else {disable()}
    drawButton("3. Upgrade Fuel ($10k)", button.y + (button.spacing * 2), outline, colour);
    if (game.player.money >= 15000) {enable()} else {disable()}
    drawButton("4. Upgrade HP ($15k)", button.y + (button.spacing * 3), outline, colour);
}