var POSITIONX = 0
    , POSITIONY = 1
    , SPEEDX = 2
    , SPEEDY = 3
    , ACCELERATIONX = 4
    , ACCELERATIONY = 5
    , SMOOTHSPEEDX = 6
    , SMOOTHSPEEDY = 7

class Boids extends EventTarget {
    constructor(opts, callback) {
        super();
        if (!(this instanceof Boids)) return new Boids(opts, callback)

        opts = opts || {}
        callback = callback || function () { }

        this.speedLimitRoot = opts.speedLimit || 0
        this.accelerationLimitRoot = opts.accelerationLimit || 1
        this.speedLimit = Math.pow(this.speedLimitRoot, 2)
        this.accelerationLimit = Math.pow(this.accelerationLimitRoot, 2)
        this.separationDistanceRoot = opts.separationDistance || 60;
        this.separationDistance = Math.pow(this.separationDistanceRoot, 2)
        this.alignmentDistanceRoot = opts.alignmentDistance || 180;
        this.alignmentDistance = Math.pow(this.alignmentDistanceRoot, 2)
        this.cohesionDistanceRoot = opts.cohesionDistance || 180;
        this.cohesionDistance = Math.pow(this.cohesionDistanceRoot, 2)
        this.separationForce = opts.separationForce || 0.15
        this.cohesionForce = opts.cohesionForce || 0.1
        this.alignmentForce = opts.alignmentForce || opts.alignment || 0.25
        this.attractors = opts.attractors || []

        var boids = this.boids = []
        for (var i = 0, l = opts.boids === undefined ? 50 : opts.boids; i < l; i += 1) {
            boids[i] = [
                Math.random() * 25, Math.random() * 25 // position
                ,
                0, 0 // speed
                ,
                0, 0 // acceleration
                ,
                0, 0 //last speed
            ]
        }

        this.addEventListener('tick', function () {
            callback(boids)
        })
    }
    change(opts) {
        this.separationDistanceRoot = opts.separationDistance || this.separationDistanceRoot;
        this.alignmentDistanceRoot = opts.alignmentDistance || this.alignmentDistanceRoot;
        this.cohesionDistanceRoot = opts.cohesionDistance || this.cohesionDistanceRoot;
        this.speedLimitRoot = opts.speedLimit || this.speedLimitRoot;
        this.accelerationLimitRoot = opts.accelerationLimit || this.accelerationLimitRoot;
        this.separationDistance = Math.pow(this.separationDistanceRoot, 2);
        this.alignmentDistance = Math.pow(this.alignmentDistanceRoot, 2);
        this.cohesionDistance = Math.pow(this.cohesionDistanceRoot, 2);
        this.separationForce = opts.separationForce || this.separationForce;
        this.cohesionForce = opts.cohesionForce || this.cohesionForce;
        this.alignmentForce = opts.alignmentForce || this.alignmentForce;

        this.speedLimit = Math.pow(this.speedLimitRoot, 2)
        this.accelerationLimit = Math.pow(this.accelerationLimitRoot, 2)
    }
    reset(boids, width, height) {
        this.boids = []
        for (var i = 0; i < boids; i++) {
            this.boids[i] = [
                width / 2 - Math.random() * width, height / 2 - Math.random() * height // position
                ,
                0, 0 // speed
                ,
                0, 0 // acceleration
                ,
                0, 0
            ]
        }
    }
    tick(emit) {
        var boids = this.boids, sepDist = this.separationDistance, sepForce = this.separationForce, cohDist = this.cohesionDistance, cohForce = this.cohesionForce, aliDist = this.alignmentDistance, aliForce = this.alignmentForce, speedLimit = this.speedLimit, accelerationLimit = this.accelerationLimit, accelerationLimitRoot = this.accelerationLimitRoot, speedLimitRoot = this.speedLimitRoot, size = boids.length, current = size, sforceX, sforceY, cforceX, cforceY, aforceX, aforceY, spareX, spareY, attractors = this.attractors, attractorCount = attractors.length, attractor, distSquared, currPos, length, target, ratio

        while (current--) {
            sforceX = 0; sforceY = 0
            cforceX = 0; cforceY = 0
            aforceX = 0; aforceY = 0
            currPos = boids[current]

            // Attractors
            target = attractorCount
            while (target--) {
                attractor = attractors[target]
                spareX = currPos[0] - attractor[0]
                spareY = currPos[1] - attractor[1]
                distSquared = spareX * spareX + spareY * spareY

                if (distSquared < attractor[2] * attractor[2]) {
                    length = hypot(spareX, spareY)
                    boids[current][SPEEDX] -= (attractor[3] * spareX / length) || 0
                    boids[current][SPEEDY] -= (attractor[3] * spareY / length) || 0
                }
            }

            target = size
            while (target--) {
                if (target === current) continue
                spareX = currPos[0] - boids[target][0]
                spareY = currPos[1] - boids[target][1]
                distSquared = spareX * spareX + spareY * spareY

                if (distSquared < sepDist) {
                    sforceX += spareX
                    sforceY += spareY
                } else {
                    if (distSquared < cohDist) {
                        cforceX += spareX
                        cforceY += spareY
                    }
                    if (distSquared < aliDist) {
                        aforceX += boids[target][SPEEDX]
                        aforceY += boids[target][SPEEDY]
                    }
                }
            }

            // Separation
            length = hypot(sforceX, sforceY)
            boids[current][ACCELERATIONX] += (sepForce * sforceX / length) || 0
            boids[current][ACCELERATIONY] += (sepForce * sforceY / length) || 0
            // Cohesion
            length = hypot(cforceX, cforceY)
            boids[current][ACCELERATIONX] -= (cohForce * cforceX / length) || 0
            boids[current][ACCELERATIONY] -= (cohForce * cforceY / length) || 0
            // Alignment
            length = hypot(aforceX, aforceY)
            boids[current][ACCELERATIONX] -= (aliForce * aforceX / length) || 0
            boids[current][ACCELERATIONY] -= (aliForce * aforceY / length) || 0
        }
        current = size

        // Apply speed/acceleration for
        // this tick
        while (current--) {
            if (accelerationLimit) {
                distSquared = boids[current][ACCELERATIONX] * boids[current][ACCELERATIONX] + boids[current][ACCELERATIONY] * boids[current][ACCELERATIONY]
                if (distSquared > accelerationLimit) {
                    ratio = accelerationLimitRoot / hypot(boids[current][ACCELERATIONX], boids[current][ACCELERATIONY])
                    boids[current][ACCELERATIONX] *= ratio
                    boids[current][ACCELERATIONY] *= ratio
                }
            }
            boids[current][SMOOTHSPEEDX] *= 0.95;
            boids[current][SMOOTHSPEEDY] *= 0.95;
            boids[current][SPEEDX] = boids[current][SPEEDX] + boids[current][ACCELERATIONX] * 0.5 + (-0.1 + Math.random() * 0.2);
            boids[current][SPEEDY] = boids[current][SPEEDY] + boids[current][ACCELERATIONY] * 0.5 + (-0.1 + Math.random() * 0.2);
            boids[current][SMOOTHSPEEDX] += 0.05 * boids[current][SPEEDX];
            boids[current][SMOOTHSPEEDY] += 0.05 * boids[current][SPEEDY];

            if (speedLimit) {
                distSquared = boids[current][SPEEDX] * boids[current][SPEEDX] + boids[current][SPEEDY] * boids[current][SPEEDY]
                if (distSquared > speedLimit) {
                    ratio = speedLimitRoot / hypot(boids[current][SPEEDX], boids[current][SPEEDY])
                    boids[current][SPEEDX] *= ratio
                    boids[current][SPEEDY] *= ratio
                }
            }

            boids[current][POSITIONX] += boids[current][SPEEDX]
            boids[current][POSITIONY] += boids[current][SPEEDY]
        }
        if (emit) {
            this.dispatchEvent(new Event('tick', boids))
        }
    }
}

// double-dog-leg hypothenuse approximation
// http://forums.parallax.com/discussion/147522/dog-leg-hypotenuse-approximation
function hypot(a, b) {
    a = Math.abs(a)
    b = Math.abs(b)
    var lo = Math.min(a, b)
    var hi = Math.max(a, b)
    return hi + 3 * lo / 32 + Math.max(0, 2 * lo - hi) / 8 + Math.max(0, 4 * lo - hi) / 16
}