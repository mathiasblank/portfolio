define('mouse', ['vars'], function(vars) {

    vars.DOMReady(function() {

        const mouse = document.querySelector('#mouse');

        vars.mouse = mouse;

        const lerp = (start, end, amt) => (1-amt)*start+amt*end;

        var mouseX = 0;
        var mouseY = 0;
        var clientX = 0;
        var clientY = 0;

      

        // - Define mouse position and update it contain
        const updateMouse = function() {

            var mouse_rect = mouse.getBoundingClientRect(),
                nx = mouseX - (mouse_rect.width / 2),
                ny = mouseY - (mouse_rect.height / 2);

            mouse.style.left = nx + 'px';
            mouse.style.top = ny + 'px';

        };

        document.addEventListener('mousemove', function(event) {

            if (!mouse.classList.contains('allow-to-move')) return;

            clientX = event.clientX;
            clientY = event.clientY;

            mouseX = clientX;
            mouseY = clientY;

            updateMouse();

        });


        const move = () => {

            mouseX = lerp(mouseX, clientX, 0.1);
            mouseY = lerp(mouseY, clientY, 0.1);

            // console.log(mouseX, mouseY);

            updateMouse();

        };

        var timer = 0;
        var is_smooth_effect_active = false;

        // const enabledSmoothEffect = () => {

        //     if (is_smooth_effect_active) return;

        //     is_smooth_effect_active = true;

        //     timer = setInterval (move, 1000/60);

        // };

        // enabledSmoothEffect();

        const disabledSmoothEffect = () => {

            if (!is_smooth_effect_active) return;

            is_smooth_effect_active = false;

            clearInterval(timer);

        };

        document.addEventListener('mouseleave', function(event) {

            if (!mouse.classList.contains('allow-to-move')) return;

            mouse.classList.remove('active');

        });

        document.addEventListener('mouseenter', function(event) {

            if (!mouse.classList.contains('allow-to-move')) return;

            mouse.classList.add('active');

        });

        document.addEventListener('click', function() {

            if (mouse.classList.contains('click')) return;

            mouse.classList.add('click');

            setTimeout(function() {

                mouse.classList.remove('click');

            }, 250);


        });

        const updateMouseELements = () => {

            document.body.querySelectorAll('[data-mouse-txt]').forEach(function(txt) {

                // txt.removeEventListener('mouseenter');
                txt.addEventListener('mouseenter', function() {
    
                    document.body.classList.add('mouse-txt-active');
                    mouse.dataset.txt = txt.dataset.mouseTxt;
    
                    if (txt.dataset.mouseColor == 'theme') {
    
                        mouse.classList.add('theme-color');
    
                    }
    
                });
    
                // txt.removeEventListener('mouseleave');
                txt.addEventListener('mouseleave', function() {
    
                    document.body.classList.remove('mouse-txt-active');
                    mouse.classList.remove('theme-color');
                    mouse.dataset.txt = '';
    
                });
    
            });
    
            document.body.querySelectorAll('.anim--colored-link').forEach(function(txt) {

                // txt.removeEventListener('mouseenter', );
                txt.addEventListener('mouseenter', function() {
    
                    document.body.classList.add('mouse-colored-link-active');

                    if (typeof txt.dataset.mouseTxt !== typeof undefined) {

                        document.body.classList.add('mouse-no-scale');

                    }
    
                });

                // txt.removeEventListener('mouseleave');
                txt.addEventListener('mouseleave', function() {
    
                    document.body.classList.remove('mouse-colored-link-active', 'mouse-no-scale');
    
                });
    
            });

        }

        // - Change mouse on hover items
        setTimeout(() => {

            updateMouseELements();

        }, vars.INTRO_DELAY);

    });

    return {

        scan: function() {

            // alert('scan');

            console.log('scan');

            updateMouseELements();

        },

        enabledSmoothEffect: function() {

            // this.enabledSmoothEffect();

        },

        disabledSmoothEffect: function() {

            // this.disabledSmoothEffect();

        }, 

        isSmoothEffectActive: function() {

            return is_smooth_effect_active;

        },

        setTxt : (txt) => {

            mouse.dataset.txt = txt;

        },

        activeTxt : (active) => {

            active ? document.body.classList.add('mouse-txt-active') : document.body.classList.remove('mouse-txt-active');

        }

    };

});