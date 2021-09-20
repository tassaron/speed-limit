export class Player {
    constructor() {
        this.x = 104;
        this.y = 340;
        this.width = 32;
        this.crashed = false;
        this.skids = [];
    }

    update(keys_pressed, fps_ratio) {
        for (let skid of this.skids) {
            skid.age += 1 * fps_ratio;
            skid.y += skid.v * fps_ratio;
        }
        this.skids = this.skids.filter(function(skid) {return (skid.age < 60 - (30 - skid.v)) });
        if (this.crashed) {
            this.y += 8 * fps_ratio;
            return
        }
        if (keys_pressed.left) {
            this.x -= 4 * fps_ratio;
            if (Math.random() > 0.1) {
                this.skids.push(new Skid(6, this.x, this.y + 14));
            }
        } else if (keys_pressed.right) {
            this.x += 4 * fps_ratio;
            if (Math.random() > 0.1) {
                this.skids.push(new Skid(6, this.x, this.y + 14));
            }
        } else if (keys_pressed.down) {
            if (Math.random() > 0.2) {
                this.skids.push(new Skid(4, this.x, this.y + 74));
            }
        }

        if (this.x + this.width > 240 || this.x < 40) {
            this.crashed = true;
        }
    }

    draw(ctx, draw_sprite) {
        for (let skid of this.skids) {
            draw_sprite.skid(skid.x, skid.y);
        }
        draw_sprite.pink_up(this.x, this.y);
    }
}

class Skid {
    constructor(v, x, y) {
        this.v = v;
        this.x = x;
        this.y = y;
        this.age = 0;
    }
}