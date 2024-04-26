
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

    stats : {

        clicks_per_level : [],
        times_per_level : []

    },

    charts : {

        clicks : null

    },

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
        leaderboard_btn : document.querySelector('#ctk_leaderboard_btn'),
        help_btn : document.querySelector('#ctk_help_btn'),
        stats : document.querySelector('#ctk_stats'),
        help : document.querySelector('#ctk_help'),
        social_networks : document.querySelector('#sn_ctk_area'),
        flash_msg : document.querySelector('#ctk_flash_msg'),
        level_msg : document.querySelector('#ctk_level_msg'),
        level_indic : document.querySelector('#ctk_level_indic'),
        player_intro_msg : document.querySelector('#ctk_intro_player_message'),
        manager_btn : document.querySelector('#ctk_manager_btn'),
        min : document.querySelector('#ctk_time_min'),
        sec : document.querySelector('#ctk_time_sec'),
        cen : document.querySelector('#ctk_time_cen'),
        time : document.querySelector('#ctk_time'),
        focuses : document.querySelectorAll('.ctk-focus'),
        clicksChartCanvas : document.querySelector('#stats_chart')

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

ctk.elements.player_intro_msg.querySelector('input')?.focus();

var msg_busy = false;

ctk.addFlashMsg = (message, type) => {

    if (msg_busy) return;

    msg_busy = true;

    ctk.elements.flash_msg.innerHTML = message;
    ctk.elements.flash_msg.classList.add('active');

    if (type !== 'error') {
        ctk.elements.flash_msg.classList.remove('error');
    } else {
        ctk.elements.flash_msg.classList.add('error');
    }

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
    ctk.time.reset();

};

ctk.time.restart = () => {

    ctk.time.stop();
    ctk.time.start();

};

