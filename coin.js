export class Coin {
    constructor() {
        this.x = 40 + Math.floor(Math.random() * 120);
        this.y = -32;
        this.height = 32;
        this.width = 32;
        this.collected = false;
        this.anim = 0.0;
        this.value = Math.floor((Math.random() * 3));
    }

    update(ratio, player) {
        this.y += 8 * ratio;
        if (player.collides(this)) {
            this.collected = true;
            player.money += (this.value * 500.0) + 500;
            player.total_money += (this.value * 500.0) + 500;
        }
        this.anim += ratio / 5;
        if (this.anim > 8) {
            this.anim = 0.0;
        }
    }

    draw(draw_sprite) {
        draw_sprite.coin(Math.floor(this.anim), this.value, this.x, this.y);
    }
}