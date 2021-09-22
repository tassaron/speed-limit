export class Player {
    constructor(fuel, hp) {
        this.x = 135;
        this.y = 340;
        this.height = 79;
        this.width = 32;
        this.crashed = false;
        this.skids = [];
        this.fuel = fuel;
        this.hp = hp;
        this.score = 0;
    }

    update(keys_pressed, fps_ratio) {
        for (let skid of this.skids) {
            skid.age += fps_ratio;
            skid.y += skid.v * fps_ratio;
        }
        this.skids = this.skids.filter(function(skid) {return (skid.age < 60 - (30 - skid.v)) });
        if (this.crashed) {
            this.y += 8 * fps_ratio;
            return
        }
        this.fuel -= fps_ratio;
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
        } 
        if (keys_pressed.down) {
            if (this.y < 336) {
                this.y += 4 * fps_ratio;
                if (Math.random() > 0.2) {
                    this.skids.push(new Skid(8, this.x, this.y + 74));
                }
            }
        } else if (keys_pressed.up) {
            if (this.y > 240) {
                this.y -= 2 * fps_ratio;
            }
        }

        if (this.x + this.width > 240 || this.x < 40 || this.fuel < 1 || this.hp < 1) {
            this.crashed = true;
        }
    }

    draw(ctx, draw_sprite) {
        for (let skid of this.skids) {
            draw_sprite.skid(skid.x, skid.y);
        }
        draw_sprite.pink_up(this.x, this.y);
    }

    collides(other) {
        return (this.x + this.width > other.x && this.x < other.x + other.width && other.y + other.height > this.y && other.y < this.y + this.height);
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