import { Draw } from "./draw";
import { World, step, Particle, ParticleGroup } from "./simulation";
import { Chart } from "./chart";

function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}

export const cureTime = 10;
export const count = 300
export const particleRadius = 2;
export const particleSpeed = 80;
export const groupSpeed = 50;
export const groupDistance = -1;
export const groupParticleSpeed = 30;
export const length = 60;

window.onload = () => {
    const worldCanvas = <HTMLCanvasElement> document.getElementById("world");
    const chartCanvas = <HTMLCanvasElement> document.getElementById("chart");

    if (worldCanvas == null || chartCanvas == null) {
        throw "Canvas not found";
    }

    const chart = new Chart(chartCanvas);
    const draw = new Draw(worldCanvas);
    let world : World;

    const select = <HTMLSelectElement> document.getElementById("movement")
    if (!select) {
        throw "Select not found";
    }

    start(select.value);

    select.addEventListener('change', (event) => {
        // @ts-ignore
        start(event.currentTarget.value);
    });

    function start(setting : string) {
        switch (setting) {
            case 'all':
                world = bounceWorld(worldCanvas.width, worldCanvas.height, count);
                break;
            case 'p50':
                world = bounceWorld(worldCanvas.width, worldCanvas.height, count*0.5);
                break;
            case 'p10':
                world = bounceWorld(worldCanvas.width, worldCanvas.height, count*0.1);
                break;
            case 'p5':
                world = bounceWorld(worldCanvas.width, worldCanvas.height, count*0.05);
                break;
            case 'g10':
                world = groupWorld(worldCanvas.width, worldCanvas.height, 10, 17);
                break;
            case 'g5':
                world = groupWorld(worldCanvas.width, worldCanvas.height, 5, 8);
                break;
            case 'g2':
                world = groupWorld(worldCanvas.width, worldCanvas.height, 2, 6);
                break;

        }
        chart.clear();
        draw.world(world);
        chart.push(world);
        chart.draw();
    }

    const dt = 1/60.0;

    const stepSim = (dt : number) => {
        world = step(world, dt);
        draw.world(world);
        chart.push(world);
        chart.draw();
    }
    let intervalTimer : NodeJS.Timeout;
    const play = () => {
        start(select.value);
        if (intervalTimer) {
            clearInterval(intervalTimer)
        }

        intervalTimer = setInterval(() => {
            stepSim(dt);
            if (world.time > length) {
                clearInterval(intervalTimer);
            }
        }, dt*1000);
    }

    (<any>window).stepSim = stepSim;
    (<any>window).play = play;

}

function bounceWorld(width : number, height : number, moving : number) : World {
    let particles : Particle[] = [];
    for (let i = 0; i < count; i++) {
        let speedx = 0
        let speedy = 0
        if (i < moving) {
            const dir = randomUnitVector();
            speedx = dir.x*particleSpeed;
            speedy = dir.y*particleSpeed;;
        }

        const x = Math.random() * (width - particleRadius*2) + particleRadius;
        const y = Math.random() * (height - particleRadius*2) + particleRadius;

        particles.push({
            size : particleRadius,
            speedx,
            speedy,
            x,
            y,
            health : i % 100 == 0 ? { state : "sick", time : 0 } : { state : "healthy" }
        })
    }

    return {
        movement : { kind : 'linear', particles },
        height, width,
        time : 0,
    }
}



function randomUnitVector() {
    const x = Math.random()*2-1;
    const y = Math.random()*2-1;

    const norm = Math.sqrt(x**2 + y**2);

    return { x: x/norm, y : y/norm };
}

function groupWorld(width : number, height : number, groupSize : number, radius : number) : World {
    let ps : Particle[] = [];

    const nGroups = count/groupSize;

    const groups : ParticleGroup[] = [];


    for (let g = 0; g < nGroups; g++) {
        const dir = randomUnitVector();
        const speedx = dir.x*groupSpeed;
        const speedy = dir.y*groupSpeed;

        let centerx : number, centery : number;
        let closeToGroup;
        let retry = 0;
        do {
            centerx = Math.random() * (width - radius*2) + radius;
            centery = Math.random() * (height - radius*2) + radius;

            closeToGroup = groups.some(g  =>
                Math.sqrt((g.centerx - centerx)**2 + (g.centery - centery)**2) < radius*2 + groupDistance
            );
            retry++

            if (retry > 50) {
                throw 'Could not generate groups';
            }
        } while (closeToGroup)

        const group : ParticleGroup = {
            centerx,
            centery,
            speedx,
            speedy,
            radius,
            particles : [],
        }

        for (let i = 0; i < groupSize; i++) {

            let x = Math.random()*radius*2-radius + centerx
            let y = Math.random()*radius*2-radius + centery

            const dir = randomUnitVector();

            const speedx = dir.x*groupParticleSpeed;
            const speedy = dir.y*groupParticleSpeed;

            group.particles.push({
                size : particleRadius,
                speedx,
                speedy,
                x,
                y,
                health : ((g+1)*groupSize+i) % 100 == 0 ? { state : "sick", time : 0 } : { state : "healthy" }
            })
        }
        groups.push(group);
    }
    return {
        movement : { kind : 'groups', groups },
        height, width,
        time : 0,
    }
}

