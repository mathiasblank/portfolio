const { init } = require("grunt");

define('marquees', ['vars'], function(vars) {

    const marquees = document.querySelectorAll('.marquee');

    marquees.forEach(function(marquee) {

        const inner = marquee.querySelector('.marquee--inner'),
              items = inner.querySelectorAll('span');
        
        const speed = marquee.dataset.speed || 2000;
        
        marquee.style.setProperty('--marquee-speed', speed.toString().replace('ms', '') + 'ms');

        var item_width = 0;

        var last_item_index = items.length - 1;
        
        var ref = 0;

        function init() {

            items.forEach(function(item, key) {

                let rect = item.getBoundingClientRect();

                if (key == 0) {

                    item_width = rect.width;

                }

                item.dataset.tx = 0;
                item.dataset.tInitX = rect.left;

            });

        }

        function play() {
            
            // - First execution
            items.forEach(function(item) {

                item.dataset.tx -= item_width;
                item.style.transform = 'translate3d(' + item.dataset.tx + 'px, 0, 0)';

            });

            ref = setInterval(() => {
                
                items.forEach(function(item, key) {

                    item.dataset.tx -= item_width;
                    item.style.transform = 'translate3d(' + item.dataset.tx + 'px, 0, 0)';

                    let rect = item.getBoundingClientRect();

                    // - Item is now out of view and must be replaced.
                    if (rect.right <= 0) {

                        // console.log(item);

                        // - Replace item at the end of the queue.
                        item.classList.add('replacing');

                        let right = items[last_item_index].getBoundingClientRect().right;
                        
                        // - Define new position
                        let diff = right - parseFloat(item.dataset.tInitX) - item_width;
                        
                        item.dataset.tx = diff;
                        item.style.transform = 'translate3d(' + item.dataset.tx + 'px, 0, 0)';

                        last_item_index = key;

                        // - Remove replacing class
                        setTimeout(() => {

                            item.classList.remove('replacing');

                        }, 100);

                    }

                });

            }, speed);

        }

        function stop() {

            marquee.style.setProperty('--marquee-speed', 0);
            clearInterval(ref);

        }

        var resize_ref = null;

        window.addEventListener('resize', function() {

            clearTimeout(resize_ref);
            
            resize_ref = setTimeout(() => {
                
                stop();
                init();
                play();

            }, 300);

        });

        init();
        play();

    });

});