<?php

namespace mab;

class SkillsHelpers extends MainHelpers {

    public static function getSkillTypeContent(array $skill_data) : string {

        $title = $skill_data['title'];
        $color = $skill_data['color'];
        $items = $skill_data['items'];

        ob_start();
        
        ?><article class="skills--<?= self::__getSlug($title); ?> <?= $color; ?>">
        
            <div class="skills--category--title" data-mouse-txt="<?= $title; ?>">
                <div class="skills--category--inner-title">
                    <span class="<?= $color; ?>"><?= $title; ?></span>
                </div>
            </div>

            <?php foreach ($items as $item) : ?>

            <div class="marquee" data-mouse-txt="<?= $title; ?>">

                <div class="marquee--inner">

                <?php for ($i = 0; $i < 2; $i++) : ?>
                    <span><?= $item; ?></span>
                <?php endfor; ?>

                </div>

            </div><?php

            endforeach;

        ?></article><?php

        return ob_get_clean();

    }

    public static function getHTMLSkills(array $skills) : string {

        $items = [];

        foreach ($skills as $skill) {

            $class = null;
            $hover_txt = null;

            switch (strtolower($skill)) {

                case 'javascript':

                    $skill = 'js';

                case 'html5':
                case 'css3':
                case 'css':
                case 'sass':
                case 'js':
                case 'requirejs':
                case 'grunt':

                    $class = 'neon-pink';
                    $hover_txt = 'Front-end';

                    break;

                case 'php':
                case 'mysql':
                case 'xml':
    
                    $class = 'neon-green';
                    $hover_txt = 'Back-end';
    
                    break;

            }

            if (!empty($hover_txt)) {

                $hover_txt = " data-mouse-txt=\"$hover_txt\"";

            }

            $items[] = "<li><span class=\"$class\"$hover_txt>$skill</span></li>";

        }

        return '<ul>'.implode('', $items).'</ul>';

    }

    private static function __getSlug(string $value) : string {

        return preg_replace('/\s/', '_', strtolower($value));

    }

}

