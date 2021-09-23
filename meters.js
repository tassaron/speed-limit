export let meters = {
    update: function(keys_pressed, game) {
        switch (keys_pressed.number) {
            case 1:
                // Repair button
                if (game.player.money >= 5000) {
                    game.player.money -= 5000;
                    game.player.hp = game.max_hp;
                }
                break;
            case 2:
                // Refuel button
                if (game.player.money >= 1000) {
                    game.player.money -= 1000;
                    game.player.fuel = game.max_fuel;
                }
                break;
            case 3:
                // Upgrade Fuel button
                if (game.player.money >= 10000) {
                    game.player.money -= 10000;
                    game.max_fuel += 500.0;
                }
                break;
            case 4:
                // Upgrade HP button
                if (game.player.money >= 15000) {
                    game.player.money -= 15000;
                    game.max_hp += 40.0;
                }
                break;
        }
    },

    draw: function(ctx, game) {
        drawLevel(ctx, game.level, game.progress);
        drawScore(ctx, game.player.score);
        drawMoney(ctx, game.player.money);
        drawFuel(ctx, game.player.fuel, game.max_fuel);
        drawHp(ctx, game.player.hp, game.max_hp);
        drawButtons(ctx, game);
    }
}

function drawLevel(ctx, level, progress) {
    ctx.fillStyle = "#000";
    ctx.font = "24pt Sans";
    ctx.fillText(`Level ${level}`, 340, 90);
    ctx.fillRect(340, 92, 100, 2);
    ctx.font = "16pt Sans";
    ctx.fillText(`${Math.floor((level * 1000) - progress)}km until next level`, 340, 118);
}

function drawScore(ctx, score) {
    ctx.fillStyle = "#000";
    ctx.font = "18pt Sans";
    ctx.fillText(`Cars Passed: ${score}`, 340, 180);
}

function drawMoney(ctx, money) {
    ctx.fillStyle = "#000";
    ctx.font = "18pt Sans";
    ctx.fillText(`Money: \$${money}`, 340, 212);
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
        ctx.fillRect(340, y, 260, 46);
        ctx.fillStyle = colour;
        ctx.fillRect(342, y + 2, 256, 42);
        ctx.fillStyle = outline;
        ctx.font = "16pt Sans";
        ctx.fillText(text, 360, y + 32);
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
    drawButton("1. Repair ($5k)", 302, outline, colour);
    if (game.player.money >= 1000) {enable()} else {disable()}
    drawButton("2. Refuel ($1k)", 354, outline, colour);
    if (game.player.money >= 10000) {enable()} else {disable()}
    drawButton("3. Upgrade Fuel ($10k)", 404, outline, colour);
    if (game.player.money >= 15000) {enable()} else {disable()}
    drawButton("4. Upgrade HP ($15k)", 454, outline, colour);
}