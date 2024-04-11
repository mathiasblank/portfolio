<?php

    $no_cache_querystring = '?v=' . time();

?>
<!DOCTYPE html>
<html lang="fr" style="overflow: hidden;">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mathias Blank</title>
        <link rel="stylesheet" href="<?= USE_MIN_CSS ? _CSS_ . 'min.css' : _ASSETS_CSS_ . 'main.css'; ?>">
        <link rel="stylesheet" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">    </head>

        <!-- Default favicons -->
        <link rel="icon" type="image/x-icon" href="/app/public/img/favicon/favicon.ico">
        <link rel="icon" type="image/png" sizes="16x16" href="/app/public/img/favicon/favicon-16x16.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/app/public/img/favicon/favicon-32x32.png">

        <!-- Apple favicons -->
        <link rel="apple-touch-icon" sizes="57x57" href="/app/public/img/favicon/apple-touch-icon.png">

        <!-- Android favicons -->
        <link rel="icon" type="image/png" sizes="192x192" href="/app/public/img/favicon/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="512x512" href="/app/public/img/favicon/android-icon-512x512.png">
        
        <!-- Manifest & Theme -->
        <meta name="theme-color" content="#1d1d1d">
        <meta name="msapplication-TileColor" content="#1d1d1d">
        <link rel="manifest" href="/manifest.json">

    <body class="theme--<?= DEFAULT_THEME; ?>" style="opacity: 0">

        <?php require_once _PARTS_.'main-menu.php'; ?>
        <?php require_once _PARTS_.'theme-switcher.php'; ?>
        
        <div id="page_container">

            <div id="page">