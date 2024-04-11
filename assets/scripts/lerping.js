define('lerping', ['vars', 'TransformText'], function(vars, TransformText) {

    var lerpingCallbacks = [];

    // - DOM elements
    const page = document.querySelector('#page');

    let current = 0,        // - define current lerping value
        target = 0;         // - define max lerping limit

    const ease = vars.lerpEasing;

    var transformTextInstances = [];

    const hero = document.querySelector('.hero'),
          crytTxts = hero.querySelectorAll('.crypt-txt');

    const init = () => {

        document.body.style.height = page.getBoundingClientRect().height + 'px';

        crytTxts.forEach(function(txt) {
    
            // let tTransform = TransformText.init(txt, 'fixed');
            let tTransform = TransformText.init(txt, 'fixed');
    
            transformTextInstances[txt.dataset.index] = tTransform;
    
        });

        smoothScroll();

    }

    const smoothScroll = () => {

        // - Define lerping value
        target = window.scrollY;
        current = vars.lerp(current, target, ease);

        // - Apply ty lerping translate
        page.style.transform = `translate3d(0, ${-current}px, 0)`;

        // - Listen scroll update
        window.requestAnimationFrame(smoothScroll);

        // - Animation sample
        document.querySelectorAll('section > header > h2').forEach(title => {

            const rect = title.getBoundingClientRect();

            let offset = {
                top: 200,
                bottom: -200
            };
            if (rect.top > window.innerHeight + offset.top || rect.bottom < -window.innerHeight + offset.bottom) return;

            title.classList.add('active');

            let s = (rect.top * 0.3),
                max = (window.innerWidth / 100) * 30,
                min = (window.innerWidth / 100) * 5;

            if (max > 1000) max = 1000;
            if (min < 30) min = 30;

            if (s > max) s = max;
            else if (s < min) s = min;

            title.style.fontSize = `${s}px`;

        });

        // - Callbacks
        for (let index in lerpingCallbacks) {

            const callback = lerpingCallbacks[index];

            callback(current);

        }

    }

    window.addEventListener('resize', () => {

        setTimeout(() => {

            document.body.style.height = page.getBoundingClientRect().height + 'px';

        }, 300);

    });

    init();

    return {

        addCallback: callback => {

            lerpingCallbacks.push(callback);

        },

        getCurrent: () => {

            return current;

        }

    };

});