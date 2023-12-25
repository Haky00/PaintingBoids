const leftWindow = document.getElementById('left-window');
const rightWindow = document.getElementById('right-window');
const saveButton = document.getElementById('save-btn');
const resetButton = document.getElementById('reset-btn');
const pauseButton = document.getElementById('pause-btn');
const presetsButton = document.getElementById('presets-btn');
const colorsButton = document.getElementById('colors-btn');
const boidsButton = document.getElementById('boids-btn');
const autoResolutionCheckbox = document.getElementById('resolution-auto');
const widthField = document.getElementById('resolution-w');
const heightField = document.getElementById('resolution-h');
const applyResolutionButton = document.getElementById('resolution-apply');
const boidsNumberField = document.getElementById('boids-n');
const applyBoidsButton = document.getElementById('boids-apply');
const presetsTab = document.getElementById('presets');
const colorsTab = document.getElementById('colors');
const boidsTab = document.getElementById('settings');
const addColorButton = document.getElementById('add-color-btn');
const scaleApplyButton = document.getElementById('scale-apply');
const scaleField = document.getElementById('scale-field');
const canvasColorField = document.getElementById('canvas-color-field');
const canvasColorButton = document.getElementById('canvas-color-apply');
const canvasColorInput = document.getElementById('canvas-color-input');
const boidDisplayCheckbox = document.getElementById('boid-display-checkbox');

var autoSize = true;
var width, height;
var boidsNumber = 150;
var activeTab = 0;
var scale = 1;
var backgroundColor = "#e6dfcd"
var boidDisplay = false;

const color = new ColorInfo('#FFA500', 150);
color.createColorElement();

function toggleTab(n, state) {
    var tabButton, tab;
    switch (n) {
        case 0:
            tabButton = presetsButton;
            tab = presetsTab;
            break;
        case 1:
            tabButton = colorsButton;
            tab = colorsTab;
            break;
        case 2:
            tabButton = boidsButton;
            tab = boidsTab;
            break;
    }
    if (state) {
        tabButton.classList.add("toggled");
        tab.classList.remove("hidden");
    }
    else {
        tabButton.classList.remove("toggled");
        tab.classList.add("hidden");
    }
}

function switchTab(n) {
    toggleTab(activeTab, false);
    activeTab = n;
    toggleTab(activeTab, true);
}

function reset(force) {
    if (!force && !autoSize) {
        return;
    }
    canvas.width = width || window.innerWidth * scale;
    canvas.height = height || window.innerHeight * scale;
    if (autoSize) {
        canvas.width = window.innerWidth * scale;
        canvas.height = window.innerHeight * scale;
    }
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    boids.reset(boidsNumber, canvas.width / scale, canvas.height / scale);
    for (var i = 0; i < 30; i++) {
        boids.tick(false);
    }
}

function boidDisplayChanged() {
    boidDisplay = boidDisplayCheckbox.checked;
}

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
    canvas.toBlob(function (blob) {
        let url = URL.createObjectURL(blob);
        downloadLink.setAttribute('href', url);
        downloadLink.click();
    });
}

function applyResolution() {
    try {
        width = parseInt(widthField.value);
        height = parseInt(heightField.value);
        autoSize = false;
        autoResolutionCheckbox.checked = autoSize;
        reset(true);
    }
    catch
    { }
}

function autoResolutionChanged(event) {
    if (event.currentTarget.checked) {
        autoSize = true;
        autoResolutionCheckbox.checked = autoSize;
        reset(true);
    }
}

function applyBoidsNumber() {
    boidsNumber = parseInt(boidsNumberField.value);
    reset(true);
}

function changeCanvasColor(color) {
    backgroundColor = color;
    canvasColorInput.value = backgroundColor;
    canvasColorField.value = backgroundColor.substring(1, 7);
    reset(true);
}

function canvasColorFieldChanged(event) {
    backgroundColor = `#${event.target.value}`;
    canvasColorInput.value = backgroundColor;
}

function canvasColorInputChanged(event) {
    backgroundColor = event.target.value;
    canvasColorField.value = backgroundColor.substring(1, 7);
}

function scaleApply() {
    scale = parseFloat(scaleField.value);
    reset(true);
}

function toggleUi() {
    leftWindow.classList.toggle("hidden");
    rightWindow.classList.toggle("hidden");
}

document.body.onkeyup = function (e) {
    if (e.key == " " ||
        e.code == "Space" ||
        e.keyCode == 32
    ) {
        playPlause();
        e.preventDefault();
    }
    if (e.key == "r" || e.key == "R") {
        window.onresize();
    }
    if (e.key == "s" || e.key == "S") {
        save();
    }
}

var defaultOpts = {
    boids: 250,
    speedLimit: 2,
    accelerationLimit: 0.8,
    alignmentDistance: 180,
    alignmentForce: 0.125,
    cohesionDistance: 180,
    cohesionForce: 0.015,
    separationDistance: 50,
    separationForce: 0.04,
};

