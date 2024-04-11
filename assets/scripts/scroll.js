var updateScrollsData, updateOnScroll, getScrollbarWidth;

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

});