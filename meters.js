export let meters = {
    draw: function(ctx, game) {
        drawFuel(ctx, game.player.fuel, game.max_fuel);
    }
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