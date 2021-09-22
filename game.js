import { Player } from './player.js';
import { meters } from './meters.js';
import { background } from './background.js';
import { Fuel } from './fuel.js';
import { Cone } from './cone.js';
import { OncomingTraffic, ParallelTraffic } from './traffic.js';

export class Game {
    constructor () {
        this.level = 0;
        this.max_fuel = 2000.0;
        this.max_hp = 100.0;
        this.progress = 0.0;
        this.paused = false;
        this.in_menu = false;
        this.game_over = false;
        this.fuel_pickup = null;
        this.parallel_traffic = null;
        this.oncoming_traffic = null;
        this.cone = null;
        this.player = new Player(this.max_fuel, this.max_hp);
    }

    update(keys_pressed, ratio) {
        background.update(keys_pressed, ratio);
        this.player.update(keys_pressed, ratio);
        this.progress += ratio;
        if (this.progress > this.level * 1000) {
            this.level += 1;
            this.progress = 0.0;
        }

        if (this.fuel_pickup != null) {
            this.fuel_pickup.update(ratio, this.player);
            if (this.fuel_pickup.collected || this.fuel_pickup.y > 598) {
                this.fuel_pickup = null;
            }
        } else if (this.player.fuel < 1550 & Math.random() > (1.0 - ((this.max_fuel - this.player.fuel)/120000))) {
            let spawn_x = Math.floor(Math.random() * 180) + 40;
            if (this.parallel_traffic != null && spawn_x + 35 > this.parallel_traffic.x && spawn_x < this.parallel_traffic.x + this.parallel_traffic.width) {
                spawn_x -= Math.abs(this.parallel_traffic.x - (spawn_x + 35));
            }
            this.fuel_pickup = new Fuel(spawn_x);
        }

        if (this.parallel_traffic != null) {
            this.parallel_traffic.update(ratio, this.player);
            if (this.parallel_traffic.y > 598) {
                this.parallel_traffic = null;
            }
        } else {
            this.parallel_traffic = new ParallelTraffic(Math.random() < 0.1 ? 2 : 1);
        }

        if (this.oncoming_traffic != null) {
            this.oncoming_traffic.update(ratio, this.player);
            if (this.oncoming_traffic.y > 598) {
                this.oncoming_traffic = null;
            }
        } else {
            if (Math.random() > (1.0 - (this.level / 1000))) {
                this.oncoming_traffic = new OncomingTraffic();
            }
        }

        if (this.cone != null) {
            this.cone.update(ratio, this.player);
            if (this.cone.collected || this.cone.y > 598) {
                this.cone = null;
            }
        } else {
            if (Math.random() > (1.0 - (this.level / 1000))) {
                this.cone = new Cone();
            }
        }
    }

    draw(ctx, draw_sprite) {
        background.draw(ctx, draw_sprite);
        if (!this.game_over) {
            meters.draw(ctx, this);
        }
        this.player.draw(ctx, draw_sprite)
        if (this.cone) {
            draw_sprite.cone(this.cone.x, this.cone.y);
        }
        if (this.fuel_pickup) {
            draw_sprite.fuel(this.fuel_pickup.x, this.fuel_pickup.y);
        }
        if (this.parallel_traffic) {
            this.parallel_traffic.draw(draw_sprite);
        }
        if (this.oncoming_traffic) {
            this.oncoming_traffic.draw(draw_sprite);
        }
    }
}