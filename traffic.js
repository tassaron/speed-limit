class Traffic {
    constructor(start_x) {
        this.x = start_x + Math.floor((Math.random() * 45));
        this.y = -79;
        this.centre = this.x;
        this.width = 32;
        this.height = 79;
        this.crashed = false;
        this.colour = Math.floor(Math.random() * 3);
    }

    update(ratio, player, speed, swerve=1) {
        if (this.crashed) {
            this.y += 8 * ratio;
            return
        }
        this.y += speed * ratio;
        if (Math.random() > 0.8) {
            this.x += swerve * ratio / 2;
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
}

export class ParallelTraffic extends Traffic {
    constructor(num) {
        super(150);
        this.passed = false;
        this.height = 79 * num;
        this.y = -79 * num;
    }

    update(ratio, player) {
        Traffic.prototype.update.call(this, ratio, player, 1, -1);
        if (!this.passed && player.x + player.width > this.x + 20 && player.x < this.x + this.width && this.y > player.y + player.height && (this.y - (player.y + player.height)) < 120) {
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

export class OncomingTraffic extends Traffic {
    constructor() {
        super(50);
    }

    update(ratio, player) {
        Traffic.prototype.update.call(this, ratio, player, 16);
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