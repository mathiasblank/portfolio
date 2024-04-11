define('vars', function () {

    var vars = {};

    vars.DOMReady = function(callbackFunction) {

        if (document.readyState != 'loading') {
    
            callbackFunction();
    
        } else {
    
            document.addEventListener("DOMContentLoaded", callbackFunction);
    
        }
    
    };

    vars.MENU_ACTIVE_CLASS = 'menu-active';

    vars.callbacks = {

        resize: [],
        afterHero : [],
        afterIntro : [],
        scroll: []
    
    };

    vars.scrollCallbacks = {

        active : []
        
    };

    // - Lerping function
    vars.lerp = (start, end, t) => {
        
        return start * (1 - t) + end * t;

    };

    vars.lerpEasing = 0.05; // - define timing easing lerping value

    vars.animationSpeed = {
        
        y : {

            slow: 0.05,
            normal: 0.07,
            fast: 0.15

        }

    };

    vars.isDev = false;

    vars.INTRO_DELAY = vars.isDev ? 0 : 2000;

    vars.updateFavicon = () => {

        console.log('update favicons');

        let links = document.querySelectorAll("link[rel='icon'], link[rel='apple-touch-icon']");

        links.forEach(link => {
        
            // let pattern = link.getAttribute('data-icon-pattern');
            let path = link.href.split('/');
            var favicon = path[path.length - 1];
            favicon = favicon.split('?')[0];
            path.pop();

            const readingTheme = localStorage.readTheme ?? 'dark';
            let colorTheme = localStorage.theme ?? 'neon-orange';
            colorTheme = colorTheme.replace('neon-', '');

            let newPath = `/app/public/img/favicon/${readingTheme}/${colorTheme}/${favicon}`;

            link.href = newPath + '?v=' + Date.now();

        });

    };

    return vars;

});





var removeTimerRef = null;

