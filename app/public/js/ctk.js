
// ------------------------------------------------------------------------------------------------------------------------------------
// - Catch the key
// ------------------------------------------------------------------------------------------------------------------------------------
    
const ctk = {

    is_game_mode_activated : false,
    game_state : -1,
    player_ctk_index : 0,
    level : 1,
    player_game_index : 0,
    nb_click_level : 0,
    nb_click : 0,
    score : 0,

    msg : {
        t_catch:                'Catched!',
        t_play:                 'Play',
        t_pause:                'Pause',
        t_new_level:            'Click me if you can',
        t_party:                'Partie ',
        t_key_click_pause:      'Pause café!',
        t_level:                'Niveau ',
        t_nb_click:             'Nombre de clic',
        t_nb_clicks:            'Nombre de clics',
        t_time:                 'Temps',
        t_score:                'Score'
    },
    elements : {

        game_area : document.querySelector('#ctk_area'),
        stats_btn : document.querySelector('#ctk_stats_btn'),
        help_btn : document.querySelector('#ctk_help_btn'),
        stats : document.querySelector('#ctk_stats'),
        help : document.querySelector('#ctk_help'),
        social_networks : document.querySelector('#sn_ctk_area'),
        flash_msg : document.querySelector('#ctk_flash_msg'),
        level_msg : document.querySelector('#ctk_level_msg'),
        level_indic : document.querySelector('#ctk_level_indic'),
        manager_btn : document.querySelector('#ctk_manager_btn'),
        min : document.querySelector('#ctk_time_min'),
        sec : document.querySelector('#ctk_time_sec'),
        cen : document.querySelector('#ctk_time_cen'),
        time : document.querySelector('#ctk_time'),
        focuses : document.querySelectorAll('.ctk-focus')

    },

    time : {

        is_time_active : false,
        min : 0,
        sec : 0,
        cen : 0,
        time : 0,
        compte : 0

    },
    // - Gestions des clics et des impacts
    impact : {

        impacts : [],
        template : document.querySelector('.ctk-impact'),
        impact_stay_time : 1500

    }

};

ctk.elements.header = ctk.elements.game_area.querySelector('header');
ctk.elements.stats_content = ctk.elements.stats.querySelector('.ctk-stats--inner-content');
ctk.elements.play = ctk.elements.game_area.querySelector('.ctk-toggle-play[data-action="play"]');
ctk.elements.pause = ctk.elements.game_area.querySelector('.ctk-toggle-play[data-action="pause"]');

var msg_busy = false;

ctk.addFlashMsg = (message) => {

    if (msg_busy) return;

    msg_busy = true;

    ctk.elements.flash_msg.innerHTML = message;
    ctk.elements.flash_msg.classList.add('active');

    setTimeout(() => {

        ctk.elements.flash_msg.classList.remove('active');

        msg_busy = false;

    }, 1000);

};

// - Timing function
ctk.time.pause = () => {

    ctk.time.is_time_active = false;
    clearTimeout(ctk.time.compte);

};

ctk.time.run = () => {

    ctk.time.cen++;
    if (ctk.time.cen > 9) {
        if (ctk.time.sec == 0) {
            ctk.elements.sec.classList.add('active');
        }
        ctk.time.cen = 0;
        ctk.time.sec++;
    }
    if (ctk.time.sec > 59) {
        if (ctk.time.min == 0) {
            ctk.elements.min.classList.add('active');
        }
        ctk.time.sec = 0;
        ctk.time.min++;
    }

    // - Gestion des "leading zero"
    if (ctk.time.min.toString().length == 1) {
        ctk.time.min = '0' + ctk.time.min;
    }
    if (ctk.time.sec.toString().length == 1) {
        ctk.time.sec = '0' + ctk.time.sec;
    }

    ctk.elements.min.innerHTML = ctk.time.min + ':';
    ctk.elements.sec.innerHTML = ctk.time.sec + '.';
    ctk.elements.cen.innerHTML = ctk.time.cen;

    ctk.time.compte = setTimeout(() => {
        
        ctk.time.run(); 
    
    }, 100);

};

ctk.time.start = () => {

    if (ctk.time.is_time_active) {
    
        return false;

    }
    
    ctk.time.is_time_active = true;

    ctk.time.run();

};

ctk.time.stop = () => {

    ctk.time.pause();
    ctk.time.min = ctk.time.sec = ctk.time.cen = ctk.time.time = 0;

};

