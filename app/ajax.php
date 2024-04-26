<?php

$action = strip_tags(htmlentities($_POST['action']));

switch ($action) {

    case 'save-score':

        $score = json_decode($_POST['score']); // Récupère le score envoyé par AJAX
        $data = json_decode(file_get_contents('public/scores.json')); // Lit les scores existants

        if (empty($data)) {
            $data = [];
        }

        // Chercher l'entrée avec le même partyID et pseudo
        $found = false;
        foreach ($data as &$entry) {

            if ($entry->partyID == $score->partyID) {

                $entry->pseudo = $score->pseudo;
                $entry->score = $score->score;
                $entry->partyID = $score->partyID;
                $entry->level = $score->level;
                $entry->clicks[] = $score->click;
                $entry->times[] = $score->time;
                $entry->dateTimes[] = $score->dateTime;

                $found = true;

                break;
            }
        }

        // Si aucune entrée correspondante n'a été trouvée, ajouter une nouvelle entrée
        if (!$found) {

            echo '<pre>'.print_r($score, true).'</pre>';

            $score->times = [];
            $score->times[] = $score->time;
            $score->clicks = [];
            $score->clicks[] = $score->click;
            $score->dateTimes = [];
            $score->dateTimes[] = $score->dateTime;

            unset($score->time);
            unset($score->click);
            unset($score->dateTime);

            array_push($data, $score);

        }

        file_put_contents('public/scores.json', json_encode($data, JSON_PRETTY_PRINT)); // Écrit les scores dans le fichier JSON
        echo "Score sauvegardé avec succès !";

        break;

    case 'get-leaderboard' :

        $data = json_decode(file_get_contents('public/scores.json'));

        usort($data, function($a, $b) {
            
            return $b->score - $a->score;
            
        });

        // - Front
        ob_start();

        // - Headings
        ?><span>Rang</span>
        <span>Joueur</span>
        <span>Score</span>
        <span>Niveau atteint</span>
        <span>Date</span>
        <?php

        // - data  
        foreach ($data as $k => $d) {

            // echo '<pre>'.print_r($d->dateTimes[array_key_last($d->dateTimes)], true).'</pre>';

            ?>
                <span><?= $k + 1; ?></span>
                <span><?= $d->pseudo; ?></span>
                <span><?= $d->score; ?></span>
                <span><?= $d->level; ?></span>
                <span><?= date('d.m.Y', round($d->dateTimes[array_key_last($d->dateTimes)] / 1000)); ?></span>
            <?php

        }

        echo json_encode(['html' => ob_get_clean()]);

        break;

    // case 'set-player-name':

    //     $data = json_decode(file_get_contents('public/scores.json'));

    //     $new_payer_name = strip_tags(htmlentities($_POST['playerName']));

    //     $matching = array_filter($data, function($row) use ($new_payer_name) {

    //         return $row->pseudo == $new_payer_name;

    //     });

    //     echo '<pre>'.print_r($matching, true).'</pre>';

    //     break;


}