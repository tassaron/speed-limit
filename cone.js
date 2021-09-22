export class Cone {
    constructor() {
        this.x = 105 + Math.floor(Math.random() * 25);
        this.y = -42;
        this.height = 21;
        this.width = 20;
        this.collected = false;
    }

    update(ratio, player) {
        this.y += 8 * ratio;
        if (player.collides(this)) {
            this.collected = true;
            player.hp -= 10.0;
        }
    }
}