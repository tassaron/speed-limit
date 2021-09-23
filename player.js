export class Player {
    constructor(fuel, hp) {
        this.x = 135;
        this.y = 340;
        this.height = 79;
        this.width = 32;
        this.crashed = false;
        this.skids = [];
        this.fuel = fuel;
        this.hp = hp;
        this.money = 0;
        this.score = 0;
        this.anim = 0.0;
    }

    update(keys_pressed, fps_ratio) {
        for (let skid of this.skids) {
            skid.age += fps_ratio;
            skid.y += skid.v * fps_ratio;
        }
        this.skids = this.skids.filter(function(skid) {return (skid.age < 60 - (30 - skid.v)) });

        if (this.crashed) {
            this.y += 8 * fps_ratio;
            this.anim += fps_ratio;
            if (this.anim > 30) {
                this.anim = 0.0;
            }
            return
        }
        this.fuel -= fps_ratio;

        function go_left(self) {
            self.x -= 4 * fps_ratio;
            if (Math.random() > 0.1) {
                self.skids.push(new Skid(6, self.x, self.y + 14));
            }
        }

        function go_right(self) {
            self.x += 4 * fps_ratio;
            if (Math.random() > 0.1) {
                self.skids.push(new Skid(6, self.x, self.y + 14));
            }
        }

        function go_down(self) {
            if (self.y < 580) {
                self.y += 4 * fps_ratio;
                if (Math.random() > 0.2) {
                    self.skids.push(new Skid(8, self.x, self.y + 74));
                }
            }
        }

        function go_up(self) {
            if (self.y > -self.height + 20) {
                self.y -= 2 * fps_ratio;
            }
        }
 
        if (keys_pressed.left && this.x > 40) {
            go_left(this);
        } else if (keys_pressed.right && this.x + this.width < 240) {
            go_right(this);
        } 
        if (keys_pressed.down) {
            go_down(this);
        } else if (keys_pressed.up) {
            go_up(this);
        }

        if (!keys_pressed.left && !keys_pressed.right && !keys_pressed.up && !keys_pressed.down && keys_pressed.mouse) {
            // move towards mouseclick
            if (keys_pressed.mouse_pos[0] < this.x && keys_pressed.mouse_pos[0] > 40) {
                go_left(this);
            } else if (keys_pressed.mouse_pos[0] > this.x + this.width && keys_pressed.mouse_pos[0] < 240) {
                go_right(this);
            }
            if (keys_pressed.mouse_pos[1] < this.y) {
                go_up(this);
            } else if (keys_pressed.mouse_pos[1] > this.y + this.height) {
                go_down(this);
            }
        }

        if (this.x + this.width > 240 || this.x < 40) {
            this.hp -= fps_ratio;
        }
        if (this.fuel < 1 || this.hp < 1) {
            this.crashed = true;
            if (this.hp < 1) {this.hp = 0;}
        }
    }

    draw(ctx, draw_sprite) {
        for (let skid of this.skids) {
            draw_sprite.skid(skid.x, skid.y);
        }
        draw_sprite.pink_up(this.x, this.y);
        if (this.crashed) {
            draw_sprite.explosion(Math.floor(this.anim/5), this.x, this.y);
            draw_sprite.explosion(Math.floor(this.anim/5), this.x, this.y + 32);
        }
    }

    collides(other) {
        return (this.x + this.width > other.x && this.x < other.x + other.width && other.y + other.height > this.y && other.y < this.y + this.height);
    }
}

class Skid {
    constructor(v, x, y) {
        this.v = v;
        this.x = x;
        this.y = y;
        this.age = 0;
    }
}