class NumericValueSetting {
    constructor(title, initialValue, min, max, step, decimals, callback) {
        this.title = title || 'Sample Numeric Setting';
        this.initialValue = initialValue || 50;
        this.min = min || 0;
        this.max = max || 100;
        this.step = step || 1;
        this.decimals = decimals || 0;
        this.callback = callback || function (newValue) {
            console.log(`New value for ${title} selected: ${newValue}`);
        };
    }

    createElements() {
        const settingsDiv = document.getElementById('settings');

        const settingDiv = document.createElement('div');
        settingDiv.classList.add('setting');

        const titleElement = document.createElement('h2');
        titleElement.textContent = this.title;

        const rangeInput = document.createElement('input');
        rangeInput.type = 'range';
        rangeInput.min = this.min;
        rangeInput.max = this.max;
        rangeInput.step = this.step;
        rangeInput.value = this.initialValue;

        const valueTextbox = document.createElement('input');
        valueTextbox.type = 'number';
        valueTextbox.min = this.min;
        valueTextbox.max = this.max;
        valueTextbox.step = this.step;
        valueTextbox.value = this.initialValue.toFixed(this.decimals);

        rangeInput.addEventListener('input', () => {
            const newValue = parseFloat(rangeInput.value);
            valueTextbox.value = newValue.toFixed(this.decimals);
            this.callback(newValue);
        });

        valueTextbox.addEventListener('input', () => {
            const newValue = parseFloat(valueTextbox.value);
            if (newValue >= this.min && newValue <= this.max) {
                rangeInput.value = newValue;
                this.callback(newValue);
            }
        });

        settingsDiv.appendChild(titleElement);
        settingDiv.appendChild(rangeInput);
        settingDiv.appendChild(valueTextbox);
        settingsDiv.appendChild(settingDiv);
    }
}