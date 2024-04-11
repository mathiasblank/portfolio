define('TypeWriter', function() {

    class TypeWriter
    {
    
        delays = {};
        delay = 0;
        elements = [];
        delay_index = 0;

        parent = null;
    
        constructor(parent) {
    
            this.parent = parent;
    
            this.init();
    
        }

        getDelay() {
            
            return this.delay;

        }
    
        init() {

            var self = this;
    
            // - Prepare type writing letters
            self.parent.querySelectorAll('.anim--type-writing').forEach(function(element, key) {
                    
                // console.log(self.delay, element);
        
                let html = '';
                
                const chars = element.innerHTML.split('');
        
                for (let index in chars) {
        
                    const char = chars[index];
        
                    html += '<span>' + (char == ' ' ? '' : char) + '</span>';
        
                }
        
                element.innerHTML = html;
        
                self.delays[self.delay_index] = {delay: self.delay, element: element};
        
                self.delay += ((chars.length + 1) * 100) + 200 + 500 + 100;
        
                self.elements.push(element);
        
                self.delay_index++;
        
            });
    
            return self;
    
        }
    
        print(callback) {

            var self = this;

            if (typeof callback == 'function') {

                setTimeout(() => {
                    
                    callback();

                }, self.delay);

            }

            for (let index in self.delays) {
    
                const data = self.delays[index];
        
                // - Delay between elements
                setTimeout(() => {
        
                    data.element.classList.add('start');
        
                    // - Delay before starting print first letter
                    setTimeout(() => {
        
                        data.element.classList.remove('start');
                        
                        let spans = data.element.querySelectorAll('span');
        
                        spans.forEach(function(span, key) {
                            
                            // - Delay between each letter
                            setTimeout(() => {
        
                                span.classList.add('active', 'print');
        
                                // - Delay before disactive letter
                                setTimeout(() => {
        
                                    setTimeout(() => {
        
                                        span.classList.remove('active');
        
                                    }, key == spans.length -1 ? 400 : 0);
        
                                }, 100);
        
                            }, 100 * key);
        
                        });
        
                    }, 500);
        
                }, data.delay);
        
            }

            return self;
    
        }
    
    }

    return {

        init: function(parent) {

            return new TypeWriter(parent);

        },

    }

});