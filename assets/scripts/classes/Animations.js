define('Animations', function() {

    class Animations
    {
    
        defaultDelay = 1500;
        animationCSSTime = 1500;
    
        constructor(element) {
    
            this.element = element;
    
    
        }
    
        #active (is_active, delay, callback){
    
            if (delay == 'auto') {
    
                delay = this.defaultDelay;
    
            }
    
            setTimeout(() => {
    
                this.element.classList.add(is_active ? 'active' : 'close');
    
                if (typeof callback !== typeof undefined) {
    
                    callback();
    
                }
    
            }, typeof delay === typeof undefined ? 0 : delay);
    
            return this;
    
        }
    
        show(delay, callback) {
    
            return this.#active(true, delay, callback);
    
        }
        
        hide(delay, callback) {
    
            return this.#active(false, delay, callback);
    
        }
    
    }

    return {

        init: function(element) {

            return new Animations(element);

        }

    }

});
