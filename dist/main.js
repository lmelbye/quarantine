/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/chart.ts":
/*!**********************!*\
  !*** ./src/chart.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function assertNever(x) {
    throw new Error("Unexpected object: " + x);
}
var Chart = (function () {
    function Chart(canvas) {
        this.points = [];
        this.currentMax = 0;
        this.cured = document.getElementById('cured');
        this.healthy = document.getElementById('healthy');
        this.sick = document.getElementById('sick');
        this.total = document.getElementById('total');
        this.maxSick = document.getElementById('maxsick');
        var ctx = canvas.getContext("2d");
        if (ctx === null) {
            throw "Could not initialize canvas";
        }
        this.ctx = ctx;
        this.canvas = canvas;
    }
    Chart.prototype.clear = function () {
        this.points = [];
        this.currentMax = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Chart.prototype.push = function (w) {
        var _a;
        var allParticles;
        switch (w.movement.kind) {
            case 'linear':
                allParticles = w.movement.particles;
                break;
            case 'groups':
                allParticles = (_a = []).concat.apply(_a, w.movement.groups.map(function (g) { return g.particles; }));
                break;
        }
        var sick = allParticles.filter(function (p) { return p.health.state == "sick"; }).length;
        var cured = allParticles.filter(function (p) { return p.health.state == "cured"; }).length;
        var healthy = allParticles.filter(function (p) { return p.health.state == "healthy"; }).length;
        this.points.push({
            sick: sick,
            cured: cured,
            healthy: healthy,
            time: w.time,
        });
        this.currentMax = Math.max(this.currentMax, sick);
        if (this.healthy && this.maxSick && this.cured && this.total && this.sick) {
            this.healthy.innerHTML = '' + healthy;
            this.cured.innerHTML = '' + cured;
            this.maxSick.innerHTML = '' + this.currentMax;
            this.sick.innerHTML = '' + sick;
            this.total.innerHTML = '' + allParticles.length;
        }
    };
    Chart.prototype.draw = function () {
        var _this = this;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#f00';
        this.ctx.beginPath();
        var x = 0;
        var y = this.canvas.height;
        this.ctx.moveTo(x, y);
        this.points.forEach(function (p) {
            y = _this.canvas.height - p.sick;
            x = p.time * 10;
            _this.ctx.lineTo(x, y);
        });
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.closePath();
        this.ctx.fill();
    };
    return Chart;
}());
exports.Chart = Chart;


/***/ }),

/***/ "./src/draw.ts":
/*!*********************!*\
  !*** ./src/draw.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Draw = (function () {
    function Draw(canvas) {
        var ctx = canvas.getContext("2d");
        if (ctx === null) {
            throw "Could not initialize canvas";
        }
        this.ctx = ctx;
        this.canvas = canvas;
    }
    Draw.prototype.particle = function (p) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color(p);
        this.ctx.fill();
    };
    Draw.prototype.color = function (p) {
        switch (p.health.state) {
            case "sick":
                return "#ff0000";
            case "cured":
                return "#ffff00";
            case "healthy":
                return "#00ff";
        }
    };
    Draw.prototype.world = function (w) {
        var _this = this;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        switch (w.movement.kind) {
            case 'linear':
                w.movement.particles.forEach(this.particle, this);
                return true;
            case 'groups':
                w.movement.groups.forEach(function (g) { return g.particles.forEach(_this.particle, _this); });
                return true;
        }
    };
    return Draw;
}());
exports.Draw = Draw;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var draw_1 = __webpack_require__(/*! ./draw */ "./src/draw.ts");
var simulation_1 = __webpack_require__(/*! ./simulation */ "./src/simulation.ts");
var chart_1 = __webpack_require__(/*! ./chart */ "./src/chart.ts");
function assertNever(x) {
    throw new Error("Unexpected object: " + x);
}
exports.cureTime = 10;
exports.count = 300;
exports.particleRadius = 2;
exports.particleSpeed = 80;
exports.groupSpeed = 50;
exports.groupDistance = -1;
exports.groupParticleSpeed = 30;
exports.length = 60;
window.onload = function () {
    var worldCanvas = document.getElementById("world");
    var chartCanvas = document.getElementById("chart");
    if (worldCanvas == null || chartCanvas == null) {
        throw "Canvas not found";
    }
    var chart = new chart_1.Chart(chartCanvas);
    var draw = new draw_1.Draw(worldCanvas);
    var world;
    var select = document.getElementById("movement");
    if (!select) {
        throw "Select not found";
    }
    start(select.value);
    select.addEventListener('change', function (event) {
        start(event.currentTarget.value);
    });
    function start(setting) {
        switch (setting) {
            case 'all':
                world = bounceWorld(worldCanvas.width, worldCanvas.height, exports.count);
                break;
            case 'p50':
                world = bounceWorld(worldCanvas.width, worldCanvas.height, exports.count * 0.5);
                break;
            case 'p10':
                world = bounceWorld(worldCanvas.width, worldCanvas.height, exports.count * 0.1);
                break;
            case 'p5':
                world = bounceWorld(worldCanvas.width, worldCanvas.height, exports.count * 0.05);
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
    var dt = 1 / 60.0;
    var stepSim = function (dt) {
        world = simulation_1.step(world, dt);
        draw.world(world);
        chart.push(world);
        chart.draw();
    };
    var intervalTimer;
    var play = function () {
        start(select.value);
        if (intervalTimer) {
            clearInterval(intervalTimer);
        }
        intervalTimer = setInterval(function () {
            stepSim(dt);
            if (world.time > exports.length) {
                clearInterval(intervalTimer);
            }
        }, dt * 1000);
    };
    window.stepSim = stepSim;
    window.play = play;
};
function bounceWorld(width, height, moving) {
    var particles = [];
    for (var i = 0; i < exports.count; i++) {
        var speedx = 0;
        var speedy = 0;
        if (i < moving) {
            var dir = randomUnitVector();
            speedx = dir.x * exports.particleSpeed;
            speedy = dir.y * exports.particleSpeed;
            ;
        }
        var x = Math.random() * (width - exports.particleRadius * 2) + exports.particleRadius;
        var y = Math.random() * (height - exports.particleRadius * 2) + exports.particleRadius;
        particles.push({
            size: exports.particleRadius,
            speedx: speedx,
            speedy: speedy,
            x: x,
            y: y,
            health: i % 100 == 0 ? { state: "sick", time: 0 } : { state: "healthy" }
        });
    }
    return {
        movement: { kind: 'linear', particles: particles },
        height: height, width: width,
        time: 0,
    };
}
function randomUnitVector() {
    var x = Math.random() * 2 - 1;
    var y = Math.random() * 2 - 1;
    var norm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return { x: x / norm, y: y / norm };
}
function groupWorld(width, height, groupSize, radius) {
    var ps = [];
    var nGroups = exports.count / groupSize;
    var groups = [];
    var _loop_1 = function (g) {
        var dir = randomUnitVector();
        var speedx = dir.x * exports.groupSpeed;
        var speedy = dir.y * exports.groupSpeed;
        var centerx, centery;
        var closeToGroup = void 0;
        var retry = 0;
        do {
            centerx = Math.random() * (width - radius * 2) + radius;
            centery = Math.random() * (height - radius * 2) + radius;
            closeToGroup = groups.some(function (g) {
                return Math.sqrt(Math.pow((g.centerx - centerx), 2) + Math.pow((g.centery - centery), 2)) < radius * 2 + exports.groupDistance;
            });
            retry++;
            if (retry > 50) {
                throw 'Could not generate groups';
            }
        } while (closeToGroup);
        var group = {
            centerx: centerx,
            centery: centery,
            speedx: speedx,
            speedy: speedy,
            radius: radius,
            particles: [],
        };
        for (var i = 0; i < groupSize; i++) {
            var x = Math.random() * radius * 2 - radius + centerx;
            var y = Math.random() * radius * 2 - radius + centery;
            var dir_1 = randomUnitVector();
            var speedx_1 = dir_1.x * exports.groupParticleSpeed;
            var speedy_1 = dir_1.y * exports.groupParticleSpeed;
            group.particles.push({
                size: exports.particleRadius,
                speedx: speedx_1,
                speedy: speedy_1,
                x: x,
                y: y,
                health: ((g + 1) * groupSize + i) % 100 == 0 ? { state: "sick", time: 0 } : { state: "healthy" }
            });
        }
        groups.push(group);
    };
    for (var g = 0; g < nGroups; g++) {
        _loop_1(g);
    }
    return {
        movement: { kind: 'groups', groups: groups },
        height: height, width: width,
        time: 0,
    };
}


/***/ }),

