class Preset extends EventTarget {
    constructor(name, imagePath, preset) {
        super();
        this.name = name;
        this.imagePath = imagePath;
        this.preset = preset;
    }

    addToPresetsList() {
        console.log("aaa");
        const presetsList = document.getElementById('presets-list');

        const presetDiv = document.createElement('div');
        presetDiv.classList.add('preset');

        const image = document.createElement('img');
        image.src = this.imagePath;
        presetDiv.appendChild(image);

        const presetName = document.createElement('div');
        presetName.textContent = this.name;
        presetDiv.appendChild(presetName);

        const useButton = document.createElement('button');
        useButton.textContent = 'Use';
        useButton.addEventListener('click', () => {
            const clickEvent = new Event('click');
            clickEvent.preset = this.preset;
            this.dispatchEvent(clickEvent);
        });
        presetDiv.appendChild(useButton);

        presetsList.appendChild(presetDiv);
    }
}

var presets = [
    new Preset("Pollock 1", "pollock1.png", {
        backgroundColor: "#e6dfcd",
        opts: {
            boids: 150,
            speedLimit: 2,
            accelerationLimit: 0.8,
            alignmentDistance: 180,
            alignmentForce: 0.125,
            cohesionDistance: 180,
            cohesionForce: 0.015,
            separationDistance: 50,
            separationForce: 0.04,
        },
        colors: [
            '#ca762e',
            '#242754',
            '#e6dfcd',
            '#1f1724',
            '#a4a2ad',
            '#a44a28',
            '#e7ab2a',
        ],
        colorWeights: [
            1,
            1,
            1,
            1,
            1,
            1,
            1,
        ],
    }),
    new Preset("Pollock 2", "pollock2.png", {
        backgroundColor: "#e6ffff",
        opts: {
            boids: 80,
            speedLimit: 2,
            accelerationLimit: 0.8,
            alignmentDistance: 180,
            alignmentForce: 0.125,
            cohesionDistance: 180,
            cohesionForce: 0.015,
            separationDistance: 50,
            separationForce: 0.04,
        },
        colors: [
            '#001e92',
            '#008fe4',
            '#43d6fc',
            '#f04d2e',
            '#efa64e',
            '#fffd03',
            '#e6ffff',
        ],
        colorWeights: [
            1,
            1,
            1,
            1,
            1,
            1,
            2,
        ],
    }),
    new Preset("Pollock 3", "pollock3.png", {
        backgroundColor: "#b13232",
        opts: {
            boids: 120,
            speedLimit: 2,
            accelerationLimit: 0.8,
            alignmentDistance: 180,
            alignmentForce: 0.125,
            cohesionDistance: 180,
            cohesionForce: 0.015,
            separationDistance: 50,
            separationForce: 0.04,
        },
        colors: [
            '#b13232',
            '#e9dd00',
            '#272727',
            '#3d6bac',
            '#b8b6af',
        ],
        colorWeights: [
            6,
            1,
            3,
            1,
            1,
        ],
    }),
    new Preset("Rogue elements", "rogue.png", {
        backgroundColor: "#0a0a0c",
        opts: {
            boids: 180,
            speedLimit: 2,
            accelerationLimit: 0.8,
            alignmentDistance: 250,
            alignmentForce: 0.250,
            cohesionDistance: 180,
            cohesionForce: 0.015,
            separationDistance: 50,
            separationForce: 0.04,
        },
        colors: [
            '#00f091ff',
            '#0a0a0cff',
            '#5500b3ff',
        ],
        colorWeights: [
            5,
            30,
            1,
        ],
    }),
    new Preset("Camo", "camo.png", {
        backgroundColor: "#83945e",
        opts: {
            boids: 180,
            speedLimit: 2,
            accelerationLimit: 0.8,
            alignmentDistance: 180,
            alignmentForce: 0.125,
            cohesionDistance: 180,
            cohesionForce: 0.015,
            separationDistance: 50,
            separationForce: 0.04,
        },
        colors: [
            '#83945e',
            '#4a5c42',
            '#d4cbac',
            '#5e4642',
            '#819c73',
        ],
        colorWeights: [
            1,
            1,
            1,
            1,
            1,
        ],
    }),
    new Preset("Blood in the water", "blood.png", {
        backgroundColor: "#2b6aff",
        opts: {
            boids: 250,
            speedLimit: 2,
            accelerationLimit: 0.8,
            alignmentDistance: 400,
            alignmentForce: 0.400,
            cohesionDistance: 500,
            cohesionForce: 0.075,
            separationDistance: 50,
            separationForce: 0.1,
        },
        colors: [
            '#df1c00ff',
            '#c41e00ff',
            '#2b6affff',
            '#6694ffff',
            '#0045e8ff',
        ],
        colorWeights: [
            1,
            1,
            20,
            3,
            2,
        ],
    }),
];