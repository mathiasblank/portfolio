
// - Require JS config
requirejs.config({

    baseUrl: 'assets/scripts/',

    // paths: {
    //     jquery: '//code.jquery.com/jquery-3.6.0.min',
    //     scrollify: '//agenceneue.ch/assets/scripts/scrollify/scrollify-jquery.2.1.0',
    //     // wheel : '//new-site.agenceneue.ch/wp-content/themes/neue/assets/scripts/lib/wheel.min'
    //     // vars: 'vars',
    //     // dom_elements: 'dom_elements',
    //     // swipe: 'lib/swipe-jquery',
    //     // slider: 'lib/slider-jquery',
    //     // scrollify: 'lib/scrollify-jquery',
    // },
    // shim:{
    //     scrollify : ["jquery"]
    //     // wheel : ["jquery"]
    // }

});

require([

    // - Called as argument
    'vars',
    'Incrementors',
    // 'dom_elements',
    // 'vars',
    // 'toolkit',
    // 'simple_slider',
    // 'small_banner',
    // 'forms',
    // 'menu_scroll',
    // 'cookies_banner',
    'lerping',
    'lightbox-lerping',

    // - Just called
    'intro',
    'Animations',
    'TransformText',
    'TypeWriter',
    'magneticFX',
    'mouse',
    'experiences',
    'discoverImage'
    // 'select',
    // 'radio',
    // 'lift',
    // 'inputs',
    // 'forms',
    // 'menu',
    // 'header',
    // 'cookies_banner_jquery',
    // 'scrollify',
    // 'swipe',
    // 'navigate',
    // 'auto_gallery', 
    // 'play_text_animation'

],
function(vars, Incrementors, lerping, lightboxLerping) {

    vars.DOMReady(function() {

        vars.updateFavicon();

        document.documentElement.classList.add('no-overflow-f');
        document.querySelector('body').classList.add('no-overflow-f');
        document.documentElement.style.cursor = 'none';
        document.documentElement.classList.add('init');
        window.scrollTo(0, 0);
        
        setTimeout(() => {

            window.scrollTo(0, 0);

            // // - Without intro.js only
            // document.documentElement.classList.remove('no-overflow-f');
            // document.querySelector('body').classList.remove('no-overflow-f');

            // updateScrollsData(true);

            // document.querySelector('#mouse').classList.add('allow-to-move', 'active');


        }, 600);

        // - Event callback
        window.addEventListener('resize', function() {

            for (let index = 0; index < vars.callbacks.resize.length; index++) {

                vars.callbacks.resize[index]();
                
            }

        });

        const scrollUp = document.querySelector('.scroll-up');

        window.addEventListener('scroll', function() {

            for (let index = 0; index < vars.callbacks.scroll.length; index++) {

                vars.callbacks.scroll[index]();
                
            }

            let  maxScrollY = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);

            // console.log(maxScrollY - this.window.innerHeight / 2, this.window.scrollY);
            if (!scrollUp.classList.contains('active') && maxScrollY - (this.window.innerHeight) <= this.window.scrollY) {

                scrollUp.classList.add('active');

            }

        });

        scrollUp.addEventListener('click', () => {

            window.scrollTo({
                top: 0,
                behavior : 'smooth'
            });

        });

        const tyElements = document.querySelectorAll('.main-footer--mail, .experience-item--name, .main-footer--copyright, .skills--category .marquee');
        lerping.addCallback(() => {

            const rect = scrollUp.getBoundingClientRect();

            rect.top - rect.height - window.innerHeight < 0 ? scrollUp.classList.add('active') : scrollUp.classList.remove('active');

            // - Callbacks
            let i = 0;
            tyElements.forEach(element => {

                let delta = vars.animationSpeed.y.normal;

                if (element.classList.contains('marquee')) {

                    if (i % 2 == 0) {

                        delta = vars.animationSpeed.y.slow;

                    }

                    i++;

                }

                else if (element.classList.contains('main-footer--mail')) {

                    delta = vars.animationSpeed.y.normal;

                }

                const rect = element.getBoundingClientRect();

                element.style.transform = `translateY(${rect.top * delta}px)`;

            });

        });
        
        vars.scrollCallbacks.active.push(function(element) {

            if (element.classList.contains('incrementor') && !element.classList.contains('incrementor-complete')) {

                const ic = Incrementors.init(element, {onComplete : function(el) {
                    element.classList.add('incrementor-complete');
                }});

                ic.play();

            }

        });

        var mouse_velocity = 0;
        const speed = 12;

        // - Define the mouse velocity
        document.addEventListener('mousemove', function(e) {

            if (window.innerWidth < 993) return;

            let half = window.innerWidth / 2;

            if (e.clientX < half) {

                mouse_velocity = ((half - e.clientX) / half) * -1;

            } else {

                mouse_velocity = (e.clientX - half) / half;

            }

        });

        
        // - @src: https://www.trysmudford.com/blog/linear-interpolation-functions/
        //         https://codepen.io/ma77os/pen/OJPVrP
        const lerp = (x, y, a) => x * (1 - a) + y * a;

        const marquees = document.querySelectorAll('.marquee');
        const MARQUEES_REFRESH_TIME = 10;

        // var stopMarquees = [];
        // stopMarquees = document.querySelectorAll('.experience--type .marquee');

        marquees.forEach(marquee => {

            var items_position = {
                x : []
            };

            // console.log(marquee);

            const items = marquee.querySelector('.marquee--inner').querySelectorAll('span');

            let i = 0;
            items.forEach(item => {

                // - Define the new position of the item
                items_position.x[i] = 0;

                let rect = item.getBoundingClientRect();

                item.dataset.width = rect.width;
                item.dataset.replace = '0';
                item.dataset.tx = 0;

                if (i == 1) {

                    let pos_x = rect.width * -2;
                    item.style.transform = 'translate3d(' + pos_x + 'px, 0, 0)';
                    items_position.x[i] = pos_x;
                    item.dataset.tx = pos_x;

                }

                i++;

            });

            const updateItems = function(skew_x, mouse_velocity) {

                let i = 0;
                items.forEach(item => {

                    // - Define the new position of the item
                    let new_pos_x = items_position.x[i] + (speed * mouse_velocity * -1);

                    item.style.transform = 'translate3d(' + new_pos_x + 'px, 0, 0) skewX(' + skew_x + 'deg)';
                    items_position.x[i] = new_pos_x;
                    item.dataset.tx = new_pos_x - (i * item.dataset.width);
                
                    // - Prepare data for calcul
                    let rect = item.getBoundingClientRect(),
                        item_middle_pos_x = rect.x + (rect.width / 2),
                        items_half = window.innerWidth / 2;

                    // - Update HTML data attribute
                    item.dataset.posX = item_middle_pos_x.toFixed(2);
                    item.dataset.half = items_half / 2;

                    // - Need to move noncurrent wrapper before or after the current one ? (infinite effect)
                    if (mouse_velocity < 0 && item_middle_pos_x > (items_half - 200) && item_middle_pos_x < items_half) {

                        item.dataset.replace = '0';   // - the current loop container is the active one
                        
                        // - noncurrent container is push before current one
                        noncurrent_container_index = i == 0 ? 1 : 0;
                        noncurrentContainer = items[noncurrent_container_index];
                        
                        if (noncurrentContainer.dataset.replace != '-1') {
                            
                            let new_pos_x = rect.left - noncurrentContainer.dataset.width;

                            noncurrentContainer.style.transform = 'translate3d(' + new_pos_x + 'px, 0, 0) skewX(' + skew_x + 'deg)';
            
                            items_position.x[noncurrent_container_index] = new_pos_x;

                            noncurrentContainer.dataset.tx = new_pos_x - (i * noncurrentContainer.dataset.width);

                            noncurrentContainer.dataset.replace = '-1';

                        }

                    } else if (mouse_velocity > 0 && item_middle_pos_x > items_half && item_middle_pos_x < items_half + 200) {

                        item.dataset.replace = '0'; // - the current loop container is the active one

                        // - noncurrent container is push after current one
                        noncurrent_container_index = i == 0 ? 1 : 0;
                        noncurrentContainer = items[noncurrent_container_index];
                        
                        if (noncurrentContainer.dataset.replace != '1') {
                            
                            let new_pos_x = rect.right + parseFloat(noncurrentContainer.dataset.width) * -1;

                            noncurrentContainer.style.transform = 'translate3d(' + new_pos_x + 'px, 0, 0) skewX(' + skew_x + 'deg)';
            
                            items_position.x[noncurrent_container_index] = new_pos_x;

                            noncurrentContainer.dataset.tx = new_pos_x;

                            noncurrentContainer.dataset.replace = '1';

                        }

                    }

                    i++;

                });

            }

            const getSkewX = () => mouse_velocity * 15;

            let timerRef = null,
                endTimerRef = null;

            if (window.innerWidth > 993) {

                marquee.addEventListener('mouseenter', function() {

                    clearInterval(endTimerRef);
    
                    timerRef = setInterval(() => {
    
                        let skew_x = getSkewX();
                        marquee.closest('article').dataset.skewX = skew_x;
    
                        updateItems(skew_x, mouse_velocity);
    
                    }, MARQUEES_REFRESH_TIME);
    
                });
    
                marquee.addEventListener('mouseleave', function() {
    
                    clearInterval(timerRef);
    
                    // let skew_x = getSkewX();
    
                    // let delta = skew_x < 0 ? 1 : -1;
    
                    let smooth_ms = 1000;
    
                    // let part_skew_x = skew_x / (smooth_ms / MARQUEES_REFRESH_TIME);
    
                    // alert(part_skew_x);
    
                    let mouse_delta = mouse_velocity > 0 ? -1 : 1;
    
                    let start_pos_x = [];
                    let end_pos_x = [];
    
                    let start_skew_x = getSkewX();
                    let end_skew_x = 0;
    
                    let l = 0;
                    items.forEach(item => {
                        
                        start_pos_x[l] = items_position.x[l];
                        end_pos_x[l] = start_pos_x[l] + 200 * mouse_velocity * -1;
    
                        l++;
    
                    });  
    
    
                    let i = 0;
                    endTimerRef = setInterval(() => {
    
                        if (i == (smooth_ms / MARQUEES_REFRESH_TIME)) {
                                
                            let k = 0;
                            items.forEach(item => {
                                
                                item.style.transform = 'translate3d(' + items_position.x[k] + 'px, 0, 0) skewX(0deg)';
    
                                k++;
    
                            });  
    
                            clearInterval(endTimerRef);
    
                            return;
    
                        }
    
                        start_skew_x = lerp(start_skew_x, end_skew_x, MARQUEES_REFRESH_TIME / smooth_ms);
    
                        let j = 0;
                        items.forEach(item => {
                            
                            // let new_pos_x = items_position.x[j] +  * mouse_delta;
                            start_pos_x[j] = lerp(start_pos_x[j], end_pos_x[j], MARQUEES_REFRESH_TIME / smooth_ms);
    
                            // console.log(start_pos_x[j]);
    
                            item.style.transform = 'translate3d(' + start_pos_x[j] + 'px, 0, 0) skewX(' + start_skew_x + 'deg)';
                            items_position.x[j] = start_pos_x[j];
                            item.dataset.tx = start_pos_x[j];
    
                            j++;
                        
                        });    
    
                        // skew_x += part_skew_x * -1;
    
                        i++;
    
                    }, MARQUEES_REFRESH_TIME); 
    
                    // - smooth end
    
                    /*
    
                    1-2s
    
                        skew 0
    
                        translate +-10px smooth
    
                        if mouse hover clear smooth end
    
                    */
    
                });

            } else {

                mouse_velocity = -0.15;

                timerRef = setInterval(() => {

                    if (marquee.closest('.experience--type') !== null) {

                        return;

                    }
 
                    updateItems(getSkewX(), mouse_velocity);

                }, MARQUEES_REFRESH_TIME);

            }

        });

        const themeSwitcher = document.querySelector('#theme_switcher');

        themeSwitcher.dataset.mouseTxt = document.documentElement.classList.contains('light-theme') ? 'Dark' : 'Light';

        themeSwitcher.addEventListener('click', () => {

            
            document.documentElement.classList.toggle('light-theme');
            
            localStorage.readTheme = document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
            themeSwitcher.dataset.mouseTxt = document.documentElement.classList.contains('light-theme') ? 'Dark' : 'Light';
            vars.mouse.dataset.txt = document.documentElement.classList.contains('light-theme') ? 'Dark' : 'Light';

            vars.updateFavicon();

        });


        if (typeof localStorage.readTheme !== typeof undefined) {

            switch (localStorage.readTheme) {

                case 'light':

                    document.documentElement.classList.add('light-theme');

                    themeSwitcher.dataset.mouseTxt = 'Dark';   
                    
                    vars.updateFavicon();

                    break;

            }

        }

        // - Experience lightbox lerping
        lightboxLerping.init(document.querySelector('#experience_lightbox'));

        console.clear();

        console.log('%cBienvenue sur mon site, si tu inspectes le code c\'est que toi aussi tu es du métier. Tu pourra retrouver prochainement tout le code source sur GitHub et/ou me signaler des éventuelles beugs via hello@mathias-blank.ch, merci et bonne visite :) !', "color:#ff6733;font-family:system-ui;font-size:clamp(18px, 1.5rem, 30px);font-weight:normal");

    });

});