define('intro', ['vars', 'scroll', 'TransformText', 'Animations', 'TypeWriter', 'lerping'], function(vars, scroll, TransformText, Animations, TypeWriter, lerping) {

    vars.introBusy = true;

    // - Apply saved theme
    if (typeof localStorage.theme !== typeof undefined) {

        for (let i = 0; i < document.body.classList.length; i++) {

            const c = document.body.classList[i];

            if (c.includes('theme--')) {

                document.body.classList.remove(c);

            }

        }

        document.body.classList.add('theme--' + localStorage.theme);

        vars.updateFavicon();

    }

    // - DOM elements
    const intro = document.querySelector('.intro'),
        hero = document.querySelector('.hero'),
        half_window = window.innerHeight,
        template = document.querySelector('.template'),
        keywords = template.querySelectorAll('span'),
        crytTxts = hero.querySelectorAll('.crypt-txt'),
        scrollDown = hero.querySelector('.scroll-down');

    scrollDown.classList.add('up-and-down');

    document.addEventListener('scroll', e => {

        scrollDown.classList.remove('up-and-down');

    });

    var transformTextInstances = [];

    crytTxts.forEach(function(txt) {

        // let tTransform = TransformText.init(txt, 'fixed');
        let tTransform = TransformText.init(txt, 'fixed');

        transformTextInstances[txt.dataset.index] = tTransform;

    });

    // - Introduction
    setTimeout(() => {     
    
        intro.querySelectorAll('.anim--colored-txt').forEach(function(anim) {

            Animations.init(anim).show().hide('auto', function() {

                setTimeout(() => {
                    
                    intro.style.display = 'none';
                    hero.style.display = 'flex';

                    // - Scroll down
                    scrollDown.addEventListener('click', function() {

                        scrollDown.classList.remove('up-and-down');

                        window.scroll({
                            top: window.innerHeight * 0.9,
                            behavior: 'smooth'
                        });

                    });

                    const ps = hero.querySelectorAll('p');

                    // var delay = 0;
                    // var delays = [];
                    // var delay_index = 0;

                    var crypt_txts = [];
                    var types_writing = [];
                    var clones = [];

                    // - Init elements
                    ps.forEach(function(p) {

                        // - Crypt texts
                        p.querySelectorAll('.crypt-txt').forEach(function(txt) {

                            let tTransform = transformTextInstances[txt.dataset.index];

                            tTransform.init().crypt();

                            const clone = txt.cloneNode();

                            clone.classList.remove('crypt-txt', 'anim--show-and-hide', 'active');
                            clone.classList.add('anim--type-writing', 'clone');
                            clone.innerHTML = txt.innerHTML;

                            clones.push(clone);

                            p.appendChild(clone);

                            txt.style.display = 'none';
                            txt.classList.add('active');

                            crypt_txts.push(txt);

                        });

                    });

                    // - Play type writing animation
                    // var delay = vars.typeWriter(hero); 

                    let typeW = TypeWriter.init(hero);
                    typeW.print();

                    delay = vars.isDev ? 0 : typeW.getDelay(); // - to activate on prod
                    // delay = 0;

                    // - Intro animation is now finished
                    setTimeout(() => {

                        // - Hide clones
                        for (let i in clones) {

                            clones[i].style.display = 'none';

                        }

                        // - Show crypt txt
                        for (let i in crypt_txts) {

                            crypt_txts[i].style.display = 'inline-flex';

                        }

                        setTimeout(() => {

                            document.documentElement.classList.remove('no-overflow-f');
                            document.documentElement.style.overflowY = 'auto';
                            document.body.classList.remove('no-overflow-f');
                            document.body.classList.add('allow-to-navigate');
                            mouse.classList.add('allow-to-move', 'active');

                            scrollDown.classList.add('active');

                        }, 1000);

                        updateScrollsData(true);

                        keywords.forEach(function(keyword, key) {

                            crytTxts.forEach(function(txt) {

                                let index = parseInt(txt.dataset.index);

                                // - Crypt text find it new place
                                if (index == key) {

                                    let rect = keyword.getBoundingClientRect(),
                                        _rect = txt.getBoundingClientRect();
                                    txt.dataset.maxX = rect.x;
                                    txt.dataset.maxY = rect.y;
                                    txt.dataset.minX = _rect.x;
                                    txt.dataset.minY = _rect.y;

                                }

                            });

                        });

                        var maxScrollY = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
                            document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );
                
                        // - Footer
                        vars.callbacks.scroll.push(function() {

                            // console.log(window.scrollY + window.innerHeight, maxScrollY);

                            if (window.scrollY + window.innerHeight == maxScrollY) {

                                document.querySelector('.main--footer-contact').classList.add('active');

                            }

                        });

                        // - Sub Footer
                        document.querySelectorAll('.after-footer').forEach(afterFooter => {

                            const tw = TypeWriter.init(afterFooter);

                            lerping.addCallback(() => {

                                if (afterFooter.classList.contains('active')) return;

                                var rect = afterFooter.getBoundingClientRect();

                                if (rect.top < 50) {

                                    afterFooter.classList.add('active');

                                    key.type = 'white';

                                    tw.print(() => {

                                        key.element.style.transform = 'scale(1)';
                                        key.sprite_animation(true);

                                    });

                                }

                            });

                        });

                        // - Callbacks
                        for (let i = 0; i > vars.callbacks.afterHero.length; i++) {

                            vars.callbacks.afterHero[i]();
                
                        }

                        scrollDown.classList.add('active');

                        vars.introBusy = false;

                    }, delay);

                }, 1500);

            });

        });

        // - After intro callbacks
        for (let i = 0; i > vars.callbacks.afterIntro.length; i++) {

            vars.callbacks.afterIntro[i]();

        }

        // -----------------------------------------------------------
        //  Main menu
        // -----------------------------------------------------------
        
        const mainMenu = document.querySelector('#main_menu'),
              mainMenuTrigger = document.querySelector('#main_menu_trigger'),
              menuItems = mainMenu.querySelectorAll('.main-menu--item'),
              menuPreview = mainMenu.querySelector('.main-menu--preview');

        // -----------------------------------------------------------
        //  Main menu /
        //      Constants & variables
        // -----------------------------------------------------------

        var menuTxtTransforms = [],
            menuTxtTransformsIndex = 0;

        // - Init Crypt
        mainMenu.querySelectorAll('.marquee--inner').forEach(function(inner) {

            inner.querySelectorAll('span').forEach(function(txt) {

                let tTransform = TransformText.init(txt, 'static');
    
                tTransform.init().crypt(false, 'alpha');

                menuTxtTransforms.push(tTransform);

                txt.dataset.transformRef = menuTxtTransformsIndex;

                menuTxtTransformsIndex++;

            });

        });

        // - Play marquee when hover menu item.
        mainMenu.querySelectorAll('.main-menu--item > a').forEach(function(menuItem) {

            const linkedMarquee = mainMenu.querySelector('[data-menu-ref="' + menuItem.dataset.ref +'"]');

            const txts = linkedMarquee.querySelectorAll('span');

            let refTimer = null;

            menuItem.addEventListener('mouseenter', function() {

                clearTimeout(refTimer);

                linkedMarquee.classList.add('active');

                if (linkedMarquee.classList.contains('uncrypt')) return;

                linkedMarquee.classList.add('uncrypt');

                txts.forEach(function(txt) {

                    const tTransform = menuTxtTransforms[txt.dataset.transformRef];

                    tTransform.randommizeString(true);

                    setTimeout(function() {

                        tTransform.randommizeString(false);

                    }, 100);

                });

            });

            menuItem.addEventListener('mouseleave', function() {

                linkedMarquee.classList.remove('active');

            });

        });

        // - preview themes
        mainMenu.querySelector('.main-menu--items').addEventListener('mouseenter', function() {

            document.querySelector('.main-menu--preview--themes').classList.add('disabled');
            
        });

        document.querySelector('#main_menu').querySelector('.main-menu--items').addEventListener('mouseleave', function() {

            document.querySelector('.main-menu--preview--themes').classList.remove('disabled');
            
        });

        // -----------------------------------------------------------
        //  Main menu /
        //      open/close
        // -----------------------------------------------------------

        var menu_is_busy = false;
        mainMenuTrigger.addEventListener('click', function() {

            if (menu_is_busy) return;

            menu_is_busy = true;

            // - Experience lightbox
            if (document.body.classList.contains('experiences-lightbox-active')) {

                // - Clean ligthtbox
                vars.experiencesLightbox.classList.remove('ready');
                vars.experiencesLightbox.classList.add('closing');

                const activeArticle = vars.experiencesLightbox.querySelector('.experience.active');

                activeArticle.querySelector('h2').classList.remove('active');
                activeArticle.querySelector('header > span').classList.remove('active');
                activeArticle.classList.remove('ready');
                activeArticle.classList.remove('color-area-active');

                // - Clone title
                const triggerTitle = document.querySelector('.experience-item[data-reference="' + activeArticle.dataset.reference + '"] .experience-item--name');
    
                const rectEnd = triggerTitle.getBoundingClientRect();
    
                const animatedTitle = document.querySelector('#animated_title');
    
                const triggerTitleStyle = window.getComputedStyle(triggerTitle, null);

                animatedTitle.classList.add('active', 'back');
                
                setTimeout(() => {
                    
                    animatedTitle.classList.add('transition-active');
                    animatedTitle.style.fontSize = triggerTitleStyle.getPropertyValue('font-size');
                    animatedTitle.style.top = (rectEnd.y + window.scrollY) + 'px';
                    animatedTitle.style.left = animatedTitle.dataset.initLeft;


                    setTimeout(() => {

                        animatedTitle.style.color = triggerTitleStyle.getPropertyValue('color');

                    }, 300);

                }, 100);


                setTimeout(() => {

                    document.documentElement.classList.remove('no-overflow-f');
                    document.body.classList.remove('experiences-lightbox-active', 'no-overflow-f');
                    vars.experiencesLightbox.classList.remove('closing');
                    activeArticle.classList.remove('active', 'color-area-active');
                    animatedTitle.classList.remove('active', 'transition-active', 'back');

                    mouse.dataset.txt = 'Menu';

                    updateScrollsData();
    
                    menu_is_busy = false;

                }, 1000);

                setTimeout(() => {

                    updateScrollsData();

                }, 3000);


                return;

            }

            document.documentElement.classList.toggle('no-overflow-f');
            document.body.classList.toggle('no-overflow-f');

            const is_menu_active = document.body.classList.contains('menu-active');

            document.body.classList.toggle('menu-active');
            mainMenuTrigger.dataset.mouseTxt = is_menu_active ? 'Menu' : 'Fermer';
            mouse.dataset.txt = mainMenuTrigger.dataset.mouseTxt;

            if (!is_menu_active) {

                var t = 1000;

                // - Menu items
                menuItems.forEach(function(item, key) {

                    setTimeout(() => {

                        item.classList.add('active');
        
                        item.querySelector('span').classList.add('active');

                    }, 200 * key);

                });

                // - Preview
                setTimeout(() => {

                    menuPreview.classList.add('active');

                    menu_is_busy = false;

                }, t);

            } else {

                menuItems.forEach(function(item) {

                    item.classList.remove('active');
                    
                    item.querySelector('span').classList.remove('active');
                    
                });

                menuPreview.classList.remove('active');
                    
                menu_is_busy = false;

            }

        });

        // -----------------------------------------------------------
        //  Main menu /
        //      nav items
        // -----------------------------------------------------------

        mainMenu.querySelectorAll('.main-menu--item').forEach(function(item) {

            item.addEventListener('click', function() {

                const link = item.querySelector('a');

                document.body.classList.remove('menu-active');

                const section = document.querySelector('#' + link.dataset.ref);

                if (section === null) return;

                const y = section.getBoundingClientRect().top + window.scrollY;
                window.scroll({
                    top: y,
                    behavior: 'smooth'
                });

                mainMenuTrigger.dataset.mouseTxt = 'Menu';

                document.documentElement.classList.toggle('no-overflow-f');
                document.body.classList.toggle('no-overflow-f');

            });

        });

        // -----------------------------------------------------------
        //  Themes
        // -----------------------------------------------------------
        
        // -----------------------------------------------------------
        //  Themes /
        //      Functions
        // -----------------------------------------------------------

        // - Get current active theme
        const getThemeClass = () => {

            var currentTheme = null;

            for (let i = 0; i < document.body.classList.length; i++) {

                const c = document.body.classList[i];

                if (c.includes('theme--')) {

                    currentTheme = c;

                }

            }

            return currentTheme;

        };

        // -----------------------------------------------------------
        //  Themes /
        //      Constants & variables
        // -----------------------------------------------------------

        const previewThemeItems = document.querySelectorAll('.main-menu--preview--theme');

        var currentTheme = getThemeClass();

        // -----------------------------------------------------------
        //  Themes /
        //      Main
        // -----------------------------------------------------------

        // - Set current active theme
        previewThemeItems.forEach(function(item) {

            if (currentTheme.includes(item.dataset.theme)) {

                item.classList.add('active');

            }

        });
        
        // - Manage preview item events
        previewThemeItems.forEach(function(element) {
            
            element.addEventListener('mouseenter', function() {

                var currentTheme = getThemeClass();
                    elementTheme = 'theme--' + element.dataset.theme;

                if (currentTheme === elementTheme) return;

                // - Change theme
                document.body.classList.remove(currentTheme);
                document.body.classList.add(elementTheme);

                localStorage.theme = element.dataset.theme;

                vars.updateFavicon();

                // - Remove active class
                previewThemeItems.forEach(function(item) {

                    if (item === element) {

                        item.classList.add('active');

                    } else {

                        item.classList.remove('active');

                    }

                });

            });
        
        });

        // -----------------------------------------------------------
        //  Crypt Texts
        // -----------------------------------------------------------

        document.querySelector('main').querySelectorAll('.crypt-txt').forEach(function(txt) {

            let tTransform = TransformText.init(txt, 'static');

            tTransform.init().crypt();

            txt.addEventListener('mouseenter', function() {

                if (!txt.classList.contains('multiple') && (txt.classList.contains('uncrypt') || txt.classList.contains('uncrypting'))) {
                    
                    document.body.classList.remove('mouse-crypt-active');

                    return;

                }

                tTransform.randommizeString(true);

                txt.classList.add('uncrypting');

                setTimeout(function() {
                    
                    txt.classList.add('uncrypt');

                    txt.classList.remove('uncrypting');

                    tTransform.randommizeString(false);

                    document.body.classList.remove('mouse-crypt-active');

                }, 1500);
    
                document.body.classList.add('mouse-crypt-active');
                clearTimeout(removeTimerRef);
                mouse.classList.add('delayed');

            });

            txt.addEventListener('mouseleave', function() {

                document.body.classList.remove('mouse-crypt-active');

                removeTimerRef = setTimeout(() => {
                
                    mouse.classList.remove('delayed');
                    
                }, 400);


            });

        });

        lerping.addCallback((current) => {
    
            if (vars.introBusy) return;

            const percentage = (current * 100) / (window.innerHeight / 2);
    
            if (current <= (window.innerHeight / 2)) {
    
                crytTxts.forEach(function(txt, key) {
    
                    let min = {x : parseFloat(txt.dataset.minX), y : parseFloat(txt.dataset.minY)},
                        max = {x : parseFloat(txt.dataset.maxX), y : parseFloat(txt.dataset.maxY)},
                        diff = {
                            x: min.x > max.x ? min.x - max.x : max.x - min.x,
                            y: min.y > max.y ? min.y - max.y : max.y - min.y
                        };
                    
                    // - Highlight keyword
                    if (percentage > 1 && !txt.classList.contains('highlight')) {
    
                        txt.classList.add('highlight');
    
                    }
    
                    // - Crypt / Uncrypt keyword
                    if (percentage > 10 && !txt.classList.contains('uncrypt')) {
    
                        let tr = transformTextInstances[txt.dataset.index];
    
                        tr.randommizeString(true);
    
                        txt.classList.add('uncrypt');
    
                    } 
                    
                    // else if (percentage < 10 && txt.classList.contains('uncrypt')) {
    
                    //     let tr = transformTextInstances[txt.dataset.index];
    
                    //     tr.randommizeString(false);
    
                    //     setTimeout(() => {
    
                    //         tr.crypt(true);
    
                    //     }, 1000);
    
                    //     txt.classList.remove('uncrypt');
    
                    // }
    
                    // - Reval keyword to user
                    if (percentage >= 95 && !txt.classList.contains('final')) {
    
                        let tr = transformTextInstances[txt.dataset.index];
    
                        tr.randommizeString(false);
    
                        txt.classList.add('final');
    
                    } else if (percentage < 95 && txt.classList.contains('final')) {
    
                        txt.classList.remove('final');
    
                    }
    
                    // - Calculate position's keyword
                    var new_value = {};
    
                    if (min.x > max.x) {
    
                        new_value.x = ((100 - percentage) * diff.x) / 100;
    
                        new_value.x += max.x;
    
                    } else if (min.x <= max.x) {
    
                        new_value.x = (percentage * diff.x) / 100;
    
                        new_value.x += min.x;
                        
                    }
    
                    if (min.y > max.y) {
    
                        new_value.y = ((100 - percentage) * diff.y) / 100;
    
                        new_value.y += max.y;
    
                    } else if (min.y <= max.y) {
    
                        new_value.y = (percentage * diff.y) / 100;
    
                        new_value.y += min.y;
                        
                    }
    
                    txt.style.left = new_value.x + 'px';
                    txt.style.top = new_value.y + 'px';
    
                });
    
            } else if (current > (window.innerHeight / 2)) {
    
                crytTxts.forEach(function(txt) {
    
                    let min = {x : parseFloat(txt.dataset.minX), y : parseFloat(txt.dataset.minY)},
                        max = {x : parseFloat(txt.dataset.maxX), y: parseFloat(txt.dataset.maxY)};
    
                    txt.style.left = max.x + 'px';
                    txt.style.top = max.y + 'px';
    
                });
    
            }
    
            // - Manage scroll down visibility
            if (percentage > 10 && scrollDown.classList.contains('active')) {
    
                scrollDown.classList.remove('active');
    
    
            } else if (percentage <= 10 && !scrollDown.classList.contains('active')) {
    
                scrollDown.classList.add('active');
    
            }
    
            // - Manage keywords and it template visibility
            if (percentage >= 200 && !document.body.classList.contains('intro-ok')) {
    
                crytTxts.forEach(function(txt, key) {
    
                    txt.classList.remove('active');
    
                    // document.documentElement.classList.add('no-overflow-f');
                    // document.body.classList.add('no-overflow-f');
    
                });
    
                setTimeout(() => {
    
                    document.body.classList.add('intro-ok');
                    // document.documentElement.classList.remove('no-overflow-f');
                    // document.body.classList.remove('no-overflow-f');
    
                }, 1010);
    
            } else if (percentage < 200 && document.body.classList.contains('intro-ok')) {
    
                crytTxts.forEach(function(txt, key) {
    
                    txt.classList.add('active');
    
                });
    
                document.body.classList.remove('intro-ok');
    
            }
    
        });

    }, vars.INTRO_DELAY);

});var updateButtons;

