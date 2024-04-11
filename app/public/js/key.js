const key = {

    element : document.querySelector('#key'),
    is_flying: false,
    latest_pos: null,
    type: 'white',
    key_animation_timer_ref : 0,
    level : 1,
    new_level_ratio_inc : 0.2,
    reset_val : {},
    best_val : 1,
    is_mobile : window.innerWidth <= 480,
    busy : false,
    invicible : false,
    start_level_shield_time : 3000,
    sprite_index : 0,
    sprite_speed : 200

};

// - Level ratio
key.level_ratio = key.is_mobile ? 2 : 1;
key.setLevelRatio = (ratio) => key.level_ratio = ratio;

// - Moving functions
key.stop = () => {
    
    key.fly(false);
    key.busy = true;

    key.sprite_animation(false);

};

key.pause = () => {
    
    key.fly(false);
    key.busy = true;

    // - Update latest position
    key.latest_pos = key.element.getBoundingClientRect();

};

key.play = () => {
    
    key.fly(true);
    key.busy = false;

    key.sprite_animation(true);

};

key.center = () => {

    const rect = key.element.getBoundingClientRect();

    let x = (window.innerWidth / 2) - (rect.width / 2);
    let y = (window.innerHeight / 2) - (rect.height / 2);

    key.element.style.left = x + 'px';
    key.element.style.top = y + 'px';

    key.latest_pos = {
        left : x,
        top: y
    };

}

key.addShield = (time) => {

    key.setInvicibility(true);

    // - Bouclier de protection
    setTimeout(() => {

        key.setInvicibility(false);

    }, typeof time == typeof undefined ? key.start_level_shield_time : time);

};

key.setInvicibility = (active) => {

    if (active) {

        key.element.classList.add('invicible');
        
    } else {
        
        key.element.classList.remove('invicible');
        
    }
    
    key.invicible = active;

};

// - Next level update
key.nextLevel = () => {

    key.level_ratio += key.new_level_ratio_inc;

    if (key.level > key.best_level) {

        key.best_level = key.level;

    }

}

// - Random Position
key.getRandomPosition = () => {

    const rect = key.element.getBoundingClientRect();

    let h = window.innerHeight - rect.height,
        w = window.innerWidth - rect.width,
        nh = Math.floor(Math.random() * h),
        nw = Math.floor(Math.random() * w),
        ns = Math.floor(Math.random() * (1000 / key.level_ratio));
    
    if (ns < (1000 / key.level_ratio)) {
        ns = 1000 / key.level_ratio;
    }

    ns = 5000;

    return {
        top: nh,
        left: nw,
        delay: ns,
        maxX : w,
        maxY : h,
    };  

}

// - New animation
key.fly = (active) => {

    key.is_flying = active;

    if (!key.is_flying) {
        
        clearInterval(key.key_animation_timer_ref);

        return;

    }

    const newq = key.getRandomPosition();

    // console.log(newq, key.is_flying, key.latest_pos);

    if (key.latest_pos !== null) {

        if (key.element.classList.contains('key-' + key.type + '-reverse')) {

            key.element.classList.remove('key-' + key.type + '-reverse');
            key.element.classList.add('key-' + key.type);

        } else if (key.latest_pos.left > newq.left) {

            key.element.classList.add('key-' + key.type + '-reverse');
            key.element.classList.remove('key-' + key.type);

        }

    }

    // - Animation between current point and the new one
    const max_iterations = newq.delay / 10;

    const x_inc = (newq.left - key.latest_pos.left) / max_iterations;
    const y_inc = (newq.top - key.latest_pos.top) / max_iterations;

    let x = key.latest_pos.left;
    let y = key.latest_pos.top;

    let i = 0;
    let timer = setInterval(() => {

        // console.log('in', max_iterations, x_inc, y_inc);

        if (!key.is_flying) {

            clearInterval(timer);

        }
        
        x += x_inc;
        y += y_inc;
        
        key.element.style.top = y + 'px';
        key.element.style.left = x + 'px';

        if (i >= max_iterations - 1) {

            // console.log(y, newq.top);
            
            key.latest_pos = newq;
            key.fly(true);

            key.element.style.top = newq.top + 'px';
            key.element.style.left = newq.left + 'px';

            clearInterval(timer);

        }

        i++;

    }, 10);

}

// - Animate key sprite
key.sprite_animation = (active) => {

    clearInterval(key.sprite_timer_ref);

    if (!active) {

        return;

    }

    key.sprite_timer_ref = setInterval(() => {
    
        key.element.style.backgroundPosition = '0 ' + (key.sprite_index * 50) + '%';
    
        if (key.sprite_index == 2) {
    
            key.sprite_index = 0;
    
        } else {
    
            key.sprite_index++;
    
        }
    
    }, key.sprite_speed);

};