ctk.time.restart = () => {

    ctk.time.stop();
    ctk.time.start();

};

ctk.time.getSeconds = () => {

    return Math.ceil(ctk.time.min * 60 + ctk.time.sec + (ctk.time.cen / 10));

}

ctk.setGameState = (value) => {

    const last_state = ctk.game_state;

    ctk.game_state = value;

    var mode = 'stop';

    switch (value) {

        case 1 : 

            mode = 'play';

            ctk.elements.pause.classList.add('active');
            ctk.elements.play.classList.remove('active');
            ctk.elements.help_btn.classList.remove('active');
            ctk.elements.stats_btn.classList.remove('active');

            if (last_state == -1) {
                
                ctk.time.restart();

            } else if (last_state == 0) {

                ctk.time.start();

            }

            key.play();

            break;

        case 0 : 

            mode = 'pause';

            ctk.elements.pause.classList.remove('active');
            ctk.elements.play.classList.add('active');
            ctk.elements.help_btn.classList.add('active');
            ctk.elements.stats_btn.classList.add('active');

            ctk.time.pause();

            key.pause();

            break;

        case -1 : 

            mode = 'stop';

            ctk.elements.pause.classList.remove('active');
            ctk.elements.play.classList.remove('active');
            ctk.elements.help_btn.classList.add('active');
            ctk.elements.stats_btn.classList.add('active');

            ctk.time.stop();

            key.pause();

            break;


    }

    ctk.elements.game_area.dataset.gameMode = mode;

};

ctk.setPulseClick = (active) => {

    if (active) {

        ctk.elements.focuses.forEach(focus => {

            focus.classList.add('active');
    
        });

    } else {

        ctk.elements.focuses.forEach(focus => {

            focus.classList.remove('active');
    
        });

    }

};

