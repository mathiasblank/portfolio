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