define('magneticFX', ['vars', 'mouse'], function(vars, mouseObject) { 

    // - DOM objects
    const magnetic_buttons = document.querySelectorAll('.magnetic-button'),
        magnetic_letters = document.querySelectorAll('.magnetic-letter');

    // - Classes
    const BODY_BUTTON_MAGNETIC_FX_ACTIVE_CLASS = 'magnetic-button-fx-active',
        BODY_LETTER_MAGNETIC_FX_ACTIVE_CLASS = 'magnetic-fx-letter-active',
        MAGNETIC_FX_ACTIVE_CLASS = 'magnetic-fx-active';

    const canUse = function() {

        return !document.body.classList.contains(vars.MENU_ACTIVE_CLASS) && !document.body.classList.contains('experiences-lightbox-active');

    };

    // - Define content's rectangle
    updateButtons = function() {

        magnetic_buttons.forEach(function(button) {

            const content = button.querySelector('.magnetic-button--txt'),
                content_rect = content.getBoundingClientRect();

            // - Init position
            button.dataset.initX = content_rect.left;
            button.dataset.initY = content_rect.top;

            // - Size
            button.dataset.width = content_rect.width;
            button.dataset.height = content_rect.height;

        });

        magnetic_letters.forEach(function(letter) {

            const content = letter.querySelector('.magnetic-letter--inner'),
                content_rect = content.getBoundingClientRect();

            // - Init position
            letter.dataset.initX = content_rect.left;
            letter.dataset.initY = content_rect.top;

            // - Size
            letter.dataset.width = content_rect.width;
            letter.dataset.height = content_rect.height;

        });


    };

    // - Update buttons only when it's necessary
    window.addEventListener('scroll', updateButtons);
    updateButtons();

    // - Client move it mouse
    document.addEventListener('mousemove', function(e) {

        var disable_smooth_mouse = false;

        // - Magnetic buttons
        magnetic_buttons.forEach(function(button) {

            // - Disabled When lightbox are opened.
            if (!canUse() && button.closest('.experience-lightbox').length == 0) return;

            const rect = button.getBoundingClientRect();

            const content = button.querySelector('.magnetic-button--txt');

            // - Enable magnetic effect
            if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {

                mouse.classList.add('delayed');
                clearTimeout(removeTimerRef);

                if (!button.classList.contains(MAGNETIC_FX_ACTIVE_CLASS)) {

                    setTimeout(function() {

                        button.classList.add(MAGNETIC_FX_ACTIVE_CLASS);
                        document.body.classList.add(BODY_BUTTON_MAGNETIC_FX_ACTIVE_CLASS);

                    }, 100);

                }

                // console.log(e.clientY, button.dataset.initY, window.scrollY);

                // - Update content's postion
                diff_X = e.clientX - parseFloat(button.dataset.initX);
                diff_Y = e.clientY - parseFloat(button.dataset.initY);

                // - Center content
                diff_X -= parseFloat(button.dataset.width) / 2;
                diff_Y -= parseFloat(button.dataset.height) / 2;

                // - Apply style to matrix
                content.style.transform = 'translate3d(' + diff_X + 'px,' + diff_Y + 'px, 0)';

                disable_smooth_mouse = true;

            } 
            // - Disable magnetic effect
            else if (button.classList.contains(MAGNETIC_FX_ACTIVE_CLASS)) {

                button.classList.remove(MAGNETIC_FX_ACTIVE_CLASS);
                document.body.classList.remove(BODY_BUTTON_MAGNETIC_FX_ACTIVE_CLASS);

                removeTimerRef = setTimeout(() => {
                    
                    mouse.classList.remove('delayed');
                    
                }, 400);

                content.style.transform = 'translate3d(0, 0, 0)';

            }

        });

        magnetic_letters.forEach(function(letter) {

            // - Disabled When lightbox are opened.
            if (!canUse() && button.closest('.experience-lightbox').length == 0) return;

            const rect = letter.getBoundingClientRect(),
                content = letter.querySelector('.magnetic-letter--inner');

            // - Enable magnetic effect
            if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {

                mouse.classList.add('delayed');
                clearTimeout(removeTimerRef);

                if (!letter.classList.contains(MAGNETIC_FX_ACTIVE_CLASS)) {


                    setTimeout(function() {

                        letter.classList.add(MAGNETIC_FX_ACTIVE_CLASS);
                        document.body.classList.add(BODY_LETTER_MAGNETIC_FX_ACTIVE_CLASS);

                    }, 100);

                }

                // console.log(e.clientY, button.dataset.initY, window.scrollY);

                // - Update content's postion
                diff_X = e.clientX - parseFloat(letter.dataset.initX);
                diff_Y = e.clientY - parseFloat(letter.dataset.initY);

                // - Center content
                diff_X -= parseFloat(letter.dataset.width) / 2;
                diff_Y -= parseFloat(letter.dataset.height) / 2;

                // - Apply style to matrix
                content.style.transform = 'translate3d(' + diff_X + 'px,' + diff_Y + 'px, 0)';

                disable_smooth_mouse = true;

            } 
            // - Disable magnetic effect
            else if (letter.classList.contains(MAGNETIC_FX_ACTIVE_CLASS)) {

                letter.classList.remove(MAGNETIC_FX_ACTIVE_CLASS);
                document.body.classList.remove(BODY_LETTER_MAGNETIC_FX_ACTIVE_CLASS);
                
                removeTimerRef = setTimeout(() => {
                    
                    mouse.classList.remove('delayed');
                    
                }, 400);

                content.style.transform = 'translate3d(0, 0, 0)';

            }


            if (mouseObject.isSmoothEffectActive && disable_smooth_mouse) {

                mouseObject.disabledSmoothEffect();

            } else if (!mouseObject.isSmoothEffectActive && !disable_smooth_mouse) {

                mouseObject.enabledSmoothEffect();

            }


        });

    });

});define('mouse', ['vars'], function(vars) {

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

});var updateScrollsData, updateOnScroll, getScrollbarWidth;

