export let meters = {
    draw: function(ctx, game) {
        drawLevel(ctx, game.level, game.progress);
        drawFuel(ctx, game.player.fuel, game.max_fuel);
    }
}

function drawLevel(ctx, level, progress) {
    ctx.fillStyle = "#000";
    ctx.font = "24pt Sans";
    ctx.fillText(`Level ${level}`, 340, 90);
    ctx.fillRect(340, 92, 100, 2);
    ctx.font = "16pt Sans";
    ctx.fillText(`${Math.floor((level * 6000) - progress)}km until next level`, 340, 118);
}

function drawFuel(ctx, fuel, max_fuel) {
    ctx.fillStyle = "#000";
    ctx.fillRect(400, 200, 200, 28);
    ctx.font = "18pt Sans";
    ctx.fillText("Fuel", 340, 222);
    ctx.fillStyle = "#800000";
    ctx.fillRect(402, 202, 196, 24);
    ctx.fillStyle = "#7FFF00";
    ctx.fillRect(402, 202, (196 / max_fuel) * fuel, 24);
}