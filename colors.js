class ColorInfo extends EventTarget {
    constructor(color = '#000000', weight = 250) {
        super();
        if (color.length == 7) {
            color += "ff";
        }
        this.color = color;
        this.weight = weight;
    }

    getHexWithAlpha(hexColor) {
        if (hexColor.length === 7) {
            hexColor += 'ff';
        } else if (hexColor.length === 4) {
            hexColor = '#' + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2] + hexColor[3] + hexColor[3] + 'FF';
        }
        return hexColor;
    }

    createColorElement() {
        const colorsDiv = document.getElementById('colors-list');

        const colorDiv = document.createElement('div');
        colorDiv.classList.add('color');

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = this.color.substring(0, 7);
        colorDiv.appendChild(colorInput);

        const hexLabel = document.createElement('div');
        hexLabel.textContent = 'Hex';
        colorDiv.appendChild(hexLabel);

        const hexInput = document.createElement('input');
        hexInput.type = 'text';
        hexInput.maxLength = 8;
        hexInput.value = this.getHexWithAlpha(this.color).replace('#', '');
        colorDiv.appendChild(hexInput);

        const weightLabel = document.createElement('div');
        weightLabel.textContent = 'Weight';
        colorDiv.appendChild(weightLabel);

        const weightInput = document.createElement('input');
        weightInput.type = 'number';
        weightInput.value = this.weight;
        weightInput.min = 0;
        colorDiv.appendChild(weightInput);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        colorDiv.appendChild(deleteButton);

        colorsDiv.appendChild(colorDiv);

        colorInput.addEventListener('input', (event) => {
            this.color = event.target.value + this.color.substring(this.color.length - 2, this.color.length);
            hexInput.value = this.getHexWithAlpha(this.color).replace('#', '');
        });

        hexInput.addEventListener('input', (event) => {
            const hexValue = event.target.value;
            this.color = `#${this.getHexWithAlpha(hexValue)}`;
            const rgbHex = this.color.substring(0, 7);
            colorInput.value = rgbHex;
        });

        weightInput.addEventListener('input', (event) => {
            this.weight = parseInt(event.target.value);
        });

        deleteButton.addEventListener('click', () => {
            this.dispatchEvent(new Event('delete'));
        });

        return colorDiv;
    }
}

class ColorList {
    constructor(colors) {
        this.colors = colors;
        this.currentIndex = -1;
        this.remainingWeight = -1;
        for (let i = 0; i < this.colors.length; i++) {
            const color = this.colors[i];
            color.addEventListener('delete', () => this.removeColor(color));
        }
        this.redrawElements();
    }

    resetNextColor() {
        this.currentIndex = -1;
        this.remainingWeight = -1;
    }

    getNextColor() {
        if(this.colors.length == 0) {
            return "#ff0000ff";
        }
        if (this.remainingWeight <= 0) {
            this.currentIndex++;
            if (this.currentIndex >= this.colors.length) {
                this.currentIndex = 0;
            }
            this.remainingWeight = this.colors[this.currentIndex].weight;
            if (this.remainingWeight == 0) {
                return "#ff0000ff";
            }
        }
        this.remainingWeight--;
        return this.colors[this.currentIndex].color;
    }

    removeColor(color) {
        var idx = this.colors.indexOf(color);
        this.colors.splice(idx, 1);
        this.redrawElements();
    }

    addColor(color) {
        this.colors.push(color);
        color.addEventListener('delete', () => this.removeColor(color));
        this.redrawElements();
    }

    redrawElements() {
        const colorsDiv = document.getElementById('colors-list');
        colorsDiv.innerHTML = '';
        for (var i = 0; i < this.colors.length; i++) {
            this.colors[i].createColorElement();
        }
    }
}