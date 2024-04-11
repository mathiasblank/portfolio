<?php

// $start = strtotime('01.02.2018');
// $end = time();
// $diff = $end - $start;

$neue_start = new DateTime("2018-02-01");
$now = new DateTime();
$difference = $neue_start->diff($now);
$km_per_day = round(6 * 2 * 4 * 70 / 365); /* twice a week 70km during ~6months */

$experiences = [

    // - NEUE
    [
        'title' => 'NEUE',
        'reference' => 'neue', // - empty = lower title
        'location' => 'Peseux, NE',
        'function' => 'Lead Developper',
        'keywords' => [
            ['number' => $difference->days * $km_per_day, 'title' => 'km de vélo'],
            ['number' => '40', 'title' => 'sites'],
            ['number' => '50', 'title' => 'clients'],
            ['number' => '1', 'title' => 'château'],
        ],
        'time' => ['01.02.2018', 'Depuis mars 2018'],
        'skills' => ['html5', 'php', 'xml', 'csv', 'json', 'js', 'css3', 'sass', 'grunt', 'requirejs', 'twig', 'Trello', 'Clickup'],
        'projects' => [
            'groupeid.ch',
            'tsm.ch',
            'admed.ch',
            'beyond.swiss',
            'cinqsurcinq.ch',
            'cpih.ch',
            'ccih.ch',
            'cic-broker.ch',
            'cimier.com',
            'cmdp.swiss',
            'dentistes-fontaine.ch',
            'integra-avocats.ch',
            'jokers.design',
            'reform2.ch',
            'comec.ch',
            'intensityworkout.ch',
            'metiers-horlogerie.ch',
            'paul-picot.com',
            'durhonechocolatier.ch',
            'festineuch.ch',
            'soleilmimi.ch',
            'truthce.com',
            'infosuisse.ch',
            'jacotchocolatier.ch',
            'caves-beroche.ch',
            'dctechnique.ch',
            'watch-academy.com'
        ],
        'description' => "Responsable technique au sein d'une agence de communication.
            <ul class=\"styled\">
                <li><mark>Développement et maintien de sites</mark> et ce principalement sur WordPress 4.8+</li>
                <li>Développement et maintien d'un système multilingue de type (M)VC basé sur WP</li>
                <li>Développement et maintien d'un <mark>framework MVC</mark></li>
                <li><mark>Développement d'applications de données sensibles</mark></li>
                <li>Extranet, <mark>protection des données sensibles</mark></li>
                <li>Sites e-commerce basés sur WooCommerce</li>
                <li><mark>Sites sur mesure</mark> avec ou sans CMS</li>
                <li>Développement de solutions pour des Landing pages</li>
                <li><mark>Documentations interactives</mark></li>
                <li>Conseils techniques et <mark>analyse de bases de données</mark></li>
                <li><mark>Analyse UI/UX</mark> et création de plugins/templates</li>
                <li>Stratégies, conseils SEO, hébergement et gestion des campagnes adwords (SEA), etc.</li>
                <li><mark>Développement et utilisation d'APIs</mark></li>
                <li>Élaboration de processus</li>
                <li>Gestion des projets en tant que <mark>Scrum Master</mark></li>
                <li><mark>Formation et encadrement</mark> de l'équipe digitale, développement et maintien des outils ainsi que de la documentation client et interne</li>
                <li><mark>Référent technique</mark> de l'agence</li>
                <li><mark>Dépannage et conseils aux clients</mark></li>
            </ul>",
        'link' => [
            'title' => 'neue.swiss',
            'url' => 'https://neue.swiss'
        ]
    ],

    // - Game
    [
        'title' => 'Jeux vidéos',
        'reference' => 'game',
        'location' => 'Home',
        'function' => 'Unity developper',
        'time' => ['01.06.2017', 'juin 2017 - un jour peut-être...'],
        'skills' => ['Unity', 'Google', 'Firebase', 'C#', 'PHP', 'Json', 'MySQL', 'Affinity Photo/Design', 'HTML5', 'CSS3', 'JavaScript'],
        'projects' => ['mathias-blank.ch/404'],
        'description' => "Développement d'un jeu viédo de type RPG ainsi que d'un jeu d'aracade \"Catch the Key\" qui a été traduit en langage web afin d'en faire ma 404.",

    ],

    // - Les Fleurs
    [
        'title' => 'LesFleurs.ch',
        'reference' => 'les-fleurs',
        'location' => 'Corcelles, NE',
        'function' => 'Web developper',
        'keywords' => [
            ['number' => '7', 'title' => 'Départements'],
            ['number' => '2', 'title' => 'Sites'],
            ['number' => '1', 'title' => 'Client'],
            ['number' => '2', 'title' => 'Développeurs'],
        ],
        'time' => ['09.02.2015', 'septembre 2015 - octobre 2017'],
        'skills' => ['html5', 'php', 'mysql', 'xml', 'javascript', 'css3'],
        'projects' => ['lesfleurs.ch', 'lesfleurs.ch/corporate'],
        'description' => "Amélioration, entretien et migration du <mark>site de vente en ligne</mark> ainsi que de la <mark>plateforme de gestion</mark>. Collaboration avec les différents départements, de la logistique au marketing en passant par la comptabilité. Voici quelques projets menés afin de rendre la vie des collaborateurs plus simple&nbsp;: <ul class=\"styled\"><li><mark>Algorithme d'apprentissage pour la correction des numéros de téléphone</mark></li><li>Développement du nouveau site e-commerce (principalement front-end)</li><li>Impressions PDF des cartes</li><li>Gestion des données d'envoi</li><li>Système de scan permettant la validation simplifiée de la préparation des colis</li></ul>Mon travail commençait toujours par passer quelques jours à observer les collaborateurs puis à leur proposer des solutions adaptées à leurs besoins.",        'link' => [
            'title' => 'lesfleurs.ch',
            'url' => 'https://lesfleurs.ch'
        ]

    ],

    // - Copilates
    [
        'title' => 'copilates.ch',
        'reference' => 'copilates',
        'location' => 'Sainte-Croix',
        'function' => 'Freelancer',
        // 'keywords' => [
        //     ['number' => '7', 'title' => 'Départements'],
        //     ['number' => '2', 'title' => 'Sites'],
        //     ['number' => '1', 'title' => 'Client'],
        //     ['number' => '2', 'title' => 'Développeurs'],
        // ],
        'time' => ['01.11.2014', 'novembre 2014 - mars 2015'],
        'skills' => ['html5', 'php', 'mysql', 'xml', 'javascript', 'jquery', 'css3', 'cakePHP', 'bootstrap'],
        'projects' => ['copilates.ch'],
        'description' => "Analyse, conception et réalisation d'un site web pour le Pilates.",        'link' => [
            'title' => 'Site web',
            'url' => 'copilates.ch'
        ]

    ],

    // - Insolus
    [
        'title' => 'inSolus.com',
        'reference' => 'insolus',
        'location' => 'Travail de dipôme ES',
        'function' => 'Junior developper',
        // 'keywords' => [
        //     ['number' => '7', 'title' => 'Départements'],
        //     ['number' => '2', 'title' => 'Sites'],
        //     ['number' => '1', 'title' => 'Client'],
        //     ['number' => '2', 'title' => 'Développeurs'],
        // ],
        'time' => ['03.03.2014', 'mars 2014 - juillet 2014'],
        'skills' => ['html5', 'php', 'mysql', 'xml', 'javascript', 'jquery', 'css3', 'cakePHP', 'bootstrap'],
        // 'projects' => ['lesfleurs.ch', 'lesfleurs.ch/corporate'],
        'description' => "J'ai effectué mon travail de diplôme consitant en la réalisation d'un site Web basé sur CakePHP et Bootstrap 3.",        'link' => [
            'title' => 'Site web',
            'url' => 'https://insolus.com'
        ]

    ],

];

$skills = [

    // - Front-end
    [   
        'title' => 'Front-end', 
        'color' => 'neon-pink', 
        'items' => [
            'HTML5 JavaScript CSS3 jQuery Bootstrap Foundation Twig Vue Aurelia SASS'
        ]
    ],

    // - Back-end
    [
        'title' => 'Back-end',
        'color' => 'neon-green',
        'items' => [
            'PHP .net ASP Node PHP .net ASP Node'
        ]
    ],

    // - Frameworks
    [
        'title' => 'Frameworks & CMS',
        'color' => 'neon-blue', 
        'items' => [
            'CakePHP Symfony Yii WordPress Drupal Joomla WooCommerce Prestashop Magento'
        ]
    ],

    // - Logiciels
    [
        'title' => 'Logiciels',
        'color' => 'neon-orange',
        'items' => [
            'CSharp Unity Pascal Java Python XNA CSharp Unity Pascal Java Python XNA'
        ]
    ],

    // - Compétences métiers
    [
        'title' => 'Compétences métiers',
        'color' => 'white', 
        'items' => [
            'Gestion de projet Gestion d\'équipe Relation client Documentation UI/UX Lead developper'
        ]
    ],

];

$discover_message = 'The Game';
