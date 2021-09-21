import { Player } from './player.js';
import { meters } from './meters.js';
import { background } from './background.js';

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
    }

    update(keys_pressed, ratio) {
        background.update(keys_pressed, ratio);
        this.player.update(keys_pressed, ratio);
    }

    draw(ctx, draw_sprite) {
        background.draw(ctx, draw_sprite);
        if (!this.game_over) {
            meters.draw(ctx, this);
        }
        this.player.draw(ctx, draw_sprite)
    }
}