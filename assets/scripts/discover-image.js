const TRANSITION_OFF_CLASS = 'transition-off',
      ANIMATION_DELAY = 350; // - according to the CSS transition timing 

define('discoverImage', ['vars', 'mouse'], function(vars, mouse) {

    // - src: https://dev.to/niorad/detecting-hover-and-touch-in-css-and-js-4e42
    const canHover = window.matchMedia('(hover: hover)').matches;
    const size = 'clamp(3rem, 20vmin, 10rem)';

    document.querySelectorAll('.discover-image').forEach(discoverImage => {
        
        // - DOM elements
        const mask = discoverImage.querySelector('.mask');

        // - Set circle discover size
        mask.style.setProperty('--size', size);
        mask.style.clipPath = `circle(${size} at 50% 50%`;

        var enterRef = null; // - enterAnimation timing function reference
        var state = 'ready'; // - ready: ready to move / open: image discovered / enter : init / leave : circle at center

        // - Get circle position
        const getPosition = (e) => {

            const rect = mask.getBoundingClientRect(),
                top = e.clientY - rect.top,
                left = e.clientX - rect.left;

            return {
                x: left,
                y: top
            };

        };

        // - Events
        discoverImage.addEventListener('mouseenter', e => {

            if (!canHover) return;

            mouse.activeTxt(true);
            mouse.setTxt('discover');
            document.body.classList.add('mouse-discover-image-active');

            if (state == 'open') return;

            const {x, y} = getPosition(e);

            mask.style.clipPath = `circle(${size} at ${x}px ${y}px)`;

            state = 'enter';

            enterRef = setTimeout(() => {
                
                state = 'ready';
                mask.classList.add(TRANSITION_OFF_CLASS);

            }, ANIMATION_DELAY);

        });

        discoverImage.addEventListener('mousemove', e => {

            if (!canHover) return;

            else if (state == 'enter') {

                mask.classList.add(TRANSITION_OFF_CLASS);
                clearTimeout(enterRef);
                state = 'ready';

            }

            else if ((state != 'ready' && state != 'move')) return;
            
            const {x, y} = getPosition(e);

            mask.style.clipPath = `circle(${size} at ${x}px ${y}px)`;

            state = 'move';

        });

        discoverImage.addEventListener('mouseleave', e => {

            if (!canHover) return;

            mouse.activeTxt(false);
            document.body.classList.remove('mouse-discover-image-active');

            if (state == 'open') return;

            mask.classList.remove(TRANSITION_OFF_CLASS);

            state = 'leave';

            setTimeout(() => {

                mask.style.clipPath = `circle(${size} at 50% 50%)`;
                state = 'ready';

            }, 50);

        });

        discoverImage.addEventListener('click', e => {

            if (canHover && (state != 'move' && state != 'open')) return;

            else if (state == 'open') {

                const {x, y} = getPosition(e);

                mask.style.clipPath = `circle(${size} at ${x}px ${y}px)`;

                setTimeout(() => {
                    
                    mouse.setTxt('discover');

                }, ANIMATION_DELAY / 2);

                setTimeout(() => {

                    mask.classList.add(TRANSITION_OFF_CLASS);
                    state = 'ready';

                }, ANIMATION_DELAY);

            } else {

                mask.classList.remove(TRANSITION_OFF_CLASS);

                state = 'open';
                
                mouse.setTxt('fermer');

                setTimeout(() => {

                    mask.style.clipPath = `circle(100% at 50% 50%)`;

                }, 50);

            }

        });

    });

});