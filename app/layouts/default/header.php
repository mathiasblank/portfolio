


<header>

    <div class="container">

        <div class="intro flex-center">

            <span class="intro--txt anim--colored-txt">

                <?= date('H') > 18 && date('H') < 25 ? 'Bonsoir' : 'Bonjour'; ?>

            </span>

        </div>

        <div class="hero" style="display:none">

            <p><span class="anim--type-writing">Bienvenue sur mon site </span><span class="crypt-txt" data-index="2">web</span></p>
            <p><span class="anim--type-writing">Je m'appel&shy;le </span><span class="crypt-txt" data-index="0">Mathias</span></p>
            <p><span class="anim--type-writing">Je suis </span><span class="crypt-txt" data-index="1">Développeur</span></p>

            <?php require_once _PARTS_.'scroll-down.php'; ?>

        </div>

    </div>

</header>

<main>

            <div class="template">
                <span class="anim--show-and-hide active">Mathias</span>
                <span class="anim--show-and-hide active">Développeur</span>
                <span class="anim--show-and-hide active">web</span>
            </div>
