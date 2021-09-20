export class Player {
    constructor() {
        this.x = 104;
        this.y = 340;
        this.width = 32;
        this.crashed = false;
    }

    update(keys_pressed, fps_ratio) {
        if (this.crashed) {
            this.y += 8 * fps_ratio;
            return
        }
        if (keys_pressed.left) {
            this.x -= 4 * fps_ratio;
        } else if (keys_pressed.right) {
            this.x += 4 * fps_ratio;
        }

        if (this.x + this.width > 240 || this.x < 40) {
            this.crashed = true;
        }
    }

    draw(ctx, draw_sprite) {
        draw_sprite.pink_up(this.x, this.y);
    }
}