/***/ "./src/simulation.ts":
/*!***************************!*\
  !*** ./src/simulation.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __webpack_require__(/*! . */ "./src/index.ts");
function moveParticle(dt, w, p) {
    var x1 = p.x + p.speedx * dt;
    var y1 = p.y + p.speedy * dt;
    var speedx1 = x1 + p.size > w.width || x1 < 0 ? -1 * p.speedx : p.speedx;
    var speedy1 = y1 + p.size > w.height || y1 < 0 ? -1 * p.speedy : p.speedy;
    return __assign(__assign({}, p), { speedx: speedx1, speedy: speedy1, x: x1, y: y1 });
}
function collids(p1, p2) {
    var a = p1.size + p2.size;
    var x = p1.x - p2.x;
    var y = p1.y - p2.y;
    return a > Math.sqrt((x * x) + (y * y));
}
function derivedHeath(particles, worldtime, p) {
    switch (p.health.state) {
        case "healthy":
            var getsSicks = particles.some(function (p1) { return p1 != p && p1.health.state == "sick" && collids(p, p1); });
            if (getsSicks)
                return {
                    state: "sick",
                    time: worldtime,
                };
            return p.health;
        case "sick":
            if (worldtime > p.health.time + _1.cureTime)
                return { state: "cured" };
            return p.health;
        case "cured":
            return p.health;
    }
}
function dist(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}
function closeToSomeGroup(w, g, centerx, centery) {
    if (w.movement.kind == 'linear')
        throw 'error';
    return w.movement.groups.filter(function (g1) { return g !== g1; }).find(function (g) {
        return dist(g.centerx, centerx, g.centery, centery) < g.radius * 2 + _1.groupDistance;
    });
}
function moveGroup(dt, world, g) {
    if (world.movement.kind == 'linear')
        throw 'must be group';
    var dx;
    var dy;
    var centerx;
    var centery;
    var retry = 0;
    var closeTo;
    var outSideX, outSideY;
    var infected = false;
    do {
        dx = g.speedx * dt;
        dy = g.speedy * dt;
        centerx = g.centerx + dx;
        centery = g.centery + dy;
        closeTo = closeToSomeGroup(world, g, centerx, centery);
        outSideX = centerx + g.radius > world.width || centerx - g.radius < 0;
        outSideY = centery + g.radius > world.height || centery - g.radius < 0;
        if (closeTo) {
            g.speedx *= -1;
            g.speedy *= -1;
        }
        else {
            if (outSideX)
                g.speedx *= -1;
            if (outSideY) {
                g.speedy *= -1;
            }
        }
        retry++;
    } while (retry < 20 && (closeTo || outSideX || outSideY));
    g.centerx = centerx;
    g.centery = centery;
    g.centerx = Math.max(g.radius, g.centerx);
    g.centerx = Math.min(world.width - g.radius, g.centerx);
    g.centery = Math.max(g.radius, g.centery);
    g.centery = Math.min(world.height - g.radius, g.centery);
    g.particles.map(function (p) {
        p.x += dx;
        p.y += dy;
        return p;
    }).forEach(function (p) {
        p.x = p.x + p.speedx * dt;
        p.y = p.y + p.speedy * dt;
        var distanceFromCenter = dist(p.x, g.centerx, p.y, g.centery);
        if (distanceFromCenter > g.radius) {
            var dx_1 = p.x - g.centerx;
            var dy_1 = p.y - g.centery;
            var normalMagnitude = distanceFromCenter;
            var normalX = dx_1 / normalMagnitude;
            var normalY = dy_1 / normalMagnitude;
            var tangentX = -normalY;
            var tangentY = normalX;
            var normalSpeed = -(normalX * p.speedx + normalY * p.speedy);
            var tangentSpeed = tangentX * p.speedx + tangentY * p.speedy;
            p.speedx = normalSpeed * normalX + tangentSpeed * tangentX;
            p.speedy = normalSpeed * normalY + tangentSpeed * tangentY;
        }
    });
    return g;
    1;
}
function step(world, dt) {
    var _a;
    switch (world.movement.kind) {
        case 'linear':
            var particles_1 = world.movement.particles.map(function (p) { return moveParticle(dt, world, p); });
            var infected = particles_1.map(function (p) {
                return __assign(__assign({}, p), { health: derivedHeath(particles_1, world.time, p) });
            });
            world.movement = { kind: 'linear', particles: infected };
            break;
        case 'groups':
            world.movement.groups = world.movement.groups.map(function (g) { return moveGroup(dt, world, g); });
            var allParticles_1 = (_a = []).concat.apply(_a, world.movement.groups.map(function (g) { return g.particles; }));
            world.movement.groups.forEach(function (g) {
                g.particles.forEach(function (p) {
                    p.health = derivedHeath(allParticles_1, world.time, p);
                });
            });
    }
    world.time += dt;
    return world;
}
exports.step = step;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NoYXJ0LnRzIiwid2VicGFjazovLy8uL3NyYy9kcmF3LnRzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2ltdWxhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNoRkEsU0FBUyxXQUFXLENBQUMsQ0FBUTtJQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFTRDtJQWFJLGVBQVksTUFBMEI7UUFWdEMsV0FBTSxHQUFpQixFQUFFLENBQUM7UUFFMUIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUVmLFVBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFD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LENBQUMsQ0FBQztZQUVoRixJQUFNLGNBQVksR0FBRyxNQUFDLEVBQWlCLEVBQUMsTUFBTSxXQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFDLElBQUksUUFBQyxDQUFDLFNBQVMsRUFBWCxDQUFXLENBQUMsQ0FBQyxDQUFDO1lBRS9GLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFDO2dCQUMzQixDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFDO29CQUNqQixDQUFDLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxjQUFZLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDekQsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUM7S0FFVjtJQUVELEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0lBRWpCLE9BQU8sS0FBSyxDQUFDO0FBRWpCLENBQUM7QUFoQ0Qsb0JBZ0NDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCB7IFdvcmxkLCBQYXJ0aWNsZSB9IGZyb20gXCIuL3NpbXVsYXRpb25cIjtcblxuZnVuY3Rpb24gYXNzZXJ0TmV2ZXIoeDogbmV2ZXIpOiBuZXZlciB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBvYmplY3Q6IFwiICsgeCk7XG59XG5cbmludGVyZmFjZSBEYXRhUG9pbnQge1xuICAgIHNpY2sgOiBudW1iZXI7XG4gICAgY3VyZWQgOiBudW1iZXI7XG4gICAgaGVhbHRoeSA6IG51bWJlcjtcbiAgICB0aW1lIDogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgQ2hhcnQge1xuICAgIGN0eCA6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjYW52YXMgOiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBwb2ludHMgOiBEYXRhUG9pbnRbXSA9IFtdOyBcblxuICAgIGN1cnJlbnRNYXggPSAwO1xuXG4gICAgY3VyZWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VyZWQnKTtcbiAgICBoZWFsdGh5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWx0aHknKTtcbiAgICBzaWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpY2snKTtcbiAgICB0b3RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b3RhbCcpO1xuICAgIG1heFNpY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWF4c2ljaycpO1xuXG4gICAgY29uc3RydWN0b3IoY2FudmFzIDogSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgaWYgKGN0eCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgXCJDb3VsZCBub3QgaW5pdGlhbGl6ZSBjYW52YXNcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMucG9pbnRzID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudE1heCA9IDA7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBwdXNoKHcgOiBXb3JsZCkge1xuICAgICAgICBsZXQgYWxsUGFydGljbGVzO1xuICAgICAgICBzd2l0Y2ggKHcubW92ZW1lbnQua2luZCkge1xuICAgICAgICAgICAgY2FzZSAnbGluZWFyJzpcbiAgICAgICAgICAgICAgICBhbGxQYXJ0aWNsZXMgPSB3Lm1vdmVtZW50LnBhcnRpY2xlc1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZ3JvdXBzJzpcbiAgICAgICAgICAgICAgICBhbGxQYXJ0aWNsZXMgPSAoW10gYXMgUGFydGljbGVbXSkuY29uY2F0KC4uLncubW92ZW1lbnQuZ3JvdXBzLm1hcChnID0+IGcucGFydGljbGVzKSk7IFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2ljayA9IGFsbFBhcnRpY2xlcy5maWx0ZXIocCA9PiBwLmhlYWx0aC5zdGF0ZSA9PSBcInNpY2tcIikubGVuZ3RoO1xuICAgICAgICBjb25zdCBjdXJlZCA9IGFsbFBhcnRpY2xlcy5maWx0ZXIocCA9PiBwLmhlYWx0aC5zdGF0ZSA9PSBcImN1cmVkXCIpLmxlbmd0aDtcbiAgICAgICAgY29uc3QgaGVhbHRoeSA9IGFsbFBhcnRpY2xlcy5maWx0ZXIocCA9PiBwLmhlYWx0aC5zdGF0ZSA9PSBcImhlYWx0aHlcIikubGVuZ3RoO1xuXG4gICAgICAgIHRoaXMucG9pbnRzLnB1c2goe1xuICAgICAgICAgICAgc2ljayxcbiAgICAgICAgICAgIGN1cmVkLFxuICAgICAgICAgICAgaGVhbHRoeSxcbiAgICAgICAgICAgIHRpbWUgOiB3LnRpbWUsXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5jdXJyZW50TWF4ID0gTWF0aC5tYXgodGhpcy5jdXJyZW50TWF4LCBzaWNrKTtcblxuICAgICAgICBpZiAodGhpcy5oZWFsdGh5ICYmIHRoaXMubWF4U2ljayAmJiB0aGlzLmN1cmVkICYmIHRoaXMudG90YWwgJiYgdGhpcy5zaWNrKSB7XG4gICAgICAgICAgICB0aGlzLmhlYWx0aHkuaW5uZXJIVE1MID0gJycraGVhbHRoeTtcbiAgICAgICAgICAgIHRoaXMuY3VyZWQuaW5uZXJIVE1MID0gJycrY3VyZWQ7XG4gICAgICAgICAgICB0aGlzLm1heFNpY2suaW5uZXJIVE1MID0gJycrdGhpcy5jdXJyZW50TWF4O1xuICAgICAgICAgICAgdGhpcy5zaWNrLmlubmVySFRNTCA9ICcnK3NpY2s7XG4gICAgICAgICAgICB0aGlzLnRvdGFsLmlubmVySFRNTCA9ICcnK2FsbFBhcnRpY2xlcy5sZW5ndGhcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRyYXcoKSB7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJyNmMDAnO1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgbGV0IHggPSAwO1xuICAgICAgICBsZXQgeSA9IHRoaXMuY2FudmFzLmhlaWdodDtcbiAgICAgICAgdGhpcy5jdHgubW92ZVRvKHgsIHkpO1xuXG4gICAgICAgIHRoaXMucG9pbnRzLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB5ID0gdGhpcy5jYW52YXMuaGVpZ2h0LXAuc2ljaztcbiAgICAgICAgICAgIHggPSBwLnRpbWUqMTA7XG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8oeCx5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY3R4LmxpbmVUbyh4LHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgfVxuXG4gICAgXG59XG4iLCJpbXBvcnQgeyBXb3JsZCwgUGFydGljbGUgfSBmcm9tIFwiLi9zaW11bGF0aW9uXCI7XG5cblxuXG5leHBvcnQgY2xhc3MgRHJhdyB7XG4gICAgY3R4IDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIGNhbnZhcyA6IEhUTUxDYW52YXNFbGVtZW50O1xuICAgIGNvbnN0cnVjdG9yKGNhbnZhcyA6IEhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIGlmIChjdHggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFwiQ291bGQgbm90IGluaXRpYWxpemUgY2FudmFzXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHggPSBjdHg7XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgIH1cblxuICAgIHBhcnRpY2xlKHAgOiBQYXJ0aWNsZSkge1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jdHguYXJjKHAueCwgcC55LCBwLnNpemUsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcihwKTtcbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgIH1cblxuICAgIGNvbG9yKHAgOiBQYXJ0aWNsZSkgOiBzdHJpbmcge1xuICAgICAgICBzd2l0Y2ggKHAuaGVhbHRoLnN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFwic2lja1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIiNmZjAwMDBcIjtcbiAgICAgICAgICAgIGNhc2UgXCJjdXJlZFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIiNmZmZmMDBcIjtcbiAgICAgICAgICAgIGNhc2UgXCJoZWFsdGh5XCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiIzAwZmZcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdvcmxkKHcgOiBXb3JsZCkgOiBib29sZWFuICB7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgc3dpdGNoICh3Lm1vdmVtZW50LmtpbmQpIHtcbiAgICAgICAgICAgIGNhc2UgJ2xpbmVhcic6XG4gICAgICAgICAgICAgICAgdy5tb3ZlbWVudC5wYXJ0aWNsZXMuZm9yRWFjaCh0aGlzLnBhcnRpY2xlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGNhc2UgJ2dyb3Vwcyc6XG4gICAgICAgICAgICAgICAgdy5tb3ZlbWVudC5ncm91cHMuZm9yRWFjaChnID0+IGcucGFydGljbGVzLmZvckVhY2godGhpcy5wYXJ0aWNsZSwgdGhpcykpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRHJhdyB9IGZyb20gXCIuL2RyYXdcIjtcbmltcG9ydCB7IFdvcmxkLCBzdGVwLCBQYXJ0aWNsZSwgUGFydGljbGVHcm91cCB9IGZyb20gXCIuL3NpbXVsYXRpb25cIjtcbmltcG9ydCB7IENoYXJ0IH0gZnJvbSBcIi4vY2hhcnRcIjtcblxuZnVuY3Rpb24gYXNzZXJ0TmV2ZXIoeDogbmV2ZXIpOiBuZXZlciB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBvYmplY3Q6IFwiICsgeCk7XG59XG5cbmV4cG9ydCBjb25zdCBjdXJlVGltZSA9IDEwO1xuZXhwb3J0IGNvbnN0IGNvdW50ID0gMzAwXG5leHBvcnQgY29uc3QgcGFydGljbGVSYWRpdXMgPSAyO1xuZXhwb3J0IGNvbnN0IHBhcnRpY2xlU3BlZWQgPSA4MDtcbmV4cG9ydCBjb25zdCBncm91cFNwZWVkID0gNTA7XG5leHBvcnQgY29uc3QgZ3JvdXBEaXN0YW5jZSA9IC0xO1xuZXhwb3J0IGNvbnN0IGdyb3VwUGFydGljbGVTcGVlZCA9IDMwO1xuZXhwb3J0IGNvbnN0IGxlbmd0aCA9IDYwO1xuXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xuICAgIGNvbnN0IHdvcmxkQ2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndvcmxkXCIpO1xuICAgIGNvbnN0IGNoYXJ0Q2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXJ0XCIpO1xuXG4gICAgaWYgKHdvcmxkQ2FudmFzID09IG51bGwgfHwgY2hhcnRDYW52YXMgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBcIkNhbnZhcyBub3QgZm91bmRcIjtcbiAgICB9XG5cbiAgICBjb25zdCBjaGFydCA9IG5ldyBDaGFydChjaGFydENhbnZhcyk7XG4gICAgY29uc3QgZHJhdyA9IG5ldyBEcmF3KHdvcmxkQ2FudmFzKTtcbiAgICBsZXQgd29ybGQgOiBXb3JsZDtcblxuICAgIGNvbnN0IHNlbGVjdCA9IDxIVE1MU2VsZWN0RWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb3ZlbWVudFwiKVxuICAgIGlmICghc2VsZWN0KSB7XG4gICAgICAgIHRocm93IFwiU2VsZWN0IG5vdCBmb3VuZFwiO1xuICAgIH1cblxuICAgIHN0YXJ0KHNlbGVjdC52YWx1ZSk7XG5cbiAgICBzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgc3RhcnQoZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzdGFydChzZXR0aW5nIDogc3RyaW5nKSB7XG4gICAgICAgIHN3aXRjaCAoc2V0dGluZykge1xuICAgICAgICAgICAgY2FzZSAnYWxsJzpcbiAgICAgICAgICAgICAgICB3b3JsZCA9IGJvdW5jZVdvcmxkKHdvcmxkQ2FudmFzLndpZHRoLCB3b3JsZENhbnZhcy5oZWlnaHQsIGNvdW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3A1MCc6XG4gICAgICAgICAgICAgICAgd29ybGQgPSBib3VuY2VXb3JsZCh3b3JsZENhbnZhcy53aWR0aCwgd29ybGRDYW52YXMuaGVpZ2h0LCBjb3VudCowLjUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncDEwJzpcbiAgICAgICAgICAgICAgICB3b3JsZCA9IGJvdW5jZVdvcmxkKHdvcmxkQ2FudmFzLndpZHRoLCB3b3JsZENhbnZhcy5oZWlnaHQsIGNvdW50KjAuMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdwNSc6XG4gICAgICAgICAgICAgICAgd29ybGQgPSBib3VuY2VXb3JsZCh3b3JsZENhbnZhcy53aWR0aCwgd29ybGRDYW52YXMuaGVpZ2h0LCBjb3VudCowLjA1KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2cxMCc6XG4gICAgICAgICAgICAgICAgd29ybGQgPSBncm91cFdvcmxkKHdvcmxkQ2FudmFzLndpZHRoLCB3b3JsZENhbnZhcy5oZWlnaHQsIDEwLCAxNyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdnNSc6XG4gICAgICAgICAgICAgICAgd29ybGQgPSBncm91cFdvcmxkKHdvcmxkQ2FudmFzLndpZHRoLCB3b3JsZENhbnZhcy5oZWlnaHQsIDUsIDgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZzInOlxuICAgICAgICAgICAgICAgIHdvcmxkID0gZ3JvdXBXb3JsZCh3b3JsZENhbnZhcy53aWR0aCwgd29ybGRDYW52YXMuaGVpZ2h0LCAyLCA2KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG4gICAgICAgIGNoYXJ0LmNsZWFyKCk7XG4gICAgICAgIGRyYXcud29ybGQod29ybGQpO1xuICAgICAgICBjaGFydC5wdXNoKHdvcmxkKTtcbiAgICAgICAgY2hhcnQuZHJhdygpO1xuICAgIH1cblxuICAgIGNvbnN0IGR0ID0gMS82MC4wO1xuXG4gICAgY29uc3Qgc3RlcFNpbSA9IChkdCA6IG51bWJlcikgPT4ge1xuICAgICAgICB3b3JsZCA9IHN0ZXAod29ybGQsIGR0KTtcbiAgICAgICAgZHJhdy53b3JsZCh3b3JsZCk7XG4gICAgICAgIGNoYXJ0LnB1c2god29ybGQpO1xuICAgICAgICBjaGFydC5kcmF3KCk7XG4gICAgfVxuICAgIGxldCBpbnRlcnZhbFRpbWVyIDogTm9kZUpTLlRpbWVvdXQ7XG4gICAgY29uc3QgcGxheSA9ICgpID0+IHtcbiAgICAgICAgc3RhcnQoc2VsZWN0LnZhbHVlKTtcbiAgICAgICAgaWYgKGludGVydmFsVGltZXIpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxUaW1lcilcbiAgICAgICAgfVxuXG4gICAgICAgIGludGVydmFsVGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBzdGVwU2ltKGR0KTtcbiAgICAgICAgICAgIGlmICh3b3JsZC50aW1lID4gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbFRpbWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZHQqMTAwMCk7XG4gICAgfVxuXG4gICAgKDxhbnk+d2luZG93KS5zdGVwU2ltID0gc3RlcFNpbTtcbiAgICAoPGFueT53aW5kb3cpLnBsYXkgPSBwbGF5O1xuXG59XG5cbmZ1bmN0aW9uIGJvdW5jZVdvcmxkKHdpZHRoIDogbnVtYmVyLCBoZWlnaHQgOiBudW1iZXIsIG1vdmluZyA6IG51bWJlcikgOiBXb3JsZCB7XG4gICAgbGV0IHBhcnRpY2xlcyA6IFBhcnRpY2xlW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgbGV0IHNwZWVkeCA9IDBcbiAgICAgICAgbGV0IHNwZWVkeSA9IDBcbiAgICAgICAgaWYgKGkgPCBtb3ZpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IHJhbmRvbVVuaXRWZWN0b3IoKTtcbiAgICAgICAgICAgIHNwZWVkeCA9IGRpci54KnBhcnRpY2xlU3BlZWQ7XG4gICAgICAgICAgICBzcGVlZHkgPSBkaXIueSpwYXJ0aWNsZVNwZWVkOztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHggPSBNYXRoLnJhbmRvbSgpICogKHdpZHRoIC0gcGFydGljbGVSYWRpdXMqMikgKyBwYXJ0aWNsZVJhZGl1cztcbiAgICAgICAgY29uc3QgeSA9IE1hdGgucmFuZG9tKCkgKiAoaGVpZ2h0IC0gcGFydGljbGVSYWRpdXMqMikgKyBwYXJ0aWNsZVJhZGl1cztcblxuICAgICAgICBwYXJ0aWNsZXMucHVzaCh7XG4gICAgICAgICAgICBzaXplIDogcGFydGljbGVSYWRpdXMsXG4gICAgICAgICAgICBzcGVlZHgsXG4gICAgICAgICAgICBzcGVlZHksXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIGhlYWx0aCA6IGkgJSAxMDAgPT0gMCA/IHsgc3RhdGUgOiBcInNpY2tcIiwgdGltZSA6IDAgfSA6IHsgc3RhdGUgOiBcImhlYWx0aHlcIiB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbW92ZW1lbnQgOiB7IGtpbmQgOiAnbGluZWFyJywgcGFydGljbGVzIH0sXG4gICAgICAgIGhlaWdodCwgd2lkdGgsXG4gICAgICAgIHRpbWUgOiAwLFxuICAgIH1cbn1cblxuXG5cbmZ1bmN0aW9uIHJhbmRvbVVuaXRWZWN0b3IoKSB7XG4gICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkqMi0xO1xuICAgIGNvbnN0IHkgPSBNYXRoLnJhbmRvbSgpKjItMTtcblxuICAgIGNvbnN0IG5vcm0gPSBNYXRoLnNxcnQoeCoqMiArIHkqKjIpO1xuXG4gICAgcmV0dXJuIHsgeDogeC9ub3JtLCB5IDogeS9ub3JtIH07XG59XG5cbmZ1bmN0aW9uIGdyb3VwV29ybGQod2lkdGggOiBudW1iZXIsIGhlaWdodCA6IG51bWJlciwgZ3JvdXBTaXplIDogbnVtYmVyLCByYWRpdXMgOiBudW1iZXIpIDogV29ybGQge1xuICAgIGxldCBwcyA6IFBhcnRpY2xlW10gPSBbXTtcblxuICAgIGNvbnN0IG5Hcm91cHMgPSBjb3VudC9ncm91cFNpemU7XG5cbiAgICBjb25zdCBncm91cHMgOiBQYXJ0aWNsZUdyb3VwW10gPSBbXTtcblxuXG4gICAgZm9yIChsZXQgZyA9IDA7IGcgPCBuR3JvdXBzOyBnKyspIHtcbiAgICAgICAgY29uc3QgZGlyID0gcmFuZG9tVW5pdFZlY3RvcigpO1xuICAgICAgICBjb25zdCBzcGVlZHggPSBkaXIueCpncm91cFNwZWVkO1xuICAgICAgICBjb25zdCBzcGVlZHkgPSBkaXIueSpncm91cFNwZWVkO1xuXG4gICAgICAgIGxldCBjZW50ZXJ4IDogbnVtYmVyLCBjZW50ZXJ5IDogbnVtYmVyO1xuICAgICAgICBsZXQgY2xvc2VUb0dyb3VwO1xuICAgICAgICBsZXQgcmV0cnkgPSAwO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjZW50ZXJ4ID0gTWF0aC5yYW5kb20oKSAqICh3aWR0aCAtIHJhZGl1cyoyKSArIHJhZGl1cztcbiAgICAgICAgICAgIGNlbnRlcnkgPSBNYXRoLnJhbmRvbSgpICogKGhlaWdodCAtIHJhZGl1cyoyKSArIHJhZGl1cztcblxuICAgICAgICAgICAgY2xvc2VUb0dyb3VwID0gZ3JvdXBzLnNvbWUoZyAgPT5cbiAgICAgICAgICAgICAgICBNYXRoLnNxcnQoKGcuY2VudGVyeCAtIGNlbnRlcngpKioyICsgKGcuY2VudGVyeSAtIGNlbnRlcnkpKioyKSA8IHJhZGl1cyoyICsgZ3JvdXBEaXN0YW5jZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHJ5KytcblxuICAgICAgICAgICAgaWYgKHJldHJ5ID4gNTApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnQ291bGQgbm90IGdlbmVyYXRlIGdyb3Vwcyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKGNsb3NlVG9Hcm91cClcblxuICAgICAgICBjb25zdCBncm91cCA6IFBhcnRpY2xlR3JvdXAgPSB7XG4gICAgICAgICAgICBjZW50ZXJ4LFxuICAgICAgICAgICAgY2VudGVyeSxcbiAgICAgICAgICAgIHNwZWVkeCxcbiAgICAgICAgICAgIHNwZWVkeSxcbiAgICAgICAgICAgIHJhZGl1cyxcbiAgICAgICAgICAgIHBhcnRpY2xlcyA6IFtdLFxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cFNpemU7IGkrKykge1xuXG4gICAgICAgICAgICBsZXQgeCA9IE1hdGgucmFuZG9tKCkqcmFkaXVzKjItcmFkaXVzICsgY2VudGVyeFxuICAgICAgICAgICAgbGV0IHkgPSBNYXRoLnJhbmRvbSgpKnJhZGl1cyoyLXJhZGl1cyArIGNlbnRlcnlcblxuICAgICAgICAgICAgY29uc3QgZGlyID0gcmFuZG9tVW5pdFZlY3RvcigpO1xuXG4gICAgICAgICAgICBjb25zdCBzcGVlZHggPSBkaXIueCpncm91cFBhcnRpY2xlU3BlZWQ7XG4gICAgICAgICAgICBjb25zdCBzcGVlZHkgPSBkaXIueSpncm91cFBhcnRpY2xlU3BlZWQ7XG5cbiAgICAgICAgICAgIGdyb3VwLnBhcnRpY2xlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBzaXplIDogcGFydGljbGVSYWRpdXMsXG4gICAgICAgICAgICAgICAgc3BlZWR4LFxuICAgICAgICAgICAgICAgIHNwZWVkeSxcbiAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgaGVhbHRoIDogKChnKzEpKmdyb3VwU2l6ZStpKSAlIDEwMCA9PSAwID8geyBzdGF0ZSA6IFwic2lja1wiLCB0aW1lIDogMCB9IDogeyBzdGF0ZSA6IFwiaGVhbHRoeVwiIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZ3JvdXBzLnB1c2goZ3JvdXApO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBtb3ZlbWVudCA6IHsga2luZCA6ICdncm91cHMnLCBncm91cHMgfSxcbiAgICAgICAgaGVpZ2h0LCB3aWR0aCxcbiAgICAgICAgdGltZSA6IDAsXG4gICAgfVxufVxuXG4iLCJpbXBvcnQgeyBjdXJlVGltZSwgIGdyb3VwRGlzdGFuY2UgfSBmcm9tIFwiLlwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnRpY2xlIHtcbiAgICB4IDogbnVtYmVyXG4gICAgeSA6IG51bWJlclxuICAgIHNwZWVkeCA6IG51bWJlclxuICAgIHNwZWVkeSA6IG51bWJlclxuICAgIGhlYWx0aCA6IGhlYWx0aFxuICAgIHNpemUgOiBudW1iZXJcbn1cblxudHlwZSBoZWFsdGggPVxuICAgIHsgc3RhdGUgOiBcImhlYWx0aHlcIiB9IHxcbiAgICB7IHN0YXRlIDogXCJzaWNrXCIsIHRpbWUgOiBudW1iZXIgfSB8XG4gICAgeyBzdGF0ZSA6IFwiY3VyZWRcIiB9XG5cbmV4cG9ydCBpbnRlcmZhY2UgV29ybGQge1xuICAgIG1vdmVtZW50IDogTW92ZW1lbnRcbiAgICB3aWR0aCA6IG51bWJlclxuICAgIGhlaWdodCA6IG51bWJlclxuICAgIHRpbWUgOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXJ0aWNsZUdyb3VwIHtcbiAgICBjZW50ZXJ4IDogbnVtYmVyLFxuICAgIGNlbnRlcnkgOiBudW1iZXIsXG4gICAgc3BlZWR4IDogbnVtYmVyLFxuICAgIHNwZWVkeSA6IG51bWJlcixcbiAgICByYWRpdXMgOiBudW1iZXIsXG4gICAgcGFydGljbGVzIDogUGFydGljbGVbXSxcbn1cblxuXG50eXBlIE1vdmVtZW50ID0gXG57IGtpbmQgOiAnbGluZWFyJywgcGFydGljbGVzIDogUGFydGljbGVbXSB9IHxcbnsga2luZCA6ICdncm91cHMnLCBncm91cHMgOiBQYXJ0aWNsZUdyb3VwW10gfVxuXG5mdW5jdGlvbiBtb3ZlUGFydGljbGUoZHQgOiBudW1iZXIsIHcgOiBXb3JsZCwgcCA6IFBhcnRpY2xlKSA6IFBhcnRpY2xlIHtcblxuICAgIGxldCB4MSA9IHAueCArIHAuc3BlZWR4KmR0O1xuICAgIGxldCB5MSA9IHAueSArIHAuc3BlZWR5KmR0O1xuXG4gICAgLyogYm91bmNlICovXG4gICAgY29uc3Qgc3BlZWR4MSA9IHgxK3Auc2l6ZSA+IHcud2lkdGggfHwgeDEgPCAwID8gLTEqcC5zcGVlZHggOiBwLnNwZWVkeFxuICAgIGNvbnN0IHNwZWVkeTEgPSB5MStwLnNpemUgPiB3LmhlaWdodCB8fCB5MSA8IDAgPyAtMSpwLnNwZWVkeSA6IHAuc3BlZWR5XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5wLFxuICAgICAgICBzcGVlZHg6IHNwZWVkeDEsXG4gICAgICAgIHNwZWVkeTogc3BlZWR5MSxcbiAgICAgICAgeCA6IHgxLFxuICAgICAgICB5IDogeTEsXG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb2xsaWRzKHAxIDogUGFydGljbGUsIHAyIDogUGFydGljbGUpIDogYm9vbGVhbiB7XG4gICAgY29uc3QgYSA9IHAxLnNpemUrcDIuc2l6ZTtcbiAgICBjb25zdCB4ID0gcDEueCAtIHAyLng7XG4gICAgY29uc3QgeSA9IHAxLnkgLSBwMi55O1xuICAgIHJldHVybiBhID4gTWF0aC5zcXJ0KCh4ICogeCkgKyAoeSAqIHkpKTtcbn1cblxuZnVuY3Rpb24gZGVyaXZlZEhlYXRoKHBhcnRpY2xlcyA6IFBhcnRpY2xlW10sIHdvcmxkdGltZSA6IG51bWJlciwgcCA6IFBhcnRpY2xlKSA6IGhlYWx0aCB7XG4gICAgc3dpdGNoIChwLmhlYWx0aC5zdGF0ZSkge1xuICAgICAgICBjYXNlIFwiaGVhbHRoeVwiOlxuICAgICAgICAgICAgY29uc3QgZ2V0c1NpY2tzID0gcGFydGljbGVzLnNvbWUocDEgPT4gcDEgIT0gcCAmJiBwMS5oZWFsdGguc3RhdGUgPT1cInNpY2tcIiAmJiBjb2xsaWRzKHAsIHAxKSk7XG4gICAgICAgICAgICBpZiAoZ2V0c1NpY2tzKSBcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZSA6IFwic2lja1wiLFxuICAgICAgICAgICAgICAgICAgICB0aW1lIDogd29ybGR0aW1lLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwLmhlYWx0aFxuICAgICAgICBjYXNlIFwic2lja1wiOlxuICAgICAgICAgICAgaWYgKHdvcmxkdGltZSA+IHAuaGVhbHRoLnRpbWUgKyBjdXJlVGltZSlcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF0ZSA6IFwiY3VyZWRcIiB9O1xuICAgICAgICAgICAgcmV0dXJuIHAuaGVhbHRoXG4gICAgICAgIGNhc2UgXCJjdXJlZFwiOlxuICAgICAgICAgICAgcmV0dXJuIHAuaGVhbHRoXG4gICAgfSBcbn1cblxuZnVuY3Rpb24gZGlzdCh4MSA6IG51bWJlciwgeDIgOiBudW1iZXIsIHkxIDogbnVtYmVyLCB5MiA6IG51bWJlcikge1xuICAgIHJldHVybiBNYXRoLnNxcnQoKHgxIC0geDIpKioyICsgKHkxIC0geTIpKioyKVxufVxuXG5mdW5jdGlvbiBjbG9zZVRvU29tZUdyb3VwKHcgOiBXb3JsZCwgZyA6IFBhcnRpY2xlR3JvdXAsIGNlbnRlcnggOiBudW1iZXIsIGNlbnRlcnkgOiBudW1iZXIpIDogUGFydGljbGVHcm91cCB8IHVuZGVmaW5lZCB7XG5cbiAgICBpZiAody5tb3ZlbWVudC5raW5kID09ICdsaW5lYXInKSB0aHJvdyAnZXJyb3InO1xuXG4gICAgcmV0dXJuIHcubW92ZW1lbnQuZ3JvdXBzLmZpbHRlcihnMSA9PiBnICE9PSBnMSkuZmluZChnICA9PiBcbiAgICAgICAgZGlzdChnLmNlbnRlcngsIGNlbnRlcngsIGcuY2VudGVyeSwgY2VudGVyeSkgPCBnLnJhZGl1cyoyICsgZ3JvdXBEaXN0YW5jZVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIG1vdmVHcm91cChkdCA6IG51bWJlciwgd29ybGQgOiBXb3JsZCwgZyA6IFBhcnRpY2xlR3JvdXApIDogUGFydGljbGVHcm91cCB7XG5cbiAgICBpZiAod29ybGQubW92ZW1lbnQua2luZCA9PSAnbGluZWFyJylcbiAgICAgICAgdGhyb3cgJ211c3QgYmUgZ3JvdXAnO1xuXG5cbiAgICBsZXQgZHggOiBudW1iZXJcbiAgICBsZXQgZHkgOiBudW1iZXI7XG5cbiAgICBsZXQgY2VudGVyeCA6IG51bWJlclxuICAgIGxldCBjZW50ZXJ5IDogbnVtYmVyXG4gICAgbGV0IHJldHJ5ID0gMDtcbiAgICBsZXQgY2xvc2VUbztcbiAgICBsZXQgb3V0U2lkZVgsIG91dFNpZGVZO1xuICAgIGxldCBpbmZlY3RlZCA9IGZhbHNlO1xuICAgIGRvIHtcbiAgICAgICAgXG4gICAgICAgIGR4ID0gZy5zcGVlZHgqZHQ7XG4gICAgICAgIGR5ID0gZy5zcGVlZHkqZHQ7XG5cbiAgICAgICAgY2VudGVyeCA9IGcuY2VudGVyeCArIGR4O1xuICAgICAgICBjZW50ZXJ5ID0gZy5jZW50ZXJ5ICsgZHk7XG5cbiAgICAgICAgY2xvc2VUbyA9IGNsb3NlVG9Tb21lR3JvdXAod29ybGQsIGcsIGNlbnRlcngsIGNlbnRlcnkpO1xuXG4gICAgICAgIG91dFNpZGVYID0gY2VudGVyeCtnLnJhZGl1cyA+IHdvcmxkLndpZHRoIHx8IGNlbnRlcngtZy5yYWRpdXMgPCAwXG4gICAgICAgIG91dFNpZGVZID0gY2VudGVyeStnLnJhZGl1cyA+IHdvcmxkLmhlaWdodCB8fCBjZW50ZXJ5LWcucmFkaXVzIDwgMFxuXG4gICAgICAgIGlmIChjbG9zZVRvKSB7XG4gICAgICAgICAgICBnLnNwZWVkeCAqPSAtMTtcbiAgICAgICAgICAgIGcuc3BlZWR5ICo9IC0xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYob3V0U2lkZVgpIFxuICAgICAgICAgICAgICAgIGcuc3BlZWR4ICo9IC0xO1xuXG4gICAgICAgICAgICBpZiAob3V0U2lkZVkpIHtcbiAgICAgICAgICAgICAgICBnLnNwZWVkeSAqPSAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuXG4gICAgICAgIHJldHJ5Kys7XG4gICAgfSB3aGlsZSAocmV0cnkgPCAyMCAmJiAoY2xvc2VUbyB8fCBvdXRTaWRlWCB8fCBvdXRTaWRlWSkpXG5cbiAgICBnLmNlbnRlcnggPSBjZW50ZXJ4O1xuICAgIGcuY2VudGVyeSA9IGNlbnRlcnk7XG5cbiAgICBnLmNlbnRlcnggPSBNYXRoLm1heChnLnJhZGl1cywgZy5jZW50ZXJ4KTtcbiAgICBnLmNlbnRlcnggPSBNYXRoLm1pbih3b3JsZC53aWR0aC1nLnJhZGl1cywgZy5jZW50ZXJ4KTtcblxuICAgIGcuY2VudGVyeSA9IE1hdGgubWF4KGcucmFkaXVzLCBnLmNlbnRlcnkpO1xuICAgIGcuY2VudGVyeSA9IE1hdGgubWluKHdvcmxkLmhlaWdodC1nLnJhZGl1cywgZy5jZW50ZXJ5KTtcblxuXG4gICAgZy5wYXJ0aWNsZXMubWFwKHAgPT4ge1xuICAgICAgICAvKiBtb3ZlIHJlbGF0aXZlIHRvIGdyb3VwIGNlbnRlciAqL1xuICAgICAgICBwLnggKz0gZHg7XG4gICAgICAgIHAueSArPSBkeTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfSkuZm9yRWFjaChwID0+IHtcblxuICAgICAgICBwLnggPSAgcC54ICsgcC5zcGVlZHgqZHQ7XG4gICAgICAgIHAueSA9IHAueSArIHAuc3BlZWR5KmR0O1xuXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlRnJvbUNlbnRlciA9IGRpc3QocC54LCBnLmNlbnRlcngsIHAueSwgZy5jZW50ZXJ5KVxuXG4gICAgICAgIC8qIGJvdW5jZSBvbiBncm91cCBib3VuZGFyeSAqL1xuICAgICAgICBpZiAoZGlzdGFuY2VGcm9tQ2VudGVyID4gZy5yYWRpdXMpIHtcblxuICAgICAgICAgICAgLyogaHR0cHM6Ly9qc2ZpZGRsZS5uZXQvamFjcXVlc2Mvd2Q1YWExd3YvOS8gKi9cbiAgICAgICAgICAgIGxldCBkeCA9IHAueCAtIGcuY2VudGVyeDtcbiAgICAgICAgICAgIGxldCBkeSA9IHAueSAtIGcuY2VudGVyeTtcbiAgICAgICAgICAgIHZhciBub3JtYWxNYWduaXR1ZGUgPSBkaXN0YW5jZUZyb21DZW50ZXI7XG4gICAgICAgICAgICB2YXIgbm9ybWFsWCA9IGR4IC8gbm9ybWFsTWFnbml0dWRlO1xuICAgICAgICAgICAgdmFyIG5vcm1hbFkgPSBkeSAvIG5vcm1hbE1hZ25pdHVkZTtcbiAgICAgICAgICAgIHZhciB0YW5nZW50WCA9IC1ub3JtYWxZO1xuICAgICAgICAgICAgdmFyIHRhbmdlbnRZID0gbm9ybWFsWDtcbiAgICAgICAgICAgIHZhciBub3JtYWxTcGVlZCA9IC0obm9ybWFsWCAqIHAuc3BlZWR4ICsgbm9ybWFsWSAqICBwLnNwZWVkeSk7XG4gICAgICAgICAgICB2YXIgdGFuZ2VudFNwZWVkID0gdGFuZ2VudFggKiBwLnNwZWVkeCArIHRhbmdlbnRZICogcC5zcGVlZHk7XG4gICAgICAgICAgICBwLnNwZWVkeCA9IG5vcm1hbFNwZWVkICogbm9ybWFsWCArIHRhbmdlbnRTcGVlZCAqIHRhbmdlbnRYO1xuICAgICAgICAgICAgcC5zcGVlZHkgPSBub3JtYWxTcGVlZCAqIG5vcm1hbFkgKyB0YW5nZW50U3BlZWQgKiB0YW5nZW50WTtcbiAgICAgICAgfVxuXG5cbiAgICB9KTtcblxuXG5cbiAgICByZXR1cm4gZzsxXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGVwKHdvcmxkIDogV29ybGQsIGR0IDogbnVtYmVyKSA6IFdvcmxkIHtcbiAgICBcbiAgICBcbiAgICBzd2l0Y2ggKHdvcmxkLm1vdmVtZW50LmtpbmQpIHtcbiAgICAgICAgY2FzZSAnbGluZWFyJzpcbiAgICAgICAgICAgIGNvbnN0IHBhcnRpY2xlcyA9IHdvcmxkLm1vdmVtZW50LnBhcnRpY2xlcy5tYXAocCA9PiBtb3ZlUGFydGljbGUoZHQsIHdvcmxkLCBwKSk7XG4gICAgICAgICAgICBjb25zdCBpbmZlY3RlZCA9ICBwYXJ0aWNsZXMubWFwKHAgID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAuLi5wLFxuICAgICAgICAgICAgICAgICAgICBoZWFsdGggOiBkZXJpdmVkSGVhdGgocGFydGljbGVzLCB3b3JsZC50aW1lLCBwKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB3b3JsZC5tb3ZlbWVudCA9IHsga2luZCA6ICdsaW5lYXInLCBwYXJ0aWNsZXMgOiBpbmZlY3RlZCB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZ3JvdXBzJzpcbiAgICAgICAgICAgIHdvcmxkLm1vdmVtZW50Lmdyb3VwcyA9IHdvcmxkLm1vdmVtZW50Lmdyb3Vwcy5tYXAoZyA9PiBtb3ZlR3JvdXAoZHQsIHdvcmxkLCBnKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFsbFBhcnRpY2xlcyA9IChbXSBhcyBQYXJ0aWNsZVtdKS5jb25jYXQoLi4ud29ybGQubW92ZW1lbnQuZ3JvdXBzLm1hcChnID0+IGcucGFydGljbGVzKSk7XG5cbiAgICAgICAgICAgIHdvcmxkLm1vdmVtZW50Lmdyb3Vwcy5mb3JFYWNoKGcgPT4ge1xuICAgICAgICAgICAgICAgIGcucGFydGljbGVzLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHAuaGVhbHRoID0gZGVyaXZlZEhlYXRoKGFsbFBhcnRpY2xlcywgd29ybGQudGltZSwgcCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgd29ybGQudGltZSArPSBkdDtcbiAgICBcbiAgICByZXR1cm4gd29ybGQ7XG5cbn0iXSwic291cmNlUm9vdCI6IiJ9