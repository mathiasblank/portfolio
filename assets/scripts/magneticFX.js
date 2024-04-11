var updateButtons;

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

});