const settings = [
    new NumericValueSetting('Speed limit', defaultOpts.speedLimit, 0, 10, 0.01, 2, function (newValue) {
        boids.change({ speedLimit: newValue });
    }),
    new NumericValueSetting('Acceleration limit', defaultOpts.accelerationLimit, 0, 10, 0.01, 2, function (newValue) {
        boids.change({ accelerationLimit: newValue });
    }),
    new NumericValueSetting('Alignment distance', defaultOpts.alignmentDistance, 0, 1000, 0.1, 1, function (newValue) {
        boids.change({ alignmentDistance: newValue });
    }),
    new NumericValueSetting('Alignment force', defaultOpts.alignmentForce, 0, 0.5, 0.001, 3, function (newValue) {
        boids.change({ alignmentForce: newValue });
    }),
    new NumericValueSetting('Cohesion distance', defaultOpts.cohesionDistance, 0, 1000, 0.1, 1, function (newValue) {
        boids.change({ cohesionDistance: newValue });
    }),
    new NumericValueSetting('Cohesion force', defaultOpts.cohesionForce, 0, 0.5, 0.001, 3, function (newValue) {
        boids.change({ cohesionForce: newValue });
    }),
    new NumericValueSetting('Separation distance', defaultOpts.separationDistance, 0, 1000, 0.1, 1, function (newValue) {
        boids.change({ separationDistance: newValue });
    }),
    new NumericValueSetting('Separation force', defaultOpts.separationForce, 0, 0.5, 0.001, 3, function (newValue) {
        boids.change({ separationForce: newValue });
    })
];

for (var i = 0; i < settings.length; i++) {
    settings[i].createElements();
}

resetButton.onclick = () => reset(true);
pauseButton.onclick = playPlause;
saveButton.onclick = save;
applyResolutionButton.onclick = applyResolution;
autoResolutionCheckbox.onchange = autoResolutionChanged;
applyBoidsButton.onclick = applyBoidsNumber;
presetsButton.onclick = () => switchTab(0);
colorsButton.onclick = () => switchTab(1);
boidsButton.onclick = () => switchTab(2);
addColorButton.onclick = () => colorList.addColor(new ColorInfo("#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0"), 1));
canvasColorField.oninput = canvasColorFieldChanged;
canvasColorInput.oninput = canvasColorInputChanged;
canvasColorButton.onclick = () => reset(true);
scaleApplyButton.onclick = scaleApply;
boidDisplayCheckbox.onchange = boidDisplayChanged;

var playing = true;


var canvas = document.createElement('canvas')
    , ctx = canvas.getContext('2d')
    , boids = new Boids(defaultOpts);

canvas.onclick = toggleUi;

window.onresize = () => reset(false);
reset(true);
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

var colorList = new ColorList([new ColorInfo('#ca762e', 1), new ColorInfo('#242754', 1), new ColorInfo('#e6dfcd', 1), new ColorInfo('#1f1724', 1), new ColorInfo('#a4a2ad', 1), new ColorInfo('#a44a28', 1), new ColorInfo('#e7ab2a', 1)]);
//colors = ['#000000']

boids.addEventListener('tick', function () {
    var boidData = boids.boids
        , halfHeight = canvas.height / 2
        , halfWidth = canvas.width / 2
        , boundsCheckW = halfWidth / scale
        , boundsCheckH = halfHeight / scale
    if (boidDisplay) {
        ctx.fillStyle = backgroundColor + "40";
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    colorList.resetNextColor();
    for (var i = 0, l = boidData.length, x, y; i < l; i += 1) {
        ctx.fillStyle = colorList.getNextColor();
        x = boidData[i][0]; y = boidData[i][1]
        diff = angleBetweenVectors(boidData[i][SPEEDX], boidData[i][SPEEDY], boidData[i][SMOOTHSPEEDX], boidData[i][SMOOTHSPEEDY]);
        console.log(`${boidData[i][SPEEDX]} --- ${boidData[i][SMOOTHSPEEDX]}`);
        // diff = directionDifference(boidData[i][SPEEDX], boidData[i][SPEEDY], boidData[i][LASTSPEEDX], boidData[i][LASTSPEEDY])
        // diff -= 1 - (1 / 200)
        // diff = diff > 0 ? diff * 200 : 0
        // diff = 1 - diff
        // diff = diff * diff * diff;
        // wrap around the screen
        boidData[i][0] = x = x > boundsCheckW ? -boundsCheckW : -x > boundsCheckW ? boundsCheckW : x
        boidData[i][1] = y = y > boundsCheckH ? -boundsCheckH : -y > boundsCheckH ? boundsCheckH : y
        drawFilledCircle(ctx, (x * scale + halfWidth), (y * scale + halfHeight), (2 + 14 * diff) * scale)
    }
})

function drawFilledCircle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function angleBetweenVectors(x1, y1, x2, y2) {
    const dotProduct = x1 * x2 + y1 * y2;
    const magnitude1 = Math.sqrt(x1 * x1 + y1 * y1);
    const magnitude2 = Math.sqrt(x2 * x2 + y2 * y2);
    const cosine = dotProduct / (magnitude1 * magnitude2);
    const angleInRadians = Math.acos(cosine);
    const angleInDegrees = (angleInRadians * 180) / Math.PI;
    const normalizedAngle = Math.min(angleInDegrees, 180 - angleInDegrees);
    const outputValue = normalizedAngle / 90;
    return Math.min(outputValue, 1);
}

function directionDifference(x1, y1, x2, y2) {
    let dotProduct = x1 * x2 + y1 * y2;
    let magnitude1 = Math.sqrt(x1 ** 2 + y1 ** 2);
    let magnitude2 = Math.sqrt(x2 ** 2 + y2 ** 2);
    let cosineAngle = dotProduct / (magnitude1 * magnitude2);
    let difference = (1 + cosineAngle) / 2;
    return difference;
}