define('scroll', ['vars'], function(vars) {


    const getScrollbarWidth = () => {

        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);        

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;

    };


    vars.DOMReady(function() {


        /***************************************************************************************
         * 
         * Global variables
         * 
        ***************************************************************************************/

        var scrollsData = [];   // - All information about scroll and animation section are stocked into this array.

        var scrollBarWidth = getScrollbarWidth();

        var scrollData = {
            y: window.scrollY,
            down : 0,
            lastY : null
        };

        var windowSizes = {width: window.innerWidth, height: window.innerHeight},
            last_windowSizes = null;

        /***************************************************************************************
         * 
         * DOM objects
         * 
        ***************************************************************************************/

        // - Main sections
        // const sections = document.querySelectorAll('main > section');

        const scrolls = document.querySelectorAll('.scroll');

        /***************************************************************************************
         * 
         * Tools
         * 
        ***************************************************************************************/

        // - Tools: get element vertical limits
        const getElementLimit = function(element) {

            const rect = element.getBoundingClientRect();

            var offset = 0;

            var limits = {
                top: rect.top,
                bottom: rect.bottom
            };



            // if (element.dataset.)

            var parentScroll = null;

            if (typeof element.dataset.scrollUseParent !== typeof undefined) {

                if (typeof element.dataset.scrollUseParent == 'string') {

                    parentScroll = element.closest(element.dataset.scrollUseParent);

                } else {

                    parentScroll = element.closest('.scroll');

                }

                // console.log(typeof element.dataset.scrollUseParent, parentScroll);

                if (parentScroll !== null) {

                    const parentRect = parentScroll.getBoundingClientRect();

                    limits.top = parentRect.top;
                    limits.bottom = parentRect.bottom;

                    // console.log('parentRect', parentScroll, parentRect);

                }

            }

            if (typeof element.dataset.scrollOffset !== typeof undefined) {

                if (element.dataset.scrollOffset.includes('|')) {

                    const _offsets = element.dataset.scrollOffset.split('|');

                    // console.log('split offset',rect, limits, parseInt(_offsets[0]), parseInt(_offsets[1]));

                    limits.top += parseInt(_offsets[0]) * (window.innerHeight / 100);
                    limits.bottom += parseInt(_offsets[1]) * (window.innerHeight / 100);

                } else {

                    limits.bottom += parseInt(element.dataset.scrollOffset) * (window.innerHeight / 100);

                }

            }

            if (parentScroll === null && typeof element.dataset.scrollSelfDefined === typeof undefined) {

                limits.top = limits.bottom - window.innerHeight;

                // limits.top += window.scrollY;
                // limits.bottom += window.scrollY;

            }

            // const scrollContainer = typeof element.dataset.scrollContainer !== typeof undefined ? document.querySelector(element.dataset.scrollContainer) : window;


            if (typeof element.dataset.scrollContainer === typeof undefined) {

                limits.top += window.scrollY;
                limits.bottom += window.scrollY;

            }

            return limits;

        };

        /***************************************************************************************
         * 
         * Navigation color
         * 
        ***************************************************************************************/

        // - Body theme and background color
        // const updateNavigationColor = function() {

        //     sections.forEach(function(section, key) {

        //         const limits = getElementLimit(section);

        //         if (window.scrollY >= limits.top + (windowSizes.height / 2) && window.scrollY <= limits.bottom + (windowSizes.height / 2)) {

        //             document.body.style.backgroundColor = section.dataset.bgColor;

        //         }

        //     });

        // };

        /***************************************************************************************
         * 
         * Update scroll data
         * 
        ***************************************************************************************/

        updateScrollsData = function(init) {

            scrolls.forEach(function(element, key) {

                // - Init unchanged data
                if (init) {

                    const container = element.querySelector('.scroll--container'),
                        anims = element.querySelectorAll('.scroll--anim-item');

                    scrollsData[key] = {

                        belowNextSection : typeof element.dataset.belowNextSection == 'string' && element.dataset.belowNextSection == 'true',
                        animsData : {},
                        container : null,
                        anims : [element],
                        classes : {
                            active : 'active' || element.dataset.activeClass,
                            before : null || element.dataset.beforeClass,
                            after : null || element.dataset.afterClass
                        }

                    };

                    if (container !== null) {

                        scrollsData[key].container = container;
                        scrollsData[key].anims = anims;

                    }

                } 

                // - Update or init limits
                scrollsData[key]._limits = getElementLimit(element);
                scrollsData[key].animLimits = getElementLimit(element);

                // // - Adapts limits to nav offsets
                // const _offsets_str = element.dataset.scrollOffset;
                // if (typeof _offsets_str == 'string') {
                //     const _offsets = _offsets_str.split('-');
                //     scrollsData[key].animLimits.top += parseInt(_offsets[0]);
                //     scrollsData[key].animLimits.bottom += parseInt(_offsets[1]);
                // }

                // - Init anims data
                if (init) {

                    scrollsData[key].anims.forEach(function(anim, k) {

                        // console.log(anim.dataset.scrollAnimData);

                        if (typeof anim.dataset.scrollAnimData !== typeof undefined) {
        
                            scrollsData[key].animsData[k] = JSON.parse(anim.dataset.scrollAnimData);

                        }

                    });

                }

            });

        };

        /***************************************************************************************
         * 
         * Init on load
         * 
        ***************************************************************************************/
        
        updateScrollsData(true);

        /***************************************************************************************
         * 
         * Scroll event
         * 
        ***************************************************************************************/

        const getAnimationPropertyValue = function(data, percentage) {

            let _p_limits = [],
            _values = [];

            let i = 0;
            for (n in data) {

                // console.log(n, data, data[n], typeof data[n]);

                _p_limits.push(n);

                let a = [];

                a = data[n].split(/(\d+\.?\d?)/);

                // console.log(a);

                _values.push({

                    operator : a[0],
                    value: a[1],
                    unity: a[2],
                    number : parseFloat(data[n]),
                    percentage : n,

                });

            }

            let values = [];
            values[0] = _values[0];
            values[1] = _values[_values.length - 1];
            
            let p_limits = [];
            p_limits[0] = _p_limits[0];
            p_limits[1] = _p_limits[_p_limits.length - 1];

            // let p_limits = _p_limits;

            // - Find correct range
            if (_values.length > 2) {

                for (let index = 0; index < _values.length; index++) {

                    const d = _values[index];

                    if (d.percentage < percentage && typeof _values[index + 1] !== typeof undefined) {

                        values[0] = _values[index];
                        values[1] = _values[index + 1];

                        p_limits[0] = _values[index].percentage;
                        p_limits[1] = _values[index + 1].percentage;

                    }
                    
                }

            }

            // - Define unity
            let unity = '';
            if (values[0].unity !== '') unity = values[0].unity;
            else if (values[1].unity !== '') unity = values[1].unity;
            else unity = '';

            // - Prepare data for calcul
            let diff = values[0].number > values[1].number ? values[0].number - values[1].number : values[1].number - values[0].number,
            // let diff = values[0].number - values[1].number;
                diff_p = p_limits[1] - p_limits[0],
                delta = 100 / diff_p,
                new_value = 0,
                _p_limits_min = p_limits[0] == 0 ? 1 : p_limits[0];
                d_percentage = percentage * delta; // - percentage for calculs

            // - Define new value
            if (percentage <= p_limits[0]) {

                new_value = values[0].number;

            } else if (percentage >= p_limits[1]) {
                
                new_value = values[1].number;

            } else if (values[0].number > values[1].number) {

                new_value = ((diff_p - (percentage - p_limits[0])) * diff) / diff_p;
                new_value += values[1].number;

            } else if (values[0].number <= values[1].number) {
                
                new_value = ((percentage - p_limits[0]) * diff) / diff_p;
                new_value += values[0].number;

            }

            return {
                value: new_value,
                unity: unity
            };

        }

        const getAnimationValues = function(json, percentage) {

            let styles = [];

            for (let property in json) {

                switch (property) {

                    case 'transform' :
                        
                        let transforms = [];

                        for (let property in json.transform) {
                            
                            let data = getAnimationPropertyValue(json.transform[property], percentage);

                            if (data.unity == '') data.unity = 'px';

                            transforms.push(property + "(" + data.value + data.unity + ")");

                        }

                        styles.push('transform: ' + transforms.join(' '));

                        break;

                    default :

                        let data = getAnimationPropertyValue(json[property], percentage);

                        // console.log(data);

                        styles.push(property + ":" + data.value + data.unity);

                        break;

                }

            }

            return styles;

        }

        const updateDataAnim = function(data, percentage) {

            data.anims.forEach(function(anim, k) {

                let json = data.animsData[k];

                // - Calculating styles
                styles = getAnimationValues(json, percentage);

                // if (percentage > 0 && percentage < 100) {

                //     console.log(json, styles);

                // }

                // - Set styles
                anim.style = styles.join(";");

            });

        }

        updateOnScroll = function() {

            // updateScrollsData();

            scrolls.forEach(function(element, key) {

                const data = scrollsData[key];

                let _limits = data._limits;
                    animLimits = data.animLimits;

                let containerScrollY = typeof element.dataset.scrollContainer !== typeof undefined ? document.querySelector(element.dataset.scrollContainer).scrollTop : window.scrollY;

                // console.log(containerScrollY);

                const percentage = ((containerScrollY - animLimits.top) * 100) / (animLimits.bottom - animLimits.top);
                    
                if (typeof element.dataset.scrollOffset == 'undefined') {

                    // console.log(percentage);

                }

                // console.log(element, animLimits);


                element.dataset.limits = JSON.stringify(data.animLimits);
                element.dataset.percentage = percentage;
                element.dataset.scrollY = containerScrollY;

                /**********************************************************************************************
                // - Scroll animation
                **********************************************************************************************/

                if (containerScrollY >= animLimits.top && containerScrollY < animLimits.bottom) {

                    updateDataAnim(data, percentage);

                    if (!element.classList.contains('active')) {

                        for (const index in vars.scrollCallbacks.active) {

                            vars.scrollCallbacks.active[index](element);
        
                        }

                    }

                    element.classList.add('active');

                    element.classList.remove('before', 'after', 'close');

                } else if (containerScrollY < animLimits.top && !element.classList.contains('before')) {

                    updateDataAnim(data, 0);

                    element.classList.add('before');

                    if (typeof element.dataset.scrollActiveOnce === typeof undefined) {

                        element.classList.remove('active');

                    }

                } else if (containerScrollY >= animLimits.bottom && !element.classList.contains('after')) {

                    updateDataAnim(data, 100);

                    element.classList.add('after');

                    if (typeof element.dataset.scrollActiveOnce === typeof undefined) {
                        
                        element.classList.remove('active');
                        element.classList.add('close');
                        
                    }

                }

                /**********************************************************************************************
                // - Scroll container
                **********************************************************************************************/
                
                if (data.container !== null) {

                    // console.log('container active');

                    const container = data.container;

                    // updateScrollsData();

                    let limit_top = _limits.top == 0 ? _limits.top : _limits.top + window.innerHeight,
                        limit_bottom = _limits.top == 0 ? _limits.bottom - windowSizes.height : _limits.bottom;

                    // console.log('container active', _limits, limit_top,  limit_bottom);


                    if (data.belowNextSection) {

                        limit_bottom = _limits.top == 0 ? _limits.bottom : _limits.bottom + windowSizes.height;

                    }

                    limit_top = _limits.top;
                    limit_bottom = _limits.bottom;

                    
                    limit_bottom = animLimits.bottom;
                    // console.log(limit_bottom);

                    if (
                        !element.classList.contains('active') 
                        && (
                            containerScrollY >= limit_top
                            && containerScrollY <= limit_bottom
                        )
                    ) {

                        element.classList.add('active');
                        element.classList.remove('after');

                    }
                    // - Container behaviour after scrolling animation
                    else if (element.classList.contains('active') && containerScrollY > limit_bottom) {

                        element.classList.add('after');
                        element.classList.remove('active');

                        // container.style.left = scrollBarWidth + 'px';

                    } 
                    // - Container behaviour before scrolling animation
                    else if (
                        element.classList.contains('active')
                        && (
                            (scrollData.down == 1 && containerScrollY < _limits.top) 
                            || (scrollData.down == -1 && containerScrollY < limit_top)    
                        )
                    ) {

                        element.classList.remove('active');

                    }

                }

            });

        }

        vars.callbacks.scroll.push(function() {

            let _scrollY = scrollData.y;
            scrollData.y = window.scrollY;

            if (scrollData.lastY != 0) {

                scrollData.down = scrollData.y > scrollData.lastY ? 1 : -1;

            }

            updateOnScroll();

            scrollData.lastY = _scrollY;

        });

        /***************************************************************************************
         * 
         * Resize event
         * 
        ***************************************************************************************/

        vars.callbacks.resize.push(function() {

            last_windowSizes = windowSizes;

            windowSizes = {width: window.innerWidth, height: window.innerHeight};

            scrollBarWidth = getScrollbarWidth();

            updateScrollsData();

        });

    });

});define('experiences', ['vars', 'scroll', 'mouse', 'TransformText', 'Animations', 'Incrementors', 'lerping', 'scroll_bar_width', 'lightbox-lerping'], function(vars, scroll, mouse, TransformText, Animations, Incrementor, lerping, scroll_bar_width, lightboxLerping) {


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

});const TRANSITION_OFF_CLASS = 'transition-off',
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

});/*******************************************************************

    Tools / Scroll bar width

    Version: 1.0.0
    Created @: 08.10.2021
    Source: https://stackoverflow.com/questions/8079187/how-to-calculate-the-width-of-the-scroll-bar

*****************************************************************/

define('scroll_bar_width', function() {

    // - Create elements to calculate the client browser scroll bar width.
    function getScrollBarWidth () { 

        var inner = document.createElement('p'); 
        inner.style.width = "100%"; 
        inner.style.height = "200px"; 
        
        var outer = document.createElement('div'); 
        outer.style.position = "absolute"; 
        outer.style.top = "0px"; 
        outer.style.left = "0px"; 
        outer.style.visibility = "hidden"; 
        outer.style.width = "200px"; 
        outer.style.height = "150px"; 
        outer.style.overflow = "hidden"; 
        outer.appendChild (inner); 
        
        document.body.appendChild (outer); 
        var w1 = inner.offsetWidth; 
        outer.style.overflow = 'scroll'; 
        var w2 = inner.offsetWidth; 
        if (w1 == w2) w2 = outer.clientWidth; 
        
        document.body.removeChild (outer); 

        console.log(w1, w2, w1 - w2);
        
        return w1 - w2; 

    }

    return {

        width : function() {

            return getScrollBarWidth();

        }

    };

});define('lightbox-lerping', ['vars'], function(vars) {

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

});define('Animations', function() {

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

});define('TransformText', function() {

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

});define('TypeWriter', function() {

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
