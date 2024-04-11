define('lightbox-lerping', ['vars'], function(vars) {

    const ease = vars.lerpEasing;       // - define timing easing lerping value

    return {

        init : lightbox => {

            const scrollContent = lightbox.querySelector('.--scroll-content');

            let current = 0,        // - define current lerping value
            target = 0;         // - define max lerping limit

            const lightboxSmoothScroll = () => {

                // - Define lerping value
                target = lightbox.scrollTop;
                current = vars.lerp(current, target, ease);
        
                // - Apply ty lerping translate
                scrollContent.style.transform = `translate3d(0, ${-current}px, 0)`;

                // - Keywords
                document.querySelectorAll('.experience--keyword--number').forEach(element => {

                    const delta = vars.animationSpeed.y.slow;

                    element.style.setProperty('--ty', `${element.getBoundingClientRect().top * delta}px`);

                });

                // - Keywords description
                document.querySelectorAll('.experience--keyword--description').forEach(element => {

                    const delta = vars.animationSpeed.y.fast;

                    element.style.transform = `translateY(${element.getBoundingClientRect().top * delta}px)`;

                });
                
                // - Keywords description
                lightbox.querySelectorAll('.--company-main-link').forEach(element => {

                    const delta = -vars.animationSpeed.y.normal;

                    element.style.transform = `translateY(${element.getBoundingClientRect().top * delta}px)`;

                });

                // - Listen scroll update
                window.requestAnimationFrame(lightboxSmoothScroll);
            }

            lightboxSmoothScroll();

        }

    };

});