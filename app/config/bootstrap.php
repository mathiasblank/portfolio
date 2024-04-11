<?php

define('_APP_', 'app/');


define('IS_DEV', false);
define('USE_MIN_JS', !IS_DEV);
define('USE_MIN_CSS', !IS_DEV);

/*****************************************************************
    SERVER PATHS
*****************************************************************/

// - Layouts
define('_LAYOUTS_', 'layouts/');
define('_DEFAULT_LAYOUT_', _LAYOUTS_.'default/');

// - Views
define('_VIEWS_', _APP_.'views/');

// - Classes
define('_CLASSES_', _APP_.'classes/');
define('_HELPERS_', _CLASSES_.'helpers/');

// - Parts
define('_PARTS_', _APP_.'parts/');

// - Public
define('_PUBLIC_', _APP_.'public/');
define('_JS_', _PUBLIC_.'js/');
define('_CSS_', _PUBLIC_.'css/');
define('_IMG_', _PUBLIC_.'img/');
define('_VIDEO_', _PUBLIC_.'videos/');

// - Assets
define('_ASSETS_', 'assets/');
define('_ASSETS_JS_', _ASSETS_.'scripts/');
define('_ASSETS_CSS_', _ASSETS_.'styles/');

/*****************************************************************
    SETTINGS
*****************************************************************/

// - Default themes
define('DEFAULT_THEME', 'neon-blue');

/*****************************************************************
    CONTACT
*****************************************************************/

// - Socials
define('FACEBOOK', '//www.facebook.com/mathias.blank.ch');
define('LINKEDIN', '//www.linkedin.com/in/mathiasblank/');
define('GITHUB', '//github.com/mathiasblank/');

/*****************************************************************
    ANIMATIONS
*****************************************************************/

define('SCROLL_ANIM_DATA' ,"data-scroll-anim-data='{\"transform\": {\"translateX\": {\"0\": \"0%\", \"100\": \"-25%\"}}}'");

define('NB_MARQUEES', 4);
