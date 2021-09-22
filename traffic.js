export class ParallelTraffic {
    constructor() {
        this.x = 170 + Math.floor((Math.random() * 30));
        this.y = -79;
        this.height = 79;
        this.width = 32;
        this.passed = false;
        this.crashed = false;
    }

    update(ratio, player) {
        if (this.crashed) {
            this.y += 8 * ratio;
            return
        }
        this.y += ratio;
        if (Math.random() > 0.8) {
            this.x -= ratio / 2;
        } else {
            if ((180 + Math.floor((Math.random() * 10))) - this.x < 0) {
                this.x -= ratio / 3;
            } else {
                this.x += ratio;
            }
        }
        if (player.collides(this)) {
            this.crashed = true;
            player.crashed = true;
        } else if (!this.passed && player.x + player.width > this.x + 20 && player.x < this.x + this.width && this.y > player.y + player.height) {
            this.passed = true;
            player.score += 1;
        }
    }
}

export class OncomingTraffic {
    constructor() {
        this.x = 55 + Math.floor((Math.random() * 30));
        this.y = -79;
        this.height = 79;
        this.width = 32;
        this.crashed = false;
    }

    update(ratio, player) {
        if (this.crashed) {
            this.y += 8 * ratio;
            return
        }
        this.y += 16 * ratio;
        if (Math.random() > 0.8) {
            this.x -= ratio / 2;
        } else {
            if ((70 + Math.floor((Math.random() * 10))) - this.x < 0) {
                this.x -= ratio / 3;
            } else {
                this.x += ratio;
            }
        }
        if (player.collides(this)) {
            this.crashed = true;
            player.crashed = true;
        }
    }
}