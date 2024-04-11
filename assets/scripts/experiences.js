define('experiences', ['vars', 'scroll', 'mouse', 'TransformText', 'Animations', 'Incrementors', 'lerping', 'scroll_bar_width', 'lightbox-lerping'], function(vars, scroll, mouse, TransformText, Animations, Incrementor, lerping, scroll_bar_width, lightboxLerping) {


    vars.experiencesLightbox = document.querySelector('#experience_lightbox');

    vars.experiencesLightbox.addEventListener('scroll', function() {
        
        updateOnScroll();
        updateButtons();
        
    });
    
    const triggerItems = document.querySelectorAll('.experience-item--name');
    
    triggerItems.forEach(trigger => {
        
        trigger.addEventListener('click', function() {
            
            vars.experiencesLightbox.scrollTop = 0;
            document.body.classList.add('experiences-lightbox-active');

            vars.experiencesLightbox.style.top = `${window.scrollY}px`;
            vars.experiencesLightbox.classList.add('transition-on');

            // setTimeout(() => {

                vars.experiencesLightbox.style.top = `${window.scrollY}px`;

            // }, 300);

            document.querySelector('#main_menu_trigger').dataset.mouseTxt = 'Fermer';

            vars.experiencesLightbox.querySelectorAll('.experience--keyword--number').forEach(keyword => {

                keyword.classList.remove('active', 'incrementor-complete');
                keyword.dataset.number = '0';

                // Incrementor.init(keyword);

            });

            const parent = trigger.parentElement;

            const activeArticle = vars.experiencesLightbox.querySelector('[data-reference="' + parent.dataset.reference + '"]');
            activeArticle.classList.add('active');

            // - Name animation

            const triggerTitle = trigger;
            const lightboxTitle = activeArticle.querySelector('h2');

            const rectInit = triggerTitle.getBoundingClientRect();
            const rectInitY = rectInit.top + window.scrollY;

            var rectEnd = lightboxTitle.getBoundingClientRect();
            var rectEndY = rectEnd.top + window.scrollY;

            const animatedTitle = document.querySelector('#animated_title');

            animatedTitle.innerHTML = triggerTitle.innerHTML;

            // document.querySelector('#animated_title').classList.remove('hide');

            const triggerTitleStyle = window.getComputedStyle(triggerTitle, null);
            const lightboxTitleStyle = window.getComputedStyle(lightboxTitle, null);

            animatedTitle.style.top = rectInitY + 'px';
            animatedTitle.style.left = rectInit.x + 'px';
            animatedTitle.style.color = lightboxTitleStyle.getPropertyValue('color');
            animatedTitle.style.fontSize = triggerTitleStyle.getPropertyValue('font-size');
            animatedTitle.style.fontWeight = triggerTitleStyle.getPropertyValue('font-weight');

            animatedTitle.dataset.initTop = rectInitY + 'px';
            animatedTitle.dataset.initLeft = rectInit.x + 'px';
            animatedTitle.dataset.initColor = lightboxTitleStyle.getPropertyValue('color');

            animatedTitle.classList.add('active');

            document.documentElement.classList.add('no-overflow-f');
            document.body.classList.add('no-overflow-f');

            vars.mouse.dataset.txt = '';

            // alert('open');

            // mouse.scan();

            // const initScroll = lerping.getCurrent();



            setTimeout(() => {

                animatedTitle.classList.add('transition-active');
                animatedTitle.style.fontSize = lightboxTitleStyle.getPropertyValue('font-size');
                animatedTitle.style.left = rectEnd.x + 'px';
                animatedTitle.style.top = rectEndY + 'px';

                vars.experiencesLightbox.classList.add('no-overflow-f');


                let i = 0;
                const ref = setInterval(() => {
    
                    if (i > 25) {
    
                        clearInterval(ref);
    
                    }
    
                    const rect = triggerTitle.getBoundingClientRect();
                    const y = rect.top + lerping.getCurrent();
                    let diff = rectInitY - y;
    
                    var rectEnd = lightboxTitle.getBoundingClientRect();
                    var rectEndY = rectEnd.top + lerping.getCurrent();
                    animatedTitle.style.left = `${rectEnd.x}px`;
                    animatedTitle.style.top = `${rectEndY}px`;
    
                    i++;
                    
                }, 100);


                setTimeout(() => {

                    // updateScrollsData();

                    vars.experiencesLightbox.classList.add('ready');

                    setTimeout(() => {
                        
                        vars.experiencesLightbox.classList.remove('no-overflow-f');

                        setTimeout(() => {
                        
                            updateScrollsData();
                            updateOnScroll();
                            updateButtons();
                            // mouse.scan();

                            lightboxTitle.classList.add('active');
                            activeArticle.classList.add('ready');
                            activeArticle.querySelector('header > span').classList.add('active');
                            animatedTitle.classList.remove('active', 'transition-active');

                        }, 100);

                    }, 500);

                }, 1000);

            }, 100);


        });

    });

    // - Background-color switch
    vars.experiencesLightbox.addEventListener('scroll', function() {

        let activeArticle = vars.experiencesLightbox.querySelector('article.active'),
            has_active_area = false;

        if (activeArticle === null) return;

        activeArticle.querySelectorAll('[data-area-color]').forEach(element => {

            let rect = element.getBoundingClientRect();

            if (rect.top - (window.innerHeight / 6) <= 0 && rect.bottom - (window.innerHeight / 3) >= 0) {

                activeArticle.classList.add('color-area-active');

                has_active_area = true;

            }

        });

        // activeArticle.querySelectorAll('footer').forEach(element => {

        //     let rect = element.getBoundingClientRect();

        //     console.log(rect.y, window.innerHeight);

        //     if (rect.y < window.innerHeight) {

        //         activeArticle.classList.add('color-area-active');

        //         has_active_area = true;

        //     }

        // });

        if (!has_active_area) {

            activeArticle.classList.remove('color-area-active');

        }

    });


});
    