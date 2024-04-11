define('Incrementors', function() {
    
    class Incrementors
    {
    
        #defaults = {
            speed: 2000,
            refreshInterval: 50,
            decimals: 'auto',
            to: 'data-counter',
            thousand_separate: true,
            after: '',      // - use bracket to define after element directly into the value
            from: 0,
            onUpdate: null,  // callback method for every time the element is updated,
            onComplete: null,  // callback method for when the element finishes updating
        };
    
        #settings = {};
        #element = null;
    
        constructor(element, options) {
    
            this.#element = element;
    
            // - merge array
            for (const key in this.#defaults) {
    
                this.#settings[key] = typeof options == 'object' && options.hasOwnProperty(key) ? options[key] : this.#defaults[key];
    
            }
    
        }
    
        // - @source: https://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
        #getNbDecimals(num) {
    
            var match = num.toString().match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            if (!match) return 0;
    
            return Math.max(
                0,
                // Number of digits right of decimal point.
                (match[1] ? match[1].length : 0)
                // Adjust for scientific notation.
                - (match[2] ? +match[2] : 0)
            );
    
        }
    
        #thousandSeparator(nb) {
    
            nb += '';
    
            var x = nb.split('.'),
                x1 = x[0],
                x2 = x.length > 1 ? '.' + x[1] : '',
                rgx = /(\d+)(\d{3})/;
    
            while (rgx.test(x1)) {
    
                x1 = x1.replace(rgx, '$1' + '\'' + '$2');
    
            }
    
            return x1 + x2;
    
        }
    
        #display(nb) {
    
            nb = parseFloat(nb);
    
            try {
    
                nb = nb.toFixed(this.#settings.decimals);
    
            } catch (e) {
    
                console.log(e, 'element', this.#element, ' nb: ', nb, ' decimals: ', this.#settings.decimals);
    
            }
    
            return this.#thousandSeparator(nb) + this.#settings.after;
    
        }
    
        play() {
    
            const self = this;
    
            // - The value is defined by the HTML attribute
            if (self.#settings.to == 'data-counter') {
    
                self.#settings.to = self.#element.dataset.counter || 0;
    
            }
    
            if (self.#settings.after === '') {
    
                let v = JSON.stringify(self.#settings.to);
    
                if (v.indexOf('[') >= 0 && v.indexOf(']') >= 2) {
    
                    let p = v.split('[');
                    self.#settings.after = p[1].replace(']', '').replace('"', '');
                    self.#settings.to = parseFloat(p[0].replace('"', ''));
    
                }
    
            }
    
            if (self.#settings.decimals == 'auto') {
                self.#settings.decimals = self.#getNbDecimals(self.#settings.to);
            }
    
    
    
            let loops = Math.ceil(self.#settings.speed / self.#settings.refreshInterval),
                increment = (self.#settings.to - self.#settings.from) / loops;
    
            try {
    
                
                let loopCount = 0,
                    value = parseInt(self.#settings.from),
                    interval = setInterval(updateCounter, self.#settings.refreshInterval);
    
                function updateCounter() {
    
                    value += increment;
                    loopCount++;
    
                    self.#element.dataset.number = self.#display(value);
    
                    if (typeof self.#settings.onUpdate == 'function') {
    
                        self.#settings.onUpdate.call(self, value);
    
                    }
    
                    if (loopCount >= loops) {
                        
                        clearInterval(interval);
    
                        value = self.#display(self.#settings.to);
                        
                        if (typeof self.#settings.onComplete == 'function') {
    
                            self.#element.classList.add('incrementor-complete');
    
                            self.#settings.onComplete.call(self.#element, value);
    
                        }
    
                    }
                }
    
            } catch (e) {
    
                console.log(e);
                return;
    
            }
    
        }
    
    }

    return {

        init: function(element, options) {

            return new Incrementors(element, options);

        }

    }

});