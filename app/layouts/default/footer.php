            </main>
            <footer class="main-footer">

                <div id="contact" class="main--footer-contact">

                    <p class="main-footer--mail">
                        <a href="mailto:hello@mathias-blank.ch" class="email" data-mouse-txt="Say hello" data-mouse-color="theme">hello@mathias-blank.ch</a>
                    </p>

                    <div class="main-footer--socials inline-list">

                        <a href="<?= FACEBOOK; ?>" class="anim--colored-link">Facebook</a>
                        <a href="<?= LINKEDIN; ?>" class="anim--colored-link">Linkedin<span class="bullet"></span></a>
                        <a href="<?= GITHUB; ?>" class="anim--colored-link">GitHub<span class="bullet"></span></a>

                    </div>

                </div>

                <p class="main-footer--copyright"><small>Grandson@<?= date('Y'); ?> - Made with chalenge</small></p>

            </footer>

            <section class="after-footer">

                <p>
                    <span class="anim--type-writing">Merci pour la visite</span>
                    <span class="theme-color">
                        <span class="anim--type-writing">:)</span>
                    </span>
                </p>
                <p>
                    <span class="anim--type-writing">Envie d'un peu de fun ?</span><br>
                    <a href="<?= IS_DEV ? '/PERSO/portfolio2021/404' : '/404'; ?>" class="anim--colored-link key-anchor" data-mouse-txt="Funny 404">
                        <span class="anim--type-writing">Jouez à CTK</span>
                        <span class="theme-color">
                            <span class="anim--type-writing">!</span>
                        </span>
                        <?php include_once _PARTS_.'key.php'; ?>
                    </a>
                </p>

                <?php include_once _PARTS_.'scroll-up.php'; ?>

            </section>
        </div>

    </div>

    <?php include_once _PARTS_.'cursor.php'; ?>

    <script src="<?= _JS_.'key.js'; ?>"></script>
    <script data-main="<?= USE_MIN_JS ? _JS_.'min.js' : _ASSETS_JS_.'_main.js?v='.time(); ?>"src="//requirejs.org/docs/release/2.3.6/minified/require.js"></script>

</body>
</html>