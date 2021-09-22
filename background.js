export let background = {
    tick: 0,
    y: 0,
    grass: [],
    update: function(keys_pressed, ratio) {
        this.tick += 1 * ratio;
        this.y += 8 * ratio;
        if (this.y >= 598) {
            this.y = 0;
        }

        if (Math.floor(this.tick) % 8 == 0) {
            this.grass.push(new Tile());
        }
        if (this.tick > 99) {
            this.tick = 0;
        }

        for (let i = 0; i < this.grass.length; i++) {
            this.grass[i].y += 8 * ratio;
        }
        this.grass = this.grass.filter(function(tile) {return (tile.y < 598) });
    },
    draw: function(ctx, draw_sprite) {
        ctx.fillStyle = "#0e6b00";
        ctx.fillRect(0, 0, ctx.width, ctx.height);
        ctx.fillStyle = "#807E78";
        ctx.fillRect(0, 0, 240, ctx.height);
        ctx.fillStyle = "#aaa";
        for (let i = -900; i < 1000; i += 200) {
            ctx.fillRect(136, (5.98 * this.tick) + i, 8, 60);
        }
        draw_sprite.wall_left(0, this.y);
        draw_sprite.wall_left(0, this.y - 598);
        draw_sprite.wall_right(240, this.y);
        draw_sprite.wall_right(240, this.y - 598);
        for (let i = 0; i < this.grass.length; i++) {
            draw_sprite.grass(this.grass[i].i, this.grass[i].x, this.grass[i].y);
        }
    }
}


class Tile {
    constructor() {
        this.i = Math.floor(Math.random() * 12) + 1;
        this.x = Math.floor(Math.random() * (640 - 279)) + 279;
        this.y = -32;
    }
}