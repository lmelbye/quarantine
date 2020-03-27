import { World, Particle } from "./simulation";



export class Draw {
    ctx : CanvasRenderingContext2D;
    canvas : HTMLCanvasElement;
    constructor(canvas : HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (ctx === null) {
            throw "Could not initialize canvas";
        }
        this.ctx = ctx;
        this.canvas = canvas;
    }

    particle(p : Particle) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color(p);
        this.ctx.fill();
    }

    color(p : Particle) : string {
        switch (p.health.state) {
            case "sick":
                return "#ff0000";
            case "cured":
                return "#ffff00";
            case "healthy":
                return "#00ff";
        }
    }

    world(w : World) : boolean  {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        switch (w.movement.kind) {
            case 'linear':
                w.movement.particles.forEach(this.particle, this);
                return true;
            case 'groups':
                w.movement.groups.forEach(g => g.particles.forEach(this.particle, this));
                return true;
        }
    }
}
