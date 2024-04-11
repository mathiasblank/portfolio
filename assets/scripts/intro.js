
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

});