define('TransformText', function() {

    class TransformText
    {
    
        defaultRandomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        binaryRandomChars = '0123456789ABCDEF';
    
        constructor(element, type) {
    
            this.element = element;
            this.initInnerHTML = this.element.innerHTML;
            this.initChars = this.initInnerHTML.split('');
            this.length = this.initInnerHTML.length;
            this.type = type == 'undefined' ? 'fixed' : type;
    
            // console.log('type', type);
    
    
            this.status = null;
    
        }
    
        init() {
    
            // console.log('init type', this.type);
    
            if (this.type != 'fixed') return this;
    
            const parent = this.element.parentNode,
                rect = this.element.getBoundingClientRect(),
                parent_rect = parent.getBoundingClientRect();

                


            // const clone = this.element.cloneNode(true);
            // clone.removeAttribute('class');
            // clone.removeAttribute('style');
            // clone.removeAttribute('data-index');
            // clone.classList.add('clone', '--inline');
            // parent.appendChild(clone);

            if (parent_rect.height > rect.height) {

                parent.style.height = (rect.height * 2) + 'px';

                this.element.style.top = (parent_rect.y + parent_rect.height / 2) + 'px';

            } else {

                this.element.style.top = rect.y + 'px';
                
            }
            
            this.element.style.left = rect.x + 'px';
            
            // const c = parent.querySelector('.clone.--inline');
            
            
            
            // const rect = c.getBoundingClientRect();
            
            // clone.dataset.top = rect.top;
            
            console.log(this.element, rect.height, parent_rect.height);
            this.element.style.position = 'fixed';


            // setTimeout(() => {


            // }, 200);

    
            // const line_index = (rect.y - parent_rect.y) / parent_rect.height;

            // console.log(this.element, rect.y, parent_rect.y, (rect.y - parent_rect.y) / rect.height);

            // const delta = rect.y > parent_rect.y ? 2 : 1;

            // - Set Parent height
            // parent.style.height = `${rect.height * delta}px`;

            // - Set Element position
            // this.element.style.left = rect.x + 'px';§
            // this.element.style.left = rect.x + 'px';
            // this.element.style.top = rect.y + 'px';
            // this.element.style.position = 'fixed';
    
            return this;
    
        }
    
        toggleCrypt(anim) {
    
            // console.log(this.status);
    
            return this.status == 'crypt' ? this.uncrypt(anim) : this.crypt(anim);
    
        }
    
        #getRandomCryptChars(chars) {
    
            var _ic = [];
    
            if (typeof chars !== typeof 'string') chars = this.binaryRandomChars;
    
            for (let index = 0; index < this.length; index++) {
                
                _ic.push(this.initChars[index] == ' ' ? ' ' : this.getRandomChar(chars));
                
            }
    
            return _ic;
    
        } 
    
        randommizeString(active) {
    
            var self = this;
    
            if (active) {
    
                clearInterval(self.randomizeRef2);
    
                // self.randomizeRef = setInterval(function() {
    
                self.randomizeRef2 = setInterval(function() {
                    
                    var c = [];
    
                    self.initChars.forEach(function(letter, key) {
                        
                        if (letter === ' ') {
    
                            c[key] = ' ';
    
                        } else {
    
                            let chars = letter === letter.toUpperCase() ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : 'abcdefghijklmnopqrstuvwxyz';
    
                            c[key] = self.getRandomChar(chars);
    
                        }
    
                    });
    
                    self.element.innerHTML = c.join('');
    
                }, 100);
    
                // }, 200);
            
            } else {
    
                setTimeout(() => {
    
                    clearInterval(self.randomizeRef2);
                    self.element.innerHTML = self.initChars.join('');
    
                }, 500);
    
            }
    
        }
    
        anim(type, algo) {
    
            const self = this,
                  is_crypt = type == 'crypt';
    
            var before_chars = is_crypt ? self.initChars : self.element.innerHTML.split(''),
                after_chars = is_crypt ? self.#getRandomCryptChars() : self.initChars,
                randomChars = undefined,
                _nt_ok = 0;
    
            if (is_crypt) {
    
                switch (algo) {
    
                    case 'bin':
    
                        randomChars = self.binaryRandomChars;
    
                        break;
    
                    default:
    
                        randomChars = self.defaultRandomChars;
    
                        break;
    
                }
    
            }
    
            // console.log(type, is_crypt, before_chars, after_chars, randomChars);
    
            var before_random_letters_rect = self.element.getBoundingClientRect();
    
            if (self.type == 'fixed') {
                
                self.element.style.width = self.element.getBoundingClientRect().width + 'px';
                self.element.style.height = self.element.getBoundingClientRect().height + 'px';
    
            }
    
            // return;
    
            var s = setInterval(function() {
    
                var _s2_index = 0,
                    s2 = setInterval(function() {
                    
                    var c = [];
    
                    before_chars.forEach(function(letter, key) {
                        
                        if (letter === ' ') {
    
                            c[key] = ' ';
    
                        } else if (key <= _nt_ok) {
    
                            c[key] = after_chars[key];
    
                        } else if (key == _s2_index) {
    
                            c[key] = self.getRandomChar(randomChars);
    
                        } else if (key > _s2_index) {
    
                            c[key] = before_chars[key];
    
                        }
    
                    });
    
                    self.element.innerHTML = c.join('');
    
                    _s2_index++;
    
                    if (_s2_index == 5) clearInterval(s2);
    
                }, 1000 / self.length / 5);
    
                _nt_ok++;
    
                if (_nt_ok == self.length && (this.stop && this.loopAnim)) {
                    
                    clearInterval(s);
    
                    self.element.style.width = 'auto';
                    self.element.style.height = 'auto';
    
                }
    
            }, 1000 / self.length);
    
            return this;
    
        }
    
        crypt(anim, algo) {
    
            if (this.status == 'crypt') return this;
    
            if (anim) {
    
                this.anim('crypt', algo);
    
            } else {
    
                let chars = null;
    
                // console.log(algo);
    
                if (algo == 'alpha') {
    
                    chars = this.defaultRandomChars;
    
                }
    
                this.element.innerHTML = this.#getRandomCryptChars(chars).join('');
    
            }
    
            this.status = 'crypt';
    
            return this;
    
        }
    
        uncrypt(anim) {
    
            // console.log(this.status);
    
            if (this.status == 'uncrypt') return this;
    
            if (anim) {
    
                this.anim('uncrypt');
    
            } else{
    
                this.element.innerHTML = this.initChars.join('');
    
            }
    
            this.status = 'uncrypt';
    
            return this;
    
        }
    
        getRandomChar(chars) {
    
            var characters       = typeof chars === typeof undefined ? this.defaultRandomChars : chars,
                charactersLength = characters.length;
    
            return characters.charAt(Math.floor(Math.random() * charactersLength));
    
        }
    
    }

    return {

        init: function(element, type) {

            return new TransformText(element, type);

        }

    }

});