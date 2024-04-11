<?php

namespace mab;

class ContentHelpers extends MainHelpers {

    public static function getSectionHeader(string $title) : string {

        preg_match_all('/./u', $title, $chars);

        ob_start();
        
        ?><header>

            <?php /*<h2 class="scroll" data-scroll-anim-data='{"letter-spacing" : {"0": "1em", "50": "0.2em"}}'> */ ?>
            <h2>
                <?= $title; ?>
                <?php /*foreach ($chars[0] as $char) : ?>
                    <span class="magnetic-letter"><span class="magnetic-letter--inner"><?= $char === ' ' ? '&nbsp;' : $char; ?></span></span>
                <?php endforeach; */?>
            </h2>

        </header><?php

        return ob_get_clean();

    }

}

