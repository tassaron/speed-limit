import { Player } from './player.js';
import { meters } from './meters.js';
import { background } from './background.js';
import { Fuel } from './fuel.js';

export class Game {
    constructor () {
        this.level = 0;
        this.score = 0;
        this.max_fuel = 2000.0;
        this.max_hp = 100.0;
        this.progress = 0.0;
        this.paused = false;
        this.in_menu = false;
        this.game_over = false;
        this.player = new Player(this.max_fuel, this.max_hp);
        this.fuel_pickup = null;
    }

    update(keys_pressed, ratio) {
        background.update(keys_pressed, ratio);
        this.player.update(keys_pressed, ratio);
        this.progress += ratio;
        if (this.progress > this.level * 6000) {
            this.level += 1;
            this.progress = 0.0;
            this.player.fuel = this.max_fuel;
        }
        if (this.fuel_pickup != null) {
            this.fuel_pickup.update(ratio, this.player);
            if (this.fuel_pickup.collected || this.fuel_pickup.y > 598) {
                this.fuel_pickup = null;
            }
        } else if (this.player.fuel < 1550 & Math.random() > (1.0 - ((this.max_fuel - this.player.fuel)/120000))) {
            this.fuel_pickup = new Fuel(Math.floor(Math.random() * 180) + 40);
        }
    }

    draw(ctx, draw_sprite) {
        background.draw(ctx, draw_sprite);
        if (!this.game_over) {
            meters.draw(ctx, this);
        }
        this.player.draw(ctx, draw_sprite)
        if (this.fuel_pickup) {
            draw_sprite.fuel(this.fuel_pickup.x, this.fuel_pickup.y);
        }
    }
}