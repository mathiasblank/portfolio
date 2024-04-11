<?php

// $start = strtotime('01.02.2018');
// $end = time();
// $diff = $end - $start;

$neue_start = new DateTime("2018-02-01");
$now = new DateTime();
$difference = $neue_start->diff($now);
$km_per_day = round(6 * 2 * 4 * 70 / 365); /* twice a week 70km during ~6months */

$experiences = [

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
        'skills' => ['html5', 'php', 'xml', 'js', 'css3', 'sass', 'grunt', 'requirejs'],
        'projects' => [
            'admed.ch',
            'cinqsurcinq.ch',
            'cpih.ch',
            'ccih.ch',
            'cic-broker.ch',
            'cimier.com',
            'cmdp.swiss',
            'dctechnique.ch',
            'dentistes-fontaine.ch',
            'integra-avocats.ch',
            'jokers.design',
            'reform2.ch',
            'rufusjwoodson.ch',
            'comec.ch',
            'intensityworkout.ch',
            'leutwilersa.ch',
            'metiers-horlogerie.ch',
            'paul-picot.com',
            'durhonechocolatier.ch',
            'festineuch.ch',
            'truthce.com',
            'infosuisse.ch',
            'jacotchocolatier.ch',
            'caves-beroche.ch',
            'dctechnique.ch',
            'watch-academy.com',
            'medin.swiss',
        ],
        'description' => "Responsable technique au sein d'une agence de communication.
            <ul class=\"styled\">
                <li>Développement et maintient de sites et ce principalement sur <mark>WordPress</mark> 4.8+</li>
                <li>Sites e-commerce avec comme base <mark>WooCommerce</mark></li>
                <li>Sites sur mesure avec ou sans CMS</li>
                <li>Landing pages</li>
                <li>Templates de mails, des documentations interactives</li>
                <li>Conseils techniques, de l'analyse de base de données</li>
                <li>Analyse UI/UX, de la création de plugins/templates</li>
                <li>Stratégie et conseils SEO, de l'hébergement, des campagnes adwords...</li>
                <li>Développement et utilisation d'API.</li>
                <li>Développement et maintien d'un framework MVC.</li>
                <li>Élaboration des processus</li>
                <li>gestion des projets comme <mark>scrum master</mark>.</li>
                <li>Formation et l'encadrement de l'équipe digitale et le développement et le maintient des outils et documentations internes.</li>
            </ul>",
        'link' => [
            'title' => 'neue.swiss',
            'url' => 'https://neue.swiss'
        ]
    ],

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
        'projects' => ['lesfleurs.ch'],
        'description' => "Amélioration, entretien et migration du site de vente en ligne ainsi que de la plateforme de gestion. Collaboration avec les différents départements, de la logistique au marketing en passant par la comptabilité. Voici quelques projets menés afin de rendre la vie des collaborateurs plus simple: <ul class=\"styled\"><li>Algorithme d'apprentissage de corrections des numéros de téléphone</li><li>développement du nouveau site e-commerce (surtout front-end)</li><li>impressions pdf des cartes</li><li>gestion des données d'envoi</li><li> système de scan permettant la validation simplifiée de la préparation des colis</li></ul>Tout ceci commençait toujours pas passer quelques jours à <mark>observer</mark> les collaborateurs puis à leurs proposer des <mark>solutions pouvant les aider</mark>.",
        'link' => [
            'title' => 'lesfleurs.ch',
            'url' => 'https://lesfleurs.ch'
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

$discover_message = 'Impossible';
