export let background = {
    tick: 0,
    y: 0,
    grass: [],
    draw: function(ctx, draw_sprite, fps_ratio) {
        this.tick += 1 * fps_ratio;
        ctx.fillStyle = "#807E78";
        ctx.fillRect(0, 0, 240, 598);
        draw_sprite.wall_left(0, this.y);
        draw_sprite.wall_left(0, this.y - 598);
        draw_sprite.wall_right(240, this.y);
        draw_sprite.wall_right(240, this.y - 598);
        this.y += 8 * fps_ratio;
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
            let tile = this.grass[i];
            draw_sprite.grass(tile.i, tile.x, tile.y);
            tile.y += 8 * fps_ratio;
        }
        this.grass = this.grass.filter(function(tile) {return (tile.y < 598) });
    }
}


class Tile {
    constructor() {
        this.i = Math.floor(Math.random() * 12) + 1;
        this.x = Math.floor(Math.random() * (640 - 279)) + 279;
        this.y = -32;
    }
}