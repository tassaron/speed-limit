export class ParallelTraffic {
    constructor(num) {
        this.x = 155 + Math.floor((Math.random() * 45));
        this.centre = this.x;
        this.y = -79 * num;
        this.height = 79 * num;
        this.width = 32;
        this.passed = false;
        this.crashed = false;
        this.colour = Math.floor(Math.random() * 3);
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
            if ((this.centre + Math.floor((Math.random() * 10))) - this.x < 0) {
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

    draw(draw_sprite) {
        for (let i = 0; i < this.height; i += 79) {
            switch(this.colour) {
                case 0:
                    draw_sprite.blue_up(this.x, this.y + i);
                    break;
                case 1:
                    draw_sprite.blue2_up(this.x, this.y + i);
                    break;
                case 2:
                    draw_sprite.green_up(this.x, this.y + i);
                    break;
            }
        }
    }
}

export class OncomingTraffic {
    constructor() {
        this.x = 55 + Math.floor((Math.random() * 35));
        this.centre = this.x;
        this.y = -79;
        this.height = 79;
        this.width = 32;
        this.crashed = false;
        this.colour = Math.floor(Math.random() * 3);
    }

    update(ratio, player) {
        if (this.crashed) {
            this.y += 8 * ratio;
            return
        }
        this.y += 16 * ratio;
        if (Math.random() > 0.8) {
            this.x += ratio / 2;
        } else {
            if ((this.centre + Math.floor((Math.random() * 10))) - this.x < 0) {
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

    draw(draw_sprite) {
        switch(this.colour) {
            case 0:
                draw_sprite.blue_down(this.x, this.y);
                break;
            case 1:
                draw_sprite.blue2_down(this.x, this.y);
                break;
            case 2:
                draw_sprite.green_down(this.x, this.y);
                break;
        }
    }
}