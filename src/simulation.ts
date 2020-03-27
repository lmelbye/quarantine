import { cureTime,  groupDistance } from ".";

export interface Particle {
    x : number
    y : number
    speedx : number
    speedy : number
    health : health
    size : number
}

type health =
    { state : "healthy" } |
    { state : "sick", time : number } |
    { state : "cured" }

export interface World {
    movement : Movement
    width : number
    height : number
    time : number
}

export interface ParticleGroup {
    centerx : number,
    centery : number,
    speedx : number,
    speedy : number,
    radius : number,
    particles : Particle[],
}


type Movement = 
{ kind : 'linear', particles : Particle[] } |
{ kind : 'groups', groups : ParticleGroup[] }

function moveParticle(dt : number, w : World, p : Particle) : Particle {

    let x1 = p.x + p.speedx*dt;
    let y1 = p.y + p.speedy*dt;

    /* bounce */
    const speedx1 = x1+p.size > w.width || x1 < 0 ? -1*p.speedx : p.speedx
    const speedy1 = y1+p.size > w.height || y1 < 0 ? -1*p.speedy : p.speedy

    return {
        ...p,
        speedx: speedx1,
        speedy: speedy1,
        x : x1,
        y : y1,
    }
}

function collids(p1 : Particle, p2 : Particle) : boolean {
    const a = p1.size+p2.size;
    const x = p1.x - p2.x;
    const y = p1.y - p2.y;
    return a > Math.sqrt((x * x) + (y * y));
}

function derivedHeath(particles : Particle[], worldtime : number, p : Particle) : health {
    switch (p.health.state) {
        case "healthy":
            const getsSicks = particles.some(p1 => p1 != p && p1.health.state =="sick" && collids(p, p1));
            if (getsSicks) 
                return {
                    state : "sick",
                    time : worldtime,
                }
            return p.health
        case "sick":
            if (worldtime > p.health.time + cureTime)
                return { state : "cured" };
            return p.health
        case "cured":
            return p.health
    } 
}

function dist(x1 : number, x2 : number, y1 : number, y2 : number) {
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
}

function closeToSomeGroup(w : World, g : ParticleGroup, centerx : number, centery : number) : ParticleGroup | undefined {

    if (w.movement.kind == 'linear') throw 'error';

    return w.movement.groups.filter(g1 => g !== g1).find(g  => 
        dist(g.centerx, centerx, g.centery, centery) < g.radius*2 + groupDistance
    );
}

function moveGroup(dt : number, world : World, g : ParticleGroup) : ParticleGroup {

    if (world.movement.kind == 'linear')
        throw 'must be group';


    let dx : number
    let dy : number;

    let centerx : number
    let centery : number
    let retry = 0;
    let closeTo;
    let outSideX, outSideY;
    let infected = false;
    do {
        
        dx = g.speedx*dt;
        dy = g.speedy*dt;

        centerx = g.centerx + dx;
        centery = g.centery + dy;

        closeTo = closeToSomeGroup(world, g, centerx, centery);

        outSideX = centerx+g.radius > world.width || centerx-g.radius < 0
        outSideY = centery+g.radius > world.height || centery-g.radius < 0

        if (closeTo) {
            g.speedx *= -1;
            g.speedy *= -1;
        } else {
            if(outSideX) 
                g.speedx *= -1;

            if (outSideY) {
                g.speedy *= -1;
            }

        }



        retry++;
    } while (retry < 20 && (closeTo || outSideX || outSideY))

    g.centerx = centerx;
    g.centery = centery;

    g.centerx = Math.max(g.radius, g.centerx);
    g.centerx = Math.min(world.width-g.radius, g.centerx);

    g.centery = Math.max(g.radius, g.centery);
    g.centery = Math.min(world.height-g.radius, g.centery);


    g.particles.map(p => {
        /* move relative to group center */
        p.x += dx;
        p.y += dy;
        return p;
    }).forEach(p => {

        p.x =  p.x + p.speedx*dt;
        p.y = p.y + p.speedy*dt;

        const distanceFromCenter = dist(p.x, g.centerx, p.y, g.centery)

        /* bounce on group boundary */
        if (distanceFromCenter > g.radius) {

            /* https://jsfiddle.net/jacquesc/wd5aa1wv/9/ */
            let dx = p.x - g.centerx;
            let dy = p.y - g.centery;
            var normalMagnitude = distanceFromCenter;
            var normalX = dx / normalMagnitude;
            var normalY = dy / normalMagnitude;
            var tangentX = -normalY;
            var tangentY = normalX;
            var normalSpeed = -(normalX * p.speedx + normalY *  p.speedy);
            var tangentSpeed = tangentX * p.speedx + tangentY * p.speedy;
            p.speedx = normalSpeed * normalX + tangentSpeed * tangentX;
            p.speedy = normalSpeed * normalY + tangentSpeed * tangentY;
        }


    });



    return g;1
}

export function step(world : World, dt : number) : World {
    
    
    switch (world.movement.kind) {
        case 'linear':
            const particles = world.movement.particles.map(p => moveParticle(dt, world, p));
            const infected =  particles.map(p  => {
                return {
                    ...p,
                    health : derivedHeath(particles, world.time, p)
                }
            });

            world.movement = { kind : 'linear', particles : infected }
            break;
        case 'groups':
            world.movement.groups = world.movement.groups.map(g => moveGroup(dt, world, g));

            const allParticles = ([] as Particle[]).concat(...world.movement.groups.map(g => g.particles));

            world.movement.groups.forEach(g => {
                g.particles.forEach(p => {
                    p.health = derivedHeath(allParticles, world.time, p);
                })
            });

    }

    world.time += dt;
    
    return world;

}