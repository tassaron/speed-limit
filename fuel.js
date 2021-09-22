export class Fuel {
    constructor(x) {
        this.x = x;
        this.y = -64;
        this.height = 32;
        this.width = 35;
        this.collected = false;
    }

    update(ratio, player) {
        this.y += 8 * ratio;
        if (player.collides(this)) {
            this.collected = true;
            player.fuel += 500.0;
        }
    }
}