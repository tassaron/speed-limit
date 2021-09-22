export class ParallelTraffic {
    constructor() {
        this.x = 170 + Math.floor((Math.random() * 30));
        this.y = -79;
        this.height = 32;
        this.width = 79;
        this.passed = false;
    }

    update(ratio, player) {
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
    }
}