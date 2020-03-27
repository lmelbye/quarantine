import { World, Particle } from "./simulation";

function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}

interface DataPoint {
    sick : number;
    cured : number;
    healthy : number;
    time : number;
}

export class Chart {
    ctx : CanvasRenderingContext2D;
    canvas : HTMLCanvasElement;
    points : DataPoint[] = []; 

    currentMax = 0;

    cured = document.getElementById('cured');
    healthy = document.getElementById('healthy');
    sick = document.getElementById('sick');
    total = document.getElementById('total');
    maxSick = document.getElementById('maxsick');

    constructor(canvas : HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (ctx === null) {
            throw "Could not initialize canvas";
        }
        this.ctx = ctx;
        this.canvas = canvas;
    }

    clear() {
        this.points = [];
        this.currentMax = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    push(w : World) {
        let allParticles;
        switch (w.movement.kind) {
            case 'linear':
                allParticles = w.movement.particles
                break;
            case 'groups':
                allParticles = ([] as Particle[]).concat(...w.movement.groups.map(g => g.particles)); 
                break;
        }

        const sick = allParticles.filter(p => p.health.state == "sick").length;
        const cured = allParticles.filter(p => p.health.state == "cured").length;
        const healthy = allParticles.filter(p => p.health.state == "healthy").length;

        this.points.push({
            sick,
            cured,
            healthy,
            time : w.time,
        })

        this.currentMax = Math.max(this.currentMax, sick);

        if (this.healthy && this.maxSick && this.cured && this.total && this.sick) {
            this.healthy.innerHTML = ''+healthy;
            this.cured.innerHTML = ''+cured;
            this.maxSick.innerHTML = ''+this.currentMax;
            this.sick.innerHTML = ''+sick;
            this.total.innerHTML = ''+allParticles.length
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#f00';
        this.ctx.beginPath();
        let x = 0;
        let y = this.canvas.height;
        this.ctx.moveTo(x, y);

        this.points.forEach(p => {
            y = this.canvas.height-p.sick;
            x = p.time*10;
            this.ctx.lineTo(x,y);
        });
        this.ctx.lineTo(x,this.canvas.height);
        this.ctx.closePath();
        this.ctx.fill();
    }

    
}
