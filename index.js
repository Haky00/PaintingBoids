const leftWindow = document.getElementById('left-window');
const rightWindow = document.getElementById('right-window');
const saveButton = document.getElementById('save-btn');
const resetButton = document.getElementById('reset-btn');
const pauseButton = document.getElementById('pause-btn');
const copyButton = document.getElementById('copy-btn');
const loadButton = document.getElementById('load-btn');
const clearButton = document.getElementById('clear-btn');
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
const randomColorsButton = document.getElementById('random-colors-btn');
const randomBoidsButton = document.getElementById('random-boids-btn');

resetButton.onclick = () => reset(true);
pauseButton.onclick = playPlause;
saveButton.onclick = save;
clearButton.onclick = clearCanvas;
copyButton.onclick = copyPresetToClipboard;
loadButton.onclick = loadPreset;
applyResolutionButton.onclick = applyResolution;
autoResolutionCheckbox.onchange = autoResolutionChanged;
applyBoidsButton.onclick = applyBoidsNumber;
presetsButton.onclick = () => switchTab(0);
colorsButton.onclick = () => switchTab(1);
boidsButton.onclick = () => switchTab(2);
addColorButton.onclick = () => colorList.addColor(new ColorInfo(getRandomColor(), 1));
canvasColorField.oninput = canvasColorFieldChanged;
canvasColorInput.oninput = canvasColorInputChanged;
canvasColorButton.onclick = () => reset(true);
scaleApplyButton.onclick = scaleApply;
boidDisplayCheckbox.onchange = boidDisplayChanged;
randomColorsButton.onclick = randomizeColors;
randomBoidsButton.onclick = randomizeBoids;

var boids, backgroundColor, colorList;

var autoSize = true;
var width, height;
var boidsNumber = 150;
var activeTab = 0;
var scale = 1;
var boidDisplay = false;
var sizeBase = 2;
var sizeVariable = 14;
var sizeVariableMaxAngle = 90;

function applyPreset(preset) {
    const opts = preset.opts;
    const colors = preset.colors;
    const colorWeights = preset.colorWeights;
    backgroundColor = preset.backgroundColor;
    sizeBase = preset.sizeBase == undefined ? 2 : preset.sizeBase;
    sizeVariable = preset.sizeVariable == undefined ? 14 : preset.sizeVariable;
    sizeVariableMaxAngle = preset.sizeVariableMaxAngle == undefined ? 90 : preset.sizeVariableMaxAngle;
    boidsNumber = opts.boids;
    boids = new Boids(opts);
    const settings = [
        new NumericValueSetting('Speed limit', opts.speedLimit, 0, 10, 0.01, 2, function (newValue) {
            boids.change({ speedLimit: newValue });
        }),
        new NumericValueSetting('Acceleration limit', opts.accelerationLimit, 0, 10, 0.01, 2, function (newValue) {
            boids.change({ accelerationLimit: newValue });
        }),
        new NumericValueSetting('Alignment distance', opts.alignmentDistance, 0, 1000, 0.1, 1, function (newValue) {
            boids.change({ alignmentDistance: newValue });
        }),
        new NumericValueSetting('Alignment force', opts.alignmentForce, -0.5, 0.5, 0.001, 3, function (newValue) {
            boids.change({ alignmentForce: newValue });
        }),
        new NumericValueSetting('Cohesion distance', opts.cohesionDistance, 0, 1000, 0.1, 1, function (newValue) {
            boids.change({ cohesionDistance: newValue });
        }),
        new NumericValueSetting('Cohesion force', opts.cohesionForce, -0.5, 0.5, 0.001, 3, function (newValue) {
            boids.change({ cohesionForce: newValue });
        }),
        new NumericValueSetting('Separation distance', opts.separationDistance, 0, 1000, 0.1, 1, function (newValue) {
            boids.change({ separationDistance: newValue });
        }),
        new NumericValueSetting('Separation force', opts.separationForce, -0.5, 0.5, 0.001, 3, function (newValue) {
            boids.change({ separationForce: newValue });
        }),
        new NumericValueSetting('Base paint size', sizeBase, -40, 40, 0.1, 1, function (newValue) {
            sizeBase = newValue;
        }),
        new NumericValueSetting('Added paint size based on angle', sizeVariable, -80, 80, 0.1, 1, function (newValue) {
            sizeVariable = newValue;
        }),
        new NumericValueSetting('Angle required for max. added size', sizeVariableMaxAngle, 0, 180, 0.1, 1, function (newValue) {
            sizeVariableMaxAngle = newValue;
        }),
    ];
    document.getElementById('settings-list').innerHTML = '';
    for (var i = 0; i < settings.length; i++) {
        settings[i].createElements();
    }
    var colorInfos = [];
    for (var i = 0; i < colors.length; i++) {
        colorInfos.push(new ColorInfo(colors[i], colorWeights[i]));
    }
    colorList = new ColorList(colorInfos);

    canvasColorInput.value = backgroundColor;
    canvasColorField.value = backgroundColor.substring(1, 7);
    boidsNumberField.value = boidsNumber;

    reset(true);
    boids.addEventListener('tick', tick);
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomColor() {
    return "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
}

function randomizeBoids() {
    let preset = presetFromCurrentSettings();

    preset.sizeBase = getRandomFloat(-1, 15);
    preset.sizeVariable = getRandomFloat(-5, 20);
    preset.sizeVariableMaxAngle = getRandomFloat(1, 180);
    preset.opts.boids = getRandomInt(1, 2001);
    preset.opts.speedLimit = getRandomFloat(0.1, 4);
    preset.opts.accelerationLimit = getRandomFloat(0, 10);
    preset.opts.alignmentDistance = getRandomFloat(0, 350);
    preset.opts.alignmentForce = getRandomFloat(-0.5, 0.5);
    preset.opts.cohesionDistance = getRandomFloat(0, 350);
    preset.opts.cohesionForce = getRandomFloat(-0.5, 0.5);
    preset.opts.separationDistance = getRandomFloat(0, 350);
    preset.opts.separationForce = getRandomFloat(-0.5, 0.5);

    applyPreset(preset);
}

function randomizeColors() {
    let preset = presetFromCurrentSettings();

    preset.backgroundColor = getRandomColor();
    let colorCount = getRandomInt(1, 9);

    preset.colors = [];
    preset.colorWeights = [];
    for (let i = 0; i < colorCount; i++) {
        preset.colors.push(getRandomColor());
        preset.colorWeights.push(getRandomInt(1, 11));
    }

    applyPreset(preset);
}

function tick() {
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
        boidData[i][0] = x = x > boundsCheckW ? -boundsCheckW : -x > boundsCheckW ? boundsCheckW : x
        boidData[i][1] = y = y > boundsCheckH ? -boundsCheckH : -y > boundsCheckH ? boundsCheckH : y
        drawFilledCircle(ctx, (x * scale + halfWidth), (y * scale + halfHeight), (sizeBase + sizeVariable * diff) * scale)
    }
}

