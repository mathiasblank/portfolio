<?php 

use mab\ContentHelpers;
use mab\SkillsHelpers;

?>

<!-- Experiences -->
<section id="experiences" class="experiences">

    <?= ContentHelpers::getSectionHeader('expériences'); ?>

    <article class="experience">

        <div class="experience-items">

            <?php foreach ($experiences as $key => $experience) : ?>
                
                <article class="experience-item <?= $experience['reference']; ?>-color" data-reference="<?= $experience['reference']; ?>">
                    
                    <span class="experience-item--number"><?= str_pad($key + 1, 2, '0', STR_PAD_LEFT); ?></span>
                    <h3 class="experience-item--name anim--colored-link" data-mouse-txt="Découvrir"><?= $experience['title']; ?></h3>
                    
                </article>
                
            <?php endforeach; ?>

        </div>

    </article>

</section>

<!-- Motivation -->
<section class="motivation">

    <blockquote cite="Mathias Blank" class="scroll anim--colored-txt" data-scroll-offset="-40vh" data-scroll-active-once="true">Code always tells the truth!</blockquote>

</section>

<!-- Skills -->
<section id="skills" class="skills">
    
    <?= ContentHelpers::getSectionHeader('compétences'); ?>

    <div class="skills--category">

        <div class="skills--category--list"><?php 

        foreach ($skills as $skill) {

            echo SkillsHelpers::getSkillTypeContent($skill);

        }

        ?></div>

    </div> 

</section>

<!-- Enigma -->
<section class="discover-image" data-message="<?= $discover_message; ?>">

    <div class="mask">

        <!-- <img src="<?= _IMG_; ?>enigma.jpg" alt=""> -->
        <video  preload="auto" loop autoplay muted playsinline poster="poster="<?= _IMG_; ?>game.jpg">
            <source src="<?= _VIDEO_; ?>red_smith.mp4" type="video/mp4">
        </video>

    </div>

</section>

<!-- Experiences' ligthbox -->
<section id="experience_lightbox" class="experience-lightbox">

    <div class="--container">

        <div class="--scroll-container">

            <div class="--scroll-content">

                <?php foreach ($experiences as $key => $experience) : ?>
            
                <article class="experience <?= $experience['reference']; ?>-color" data-reference="<?= $experience['reference']; ?>">
            
                    <header>
            
                        <h2><?= $experience['title']; ?></h2>
                        <span class="anim--show-and-hide"><?= $experience['location']; ?></span>
            
                    </header>
            
                    <div class="experience--type">
            
                        <div class="marquee">
            
                            <div class="marquee--inner scroll" <?= SCROLL_ANIM_DATA; ?> data-scroll-container="#experience_lightbox">
            
                                <?php for ($i=0; $i < 10; $i++) : ?>
            
                                <span><?= $experience['function']; ?></span>
            
                                <?php endfor; ?>
            
                            </div>
            
                        </div>
            
                    </div>
            
                    
                    <div class="experience--content">
                        
                        <?php if (array_key_exists('keywords', $experience) && !empty($experience['keywords'])) :
 
                        // - Keywords
                        $nb_sites = count($experience['projects']);
            
                        ?><div class="experience--keywords" data-area-color="neue-color">
            
                            <?php foreach ($experience['keywords'] as $keyword) : ?>
            
                            <div class="experience--keyword">
            
                                <span class="experience--keyword--number incrementor scroll" data-scroll-container="#experience_lightbox" data-mouse-txt="<?= $keyword['title']; ?>" data-counter="<?= $keyword['number'] == -1 ? $nb_sites : $keyword['number']; ?>">&nbsp;</span>
                                <span class="experience--keyword--description"><?= $keyword['title']; ?></span>
            
                            </div>
            
                            <?php endforeach; ?>
            
                        </div>
            
                        <?php endif; ?>
            
                        <div class="experience--info scroll">
            
                            <div class="experience--info--inner">
            
                                <div class="experience--info-item">
            
                                    <span>Période</span>
                                    <time datatime="<?= $experience['time'][0]; ?>"><?= $experience['time'][1]; ?></time>
            
                                </div>
            
                                <div class="experience--info-item --skills">
            
                                    <span>Compétences</span>
                                    <?= SkillsHelpers::getHTMLSkills($experience['skills']); ?>
            
                                </div>
            
                                <div class="experience--info-item">
            
                                    <span>Description</span>
                                    <div><?= $experience['description']; ?></div>
            
                                </div>

                                <?php if (array_key_exists('projects', $experience) && !empty($experience['projects'])) :
            
                                ?><div class="experience--info-item --projects">
            
                                    <span>Projets publics</span>
                                    <ul>
                                        <?php 
                                        sort($experience['projects']);
                                        foreach ($experience['projects'] as $project) : ?>
                                            <li>
            
                                                <a class="anim--colored-link" href="<?= '//'.$project; ?>" rel="noreferer noopener" target="blank"><?= $project; ?></a>
            
                                            </li>
                                        <?php endforeach; ?>
                                    </ul>
            
                                </div>

                                <?php endif; ?>
            
                                <div class="experience--info--scroll-bar scroll" data-scroll-container="#experience_lightbox" data-scroll-offset="-100" data-scroll-anim-data='{"height": {"0": "0%", "100": "100%"}}'></div>
            
                            </div>
            
                        </div>
            
                    </div>

                    <?php if (array_key_exists('link', $experience) && !empty($experience['link'])) :

                    ?><footer>
            
                        <a href="<?= $experience['link']['url']; ?>" target="blank" rel="noreferer noopener" class="--company-main-link anim--colored-link" aria-label="Site Web de l'entreprise">
                            
                            <?= array_key_exists('title', $experience['link']) ? $experience['link']['title'] : 'en savoir plus'; ?>
            
                        </a>
            
                    </footer>

                    <?php endif; ?>
            
                </article>
            
                <?php endforeach; ?>

            </div>

        </div>

    </div>


</section>

<!-- Experiences transition title -->
<h2 id="animated_title" class="animated-title hide" aria-hidden="true"></h2>