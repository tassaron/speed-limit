class Traffic {
    constructor(start_x) {
        this.x = start_x + Math.floor((Math.random() * 45));
        this.y = -79 * 2;
        this.centre = this.x;
        this.width = 32;
        this.height = 79;
        this.crashed = false;
        this.colour = Math.floor(Math.random() * 3);
        this.anim = 0.0;
    }

    update(ratio, player, speed, swerve=1) {
        if (this.crashed) {
            this.y += 8 * ratio;
            this.anim += ratio;
        }
        if (player.collides(this)) {
            this.crashed = true;
            if (player.hp > 0) {
                player.hp -= ratio * 2;
            };
        }
        if (this.crashed) {return;}
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
    }

    draw(draw_sprite) {
        for (let i = 0; i < this.height; i += 79) {
            if (this.anim < 10) {
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
            if (this.crashed) {
                draw_sprite.explosion(Math.floor(this.anim/5), this.x, this.y);
                draw_sprite.explosion(Math.floor(this.anim/5), this.x, this.y + 32);
            }
        }
    }
}

export class ParallelTraffic extends Traffic {
    constructor(num) {
        super(150);
        this.passed = false;
        this.height = 79 * num;
        this.y = (-79 * num) * 2;
    }

    update(ratio, player) {
        Traffic.prototype.update.call(this, ratio, player, 1, -1);
        if (!this.passed && player.x + player.width > this.x + 20 && player.x < this.x + this.width && this.y > player.y + player.height && (this.y - (player.y + player.height)) < 120) {
            this.passed = true;
            player.score += 1;
            player.money += 500;
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
        if (this.anim < 10) {
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
        if (this.crashed) {
            draw_sprite.explosion(Math.floor(this.anim/10), this.x, this.y);
            draw_sprite.explosion(Math.floor(this.anim/10), this.x, this.y + 32);
        }
    }
}

export class RearTraffic extends Traffic {
    constructor() {
        super(130);
        this.y = 598;
        this.cooldown = 0.0;
        this.preferred_centre = this.centre;
        this.collision = false;
        this.passing = false;
    }

    update(ratio, player, traffic, otraffic) {
        Traffic.prototype.update.call(this, ratio, player, this.collision ? (this.passing ? -0.9 : -0.4) : -0.6, this.collision ? ( this.passing ? -0.5 : -6) : -1);
        if (this.crashed) {
            return;
        } else {
            if (this.x + this.width > 240 || this.x < 40 ) {
                this.crashed = true;
            } else if (traffic != null && Object.getPrototypeOf(player).collides.call(this, traffic)) {
                this.crashed = true;
                traffic.crashed = true;
            } else if (otraffic != null && Object.getPrototypeOf(player).collides.call(this, otraffic)) {
                this.crashed = true;
                otraffic.crashed = true;
            }
        };

        if (this.cooldown > 0) {
            this.cooldown -= ratio;
            return;
        }
        if (this.collision && this.y + this.height < this.collision[2] + 80) {
            this.centre = traffic != null ? Math.min(this.preferred_centre, traffic.x) : this.preferred_centre;
            this.collision = false;
            this.passing = false;
        } else {
            // What will happen if our trajectory continues?
            this.y -= 64;
            if (this.x < 30 || (this.otraffic != null && this.x < otraffic.x + otraffic.width)) {
                // travelling to the right
                this.set_collision(player, traffic);
                if (this.collision) {
                    this.centre += (Math.abs(this.x - this.collision[1]) * 2) * ratio;
                    this.cooldown = 40;
                }
            } else if (this.x + (this.width * 2) > 240 || 
                        (traffic != null && traffic.x + traffic.width > 240 - (this.width * 2)) ||
                        player.x + player.width > 240 - (this.width * 2)
                        ) {
                // travelling to the left
                this.set_collision(player, traffic);
                if (this.collision) {
                    this.centre -= (Math.abs((this.x + this.width) - this.collision[0]) * 2) * ratio;
                    this.cooldown = 60;
                }
            }
            // reset to where we really are
            this.y += 64;
        }
    }

    set_collision(player, traffic) {
        if (this.collision) {
            this.passing = true;
            this.centre = this.x;
            return;
        }
        if (traffic != null && Object.getPrototypeOf(player).collides.call(this, traffic)) {
            this.collision = [traffic.x, traffic.x + traffic.width, traffic.y];
        } else if (player.collides(this)) {
            this.collision = [player.x, traffic.x + player.width, player.y];
        }
    }
}