export let meters = {
    draw: function(ctx, game) {
        drawLevel(ctx, game.level, game.progress);
        drawScore(ctx, game.player.score);
        drawMoney(ctx, game.player.money);
        drawFuel(ctx, game.player.fuel, game.max_fuel);
        drawHp(ctx, game.player.hp, game.max_hp);
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