function clearCanvas() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function loadPreset() {
    let json = prompt("Copy the saved settings into this field");
    let preset = JSON.parse(json);
    applyPreset(preset);
}

function presetFromCurrentSettings() {
    var preset = {
        backgroundColor: backgroundColor,
        sizeBase: sizeBase,
        sizeVariable: sizeVariable,
        sizeVariableMaxAngle: sizeVariableMaxAngle,
        opts: {
            boids: boids.boids.length,
            speedLimit: boids.speedLimitRoot,
            accelerationLimit: boids.accelerationLimitRoot,
            alignmentDistance: boids.alignmentDistanceRoot,
            alignmentForce: boids.alignmentForce,
            cohesionDistance: boids.cohesionDistanceRoot,
            cohesionForce: boids.cohesionForce,
            separationDistance: boids.separationDistanceRoot,
            separationForce: boids.separationForce,
        },
        colors: [],
        colorWeights: [],
    }
    for (var i = 0; i < colorList.colors.length; i++) {
        preset.colors.push(colorList.colors[i].color);
        preset.colorWeights.push(colorList.colors[i].weight);
    };
    return preset;
}

function copyPresetToClipboard() {
    navigator.clipboard.writeText(JSON.stringify(presetFromCurrentSettings(), null, "\t")
        .replaceAll(
            "],\n\t\"",
            "],\n\n\t\""
        ));
    alert("Settings copied to clipboard")
}

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

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.onclick = toggleUi;
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.appendChild(canvas);

applyPreset(presets[0].preset);

document.body.onkeyup = function (e) {
    if (e.key == " " ||
        e.code == "Space" ||
        e.keyCode == 32
    ) {
        playPlause();
        e.preventDefault();
    }
    if (e.key == "r" || e.key == "R") {
        reset(true);
    }
}

for (var i = 0; i < presets.length; i++) {
    presets[i].addToPresetsList();
    presets[i].addEventListener('click', (event) => applyPreset(event.preset));
}

var playing = true;

window.onresize = () => reset(false);
window.onresize()

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
    const outputValue = normalizedAngle / sizeVariableMaxAngle + 0.000001;
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