ctk.initGame = () => {

    ctk.player_game_index++;
    ctk.is_game_mode_activated = true;
    ctk.elements.game_area.classList.add('active');

    ctk.setGameState(-1);

    key.center();
    key.sprite_animation(true);

    ctk.setPulseClick(true);

    // - Actions sur la clé

    key.element.addEventListener('click', event => {

        // - Le jeu est en pause
        if (ctk.game_state == 0) {

            ctk.addFlashMsg(ctk.msg.t_key_click_pause);

            ctk.elements.play.classList.add('pulse');

            setTimeout(() => {

                ctk.elements.play.classList.remove('pulse');

            }, 400);

        } else if (ctk.game_state == 1 && !key.invicible) {

            // - On contrôle si le joueur ne clique pas dans une zone interdite
            var is_spam = false;

            ctk.impact.impacts.forEach(impact => {

                if (impact.classList.contains('active')) {

                    const rect = impact.getBoundingClientRect();

                    if (
                        (event.clientX > rect.left && event.clientX < rect.right)
                        && (event.clientY > rect.top && event.clientY < rect.bottom) 
                    ) {

                        is_spam = true;

                        impact.classList.add('spammed');

                        return false;

                    }

                }

            });

            if (is_spam) return;

            ctk.setGameState(-1);
            
            ctk.nb_click++;
            ctk.nb_click_level++;

            ctk.addFlashMsg(ctk.msg.t_catch);

            // - Score
            let score = Math.ceil(((100 - ctk.nb_click_level) + (100 - ctk.time.getSeconds())) * (1 + (0.2 * ctk.level)));
            if (score < 1) score = 1;
            ctk.score += score;

            // - Update stats
            msg_nb_click = ctk.nb_click_level > 1 ? ctk.msg.t_nb_clicks : ctk.msg.t_nb_click;
            const stats_level_info = `
                <section>
                    <header>` + ctk.msg.t_level + ctk.level + `</header>
                    <article>
                        <span>` + msg_nb_click +  `</span>
                        <span>` + ctk.nb_click_level + `</span>
                    </article>
                    <article>
                        <span>` + ctk.msg.t_time + `</span>
                        <span>` + ctk.elements.time.innerHTML + `</span>
                    </article>
                    <article>
                        <span>` + ctk.msg.t_score + `</span>
                        <span>` + ctk.score + ` (+` + score + `)</span>
                    </article>
                </section>
            `;

            if (ctk.level == 1) {

                ctk.elements.stats_content.innerHTML = stats_level_info;

            } else {

                ctk.elements.stats_content.innerHTML += stats_level_info;

            }

            ctk.level++;

            key.element.classList.add('catched');
            key.sprite_animation(false);

            setTimeout(() => {
                
                key.center();
                key.sprite_animation(true);

                setTimeout(() => {

                    key.element.classList.remove('catched');

                }, 500);
                
                ctk.elements.level_indic.innerHTML = ctk.msg.t_level + ctk.level;

            }, 1000);

            const current_level = ctk.level;

            setTimeout(() => {

                if (current_level !== ctk.level || ctk.game_state != -1) return;

                ctk.setPulseClick(true);

            }, 3000);

            ctk.nb_click_level = 0;

        } 
        // - Player start next level
        else if (ctk.game_state == -1) {

            if (ctk.level > 1) {
                key.nextLevel();
            }

            key.element.classList.remove('transition');

            ctk.addFlashMsg(ctk.msg.t_new_level);
    
            ctk.nb_click = 0;
            ctk.nb_click_level = 0;

            ctk.setPulseClick(false);

            ctk.setGameState(1);

            key.addShield();

        }

    });

    // ------------------------------------------------------------------------------------------------------------------------------------
    // - Gestion des Impacts et du nombre de cliques
    // ------------------------------------------------------------------------------------------------------------------------------------
    
    document.addEventListener('click', event => {

        if (
            ctk.game_state == 1
            && !key.busy
            && event.target != key.element 
            && event.target != ctk.elements.pause
            && event.target != ctk.elements.play
            && event.target.closest('.ctk-toggle-play') === null
        ) {

            ctk.nb_click++;
            ctk.nb_click_level++;

            var rect = {
                top: event.clientY - 50,
                bottom: event.clientY + 50,
                left: event.clientX - 50,
                right: event.clientX + 50
            };

            // - Looking for unsed impact - impact pooler

            let impact = null;

            // - Try to reused unactive one
            if (ctk.impact.impacts.length > 0) {

                ctk.impact.impacts.forEach(element => {

                    if (impact === null && !element.classList.contains('active')) {

                        impact = element;

                    }

                });

            }

            // - Each impact are already used so we create a new one.
            if (impact === null) {

                impact = ctk.impact.template.cloneNode();

                // - Add Impact to the pooler queue
                ctk.impact.impacts.push(impact);

                // - Element is added to the area
                ctk.elements.game_area.appendChild(impact);

            }

            // - Set position
            impact.style.left = rect.left + 'px';
            impact.style.top = rect.top + 'px';

            rect.impact = impact;

            // - Add impact to 
            ctk.elements.game_area.appendChild(impact);

            setTimeout(() => {

                impact.classList.add('active');

            }, 10);

            // - Timer
            let s = setTimeout(function() {

                impact.classList.remove('active');
                impact.classList.remove('spammed');

                clearTimeout(s);

            }, ctk.impact.impact_stay_time);

        }
    });

    // - Initialement les minutes sont cachées
    ctk.elements.min.classList.remove('active');

    // ------------------------------------------------------------------------------------------------------------------------------------
    // - Contrôle du jeu par l'utilisateur
    // ------------------------------------------------------------------------------------------------------------------------------------
    
    ctk.elements.play.addEventListener('click', () => {

        if (ctk.game_state == 1) return;

        ctk.setGameState(1);

        ctk.addFlashMsg(ctk.msg.t_play);
        
        key.setInvicibility(false);

    });

    ctk.elements.pause.addEventListener('click', () => {

        // - Pause
        if (ctk.game_state != 1) return;

        ctk.setGameState(0);

        ctk.addFlashMsg(ctk.msg.t_pause);

        key.setInvicibility(true);

    });

    // ------------------------------------------------------------------------------------------------------------------------------------
    // - Contrôle des fenêtres de jeu
    // ------------------------------------------------------------------------------------------------------------------------------------
    
    document.querySelectorAll('.ctk-window-trigger').forEach(trigger => {
        
        const id = trigger.getAttribute('id');
        const linked_window = ctk.elements.game_area.querySelector('#' + id.replace('_btn', ''));
    
        if (linked_window === null) return;
    
        trigger.addEventListener('click', () => {
    
            linked_window.classList.add('active');
    
        });
    
    });

    document.querySelectorAll('.ctk-close-window').forEach(close => {

        const parent_window = close.closest('.ctk-window');

        close.addEventListener('click', () => {

            parent_window.classList.remove('active');

        });


    });

};