ctk.time.reset = () => {

    ctk.time.min = ctk.time.sec = ctk.time.cen = ctk.time.time = 0;

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

            ctk.elements.play.classList.remove('active');
            ctk.elements.help_btn.classList.remove('active');
            ctk.elements.stats_btn.classList.remove('active');
            ctk.elements.leaderboard_btn.classList.remove('active');

            if (last_state == -1) { // - start a new level

                ctk.elements.time.style.opacity = 0; // - Hide timer during invicible shield

                setTimeout(() => {

                    ctk.time.restart();
                    ctk.elements.pause.classList.add('active');
                    ctk.elements.time.style.opacity = 1;

                }, key.start_level_shield_time); // - according to the invicible shield

            } else if (last_state == 0) { // - coming from pause

                ctk.elements.pause.classList.add('active');
                ctk.time.start();

            }

            key.play();

            break;

        case 0 : 

            mode = 'pause';

            ctk.elements.pause.classList.remove('active');
            ctk.elements.play.classList.add('active');
            ctk.elements.help_btn.classList.add('active');
            ctk.elements.leaderboard_btn.classList.add('active');
            ctk.elements.stats_btn.classList.add('active');

            ctk.time.pause();

            key.pause();

            break;

        case -1 : 

            mode = 'stop';

            ctk.elements.pause.classList.remove('active');
            ctk.elements.play.classList.remove('active');
            ctk.elements.help_btn.classList.add('active');
            ctk.elements.leaderboard_btn.classList.add('active');
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

ctk.generateUniqPartyID = () => {

    localStorage.partyID = Date.now() + Math.floor(Math.random() * 100);

}

ctk.beforeGame = () => {

    ctk.elements.player_intro_msg.classList.add('active');
    ctk.elements.player_intro_msg.querySelector('input').focus();
    ctk.elements.help_btn.classList.remove('active');
    ctk.elements.leaderboard_btn.classList.remove('active');

    ctk.init();

    key.center();
    key.sprite_animation(true);
    key.play();

    // ctk.initGame();

};

ctk.initGame = () => {

    ctk.player_game_index++;
    ctk.is_game_mode_activated = true;
    ctk.elements.game_area.classList.add('active');

    ctk.time.reset();

    ctk.setGameState(-1);

    ctk.generateUniqPartyID();

    ctk.addFlashMsg(`Bon jeu ${localStorage.playerName}!`);

    // key.center();
    // key.sprite_animation(true);

    setTimeout(() => {
        key.center();
    }, 100);

    ctk.setPulseClick(true);

};

ctk.init = () => {

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

            ctk.stats.clicks_per_level.push(ctk.nb_click_level);
            const level_time = {
                "min" : parseInt(ctk.elements.min.innerHTML),
                "sec" : parseInt(ctk.elements.sec.innerHTML),
                "cen" : parseInt(ctk.elements.cen.innerHTML)
            };
            ctk.stats.times_per_level.push(level_time);

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

            // - Update player ranking stat
            const new_score_data = {
                "pseudo": localStorage.playerName,
                "score": ctk.score,
                "partyID" : localStorage.partyID,
                "click" : ctk.nb_click_level,
                "time" : level_time,
                "level" : ctk.level,
                "dateTime" : Date.now()
            };

            // - Init data for xhr query
            var formData = new FormData();
            formData.append('score', JSON.stringify(new_score_data));
            formData.append('action', 'save-score');

            // - Send XHR query
            var saveRequest = new XMLHttpRequest();
            saveRequest.open('POST', 'app/ajax.php', true);
            saveRequest.send(formData);

            // - Increase current level
            ctk.level++;

            // - Update chart clics
            if (ctk.charts.clicks != null) {

                ctk.charts.clicks.destroy(); // - destroy existing chart

            }

            // - Define labels
            var labels = [];
            for (let index = 1; index < ctk.level; index++) {

                labels.push('Level ' + index);
                
            }

            var themeColor = 'white';

            switch (localStorage.theme) {

                case 'neon-blue':
                    
                    themeColor = '#34d3fb';

                    break;

                case 'neon-green':

                    themeColor = '#2fff31';

                    break;

                case 'neon-orange':

                    themeColor = '#ff6733';

                    break;

                case 'none-pink':

                    themeColor = '#ff329c';

                    break;

            }

            ctk.charts.clicks = new Chart(ctk.elements.clicksChartCanvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Clics',
                        data: ctk.stats.clicks_per_level,
                        borderColor: themeColor,
                        borderWidth: 1,
                        backgroundColor: themeColor,
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 15
                    }]
                },
                plugins: {
                    title: {
                        display: true,
                        text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
                    }
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

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

            }, key.start_level_shield_time);

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
    // - Changement du pseudo
    // ------------------------------------------------------------------------------------------------------------------------------------

    const playerNameInputs = document.querySelectorAll('.ctk-player-name');
    playerNameInputs.forEach(input => {

        input.addEventListener('input', () => {

            localStorage.playerName = input.value;
            
        });

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
    // - Contrôle par clavier
    // ------------------------------------------------------------------------------------------------------------------------------------

    document.addEventListener('keydown', e => {

        if (e.key == 'Enter' && ctk.elements.player_intro_msg.classList.contains('active')) {

            checkPlayerName(ctk.elements.player_intro_msg);

        }

    });

    // ------------------------------------------------------------------------------------------------------------------------------------
    // - Contrôle des fenêtres de jeu
    // ------------------------------------------------------------------------------------------------------------------------------------
    
    const checkPlayerName = parent_window => {

        const input = parent_window.querySelector('input');

        if (input.value === '') {

            console.log('empty value');

            ctk.addFlashMsg('empty value', 'error');

        } else if (input.value.length < 3) {

            // console.log('3 chars min');
            ctk.addFlashMsg('3 chars min', 'error');

        } else {

            localStorage.playerName = parent_window.querySelector('input').value;
            ctk.initGame();
            parent_window.classList.remove('active');

        }

    };

    document.querySelectorAll('.ctk-window-trigger').forEach(trigger => {
        
        const id = trigger.getAttribute('id');
        const linked_window = ctk.elements.game_area.querySelector('#' + id.replace('_btn', ''));
    
        if (linked_window === null) return;
    
        trigger.addEventListener('click', () => {

            if (trigger == ctk.elements.leaderboard_btn) {

                // - Init data for xhr query
                var formData = new FormData();
                formData.append('action', 'get-leaderboard');

                // - Send XHR query
                var saveRequest = new XMLHttpRequest();
                saveRequest.open('POST', 'app/ajax.php', true);
                saveRequest.send(formData);

                saveRequest.onload = () => {

                    // console.log('load', saveRequest.responseText);

                    const json = JSON.parse(saveRequest.responseText);

                    document.querySelector('#ctk_leaderboard_container').innerHTML = json.html;

                    linked_window.classList.add('active');

                };

            } else {

                linked_window.classList.add('active');

            }
    
    
        });
    
    });

    document.querySelectorAll('.ctk-close-window').forEach(close => {

        const parent_window = close.closest('.ctk-window');

        close.addEventListener('click', () => {

            if (parent_window.classList.contains('ctk-intro-player-message')) {

                if (close.dataset.redirect == 'home') {

                    window.location.href = '/';

                } else {

                    checkPlayerName(parent_window);

                }

            } else {

                parent_window.classList.remove('active');

            }

        });


    });

};
