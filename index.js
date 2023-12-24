var width = 2000;
var height = 2000;

function playPlause() {
    playing = !playing;
    if (playing) {
        pauseButton.innerText = 'Pause';
    }
    else {
        pauseButton.innerText = 'Play';
    }
}

function save() {
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'boid_painting.png');
    canvas.toBlob(function(blob) {
      let url = URL.createObjectURL(blob);
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    });
}

document.body.onkeyup = function (e) {
    if (e.key == " " ||
        e.code == "Space" ||
        e.keyCode == 32
    ) {
        playPlause();
    }
    if (e.key == "r" || e.key == "R") {
        window.onresize();
    }
    if (e.key == "s" || e.key == "S") {
        save();
    }
}

const settings = [
    new NumericValueSetting('Speed limit', 2, 0, 10, 0.01, 2, function (newValue) {
        boids.change({ speedLimit: newValue });
    }),
    new NumericValueSetting('Acceleration limit', 0.8, 0, 10, 0.01, 2, function (newValue) {
        boids.change({ accelerationLimit: newValue });
    }),
    new NumericValueSetting('Alignment distance', 160, 0, 1000, 0.1, 1, function (newValue) {
        boids.change({ alignmentDistance: newValue });
    }),
    new NumericValueSetting('Alignment force', 0.05, 0, 0.5, 0.001, 3, function (newValue) {
        boids.change({ alignmentForce: newValue });
    }),
    new NumericValueSetting('Cohesion distance', 160, 0, 1000, 0.1, 1, function (newValue) {
        boids.change({ cohesionDistance: newValue });
    }),
    new NumericValueSetting('Cohesion force', 0.025, 0, 0.5, 0.001, 3, function (newValue) {
        boids.change({ cohesionForce: newValue });
    }),
    new NumericValueSetting('Separation distance', 60, 0, 1000, 0.1, 1, function (newValue) {
        boids.change({ separationDistance: newValue });
    }),
    new NumericValueSetting('Separation force', 0.01, 0, 0.5, 0.001, 3, function (newValue) {
        boids.change({ separationForce: newValue });
    })
];

for (var i = 0; i < settings.length; i++) {
    settings[i].createElements();
}

const saveButton = document.getElementById('save-btn');
const resetButton = document.getElementById('reset-btn');
const pauseButton = document.getElementById('pause-btn');

resetButton.onclick = function () {
    window.onresize();
};

pauseButton.onclick = playPlause;
saveButton.onclick = save

var playing = true;


var canvas = document.createElement('canvas')
    , ctx = canvas.getContext('2d')
    , boids = new Boids({
        boids: 250
        , speedLimit: 2
        , accelerationLimit: 0.8
        , alignmentForce: 0.05
        , cohesionForce: 0.025
        , alignmentDistance: 160
        , cohesionDistance: 160
        , separationForce: 0.01
        , separationDistance: 60
    })

window.onresize = function () {
    canvas.width = width || window.innerWidth
    canvas.height = height || window.innerHeight
    ctx.fillStyle = 'rgba(255,255,255,1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    boids.reset(canvas.width, canvas.height);
    for (var i = 0; i < 30; i++) {
        boids.tick(false);
    }
}
window.onresize()

document.body.style.margin = '0'
document.body.style.padding = '0'
document.body.appendChild(canvas)

var currentTime = 0;
var lastTime = 0;

function step(t) {
    currentTime += (lastTime - t) / 10000;
    if (playing) {
        boids.tick(true);
    }
    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);

var colors = ['#ca762e', '#242754', '#e6dfcd', '#1f1724', '#a4a2ad', '#a44a28', '#e7ab2a']
//colors = ['#000000']

boids.addEventListener('tick', function () {
    var boidData = boids.boids
        , halfHeight = canvas.height / 2
        , halfWidth = canvas.width / 2

    // ctx.fillStyle = 'rgba(255,255,255,0.25)'
    // ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (var i = 0, l = boidData.length, x, y; i < l; i += 1) {
        ctx.fillStyle = colors[i % colors.length]
        x = boidData[i][0]; y = boidData[i][1]
        diff = directionDifference(boidData[i][SPEEDX], boidData[i][SPEEDY], boidData[i][ACCELERATIONX], boidData[i][ACCELERATIONY])
        diff -= 1 - (1 / 14)
        diff = diff > 0 ? diff * 14 : 0
        diff = diff * diff
        diff = 1 - diff
        // wrap around the screen
        boidData[i][0] = x > halfWidth ? -halfWidth : -x > halfWidth ? halfWidth : x
        boidData[i][1] = y > halfHeight ? -halfHeight : -y > halfHeight ? halfHeight : y
        drawFilledCircle(ctx, x + halfWidth, y + halfHeight, 2 + 10 * diff)
    }
})

function drawFilledCircle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function directionDifference(x1, y1, x2, y2) {
    let dotProduct = x1 * x2 + y1 * y2;
    let magnitude1 = Math.sqrt(x1 ** 2 + y1 ** 2);
    let magnitude2 = Math.sqrt(x2 ** 2 + y2 ** 2);
    let cosineAngle = dotProduct / (magnitude1 * magnitude2);
    let difference = (1 + cosineAngle) / 2;
    return difference;
}