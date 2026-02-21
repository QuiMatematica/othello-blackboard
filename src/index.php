<!DOCTYPE HTML>

<?php
$host = $_SERVER['HTTP_HOST'];
$isLocalhost = str_contains($host, 'localhost');
$isTest = str_contains($host, 'test');
$isProd = !$isTest && !$isLocalhost;
$root = $isLocalhost ? '/othello-blackboard/dist/' : '/';
?>

<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description"
          content="Othello blackboard">
    <meta name="keywords"
          content="Othello blackboard">
    <link rel="canonical" href="https://<?= $host ?>">
    <meta property="og:title" content="Othello blackboard">
    <meta property="og:url" content="https://<?= $host ?>">
    <meta property="og:image" content="https://<?= $host ?>/images/banner2025.jpg?t=20260220">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/jpg">
    <meta property="og:type" content="website">
    <meta property="og:description"
          content="Othello blackboard">
    <meta property="og:locale" content="it_IT"/>
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:domain" content="<?= $host ?>">
    <meta name="twitter:url" content="https://<?= $host ?>">
    <meta name="twitter:title" content="Othello blackboard">
    <meta name="twitter:description"
          content="Othello blackboard">
    <meta name="twitter:image" content="https://<?= $host ?>/images/banner2025.jpg?t=20260220">
    <meta name="author" content="Claudio Signorini">

    <title>Othello blackboard</title>
    <link href="<?= $root ?>css/othello.css" rel="stylesheet">

    <!-- PWA -->
    <link rel="manifest" href="<?= $root ?>manifest.json">
    <meta name="theme-color" content="#2c3e50">
    <link rel="icon" href="<?= $root ?>icons/icon-192.png">
</head>

<body>

<div class="wrapper">
    <div id="board"></div>

    <div class="side">

        <div class="container-fluid p-0">

            <div class="d-flex justify-content-end w-100 p-2">
                <button class="btn btn-success">Login</button>
            </div>

            <ul class="nav nav-pills nav-fill mb-3 custom-pills" id="mainTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active"
                            id="play-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#play"
                            type="button"
                            role="tab">
                        <i class="bi bi-play-btn"></i>
                    </button>
                </li>

                <li class="nav-item" role="presentation">
                    <button class="nav-link"
                            id="set-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#set"
                            type="button"
                            role="tab">
                        <i class="bi bi-circle-half"></i>
                    </button>
                </li>

                <li class="nav-item" role="presentation">
                    <button class="nav-link"
                            id="draw-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#draw"
                            type="button"
                            role="tab">
                        <i class="bi bi-pencil"></i>
                    </button>
                </li>

                <li class="nav-item" role="presentation">
                    <button class="nav-link"
                            id="lessons-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#lessons"
                            type="button"
                            role="tab">
                        <i class="bi bi-folder"></i>
                    </button>
                </li>
            </ul>

            <!-- TAB CONTENT -->
            <div class="tab-content">

                <div class="tab-pane fade show active" id="play" role="tabpanel">
                    <div class="d-flex justify-content-center flex-nowrap gap-2 mt-5">
                        <div id="black-score" class="text-center px-2">2</div>
                        <div class="text-center px-2"><i class="bi bi-circle-fill"></i></div>
                        <div class="text-center px-2"><i id="turn" class="bi bi-caret-left-fill"></i></div>
                        <div class="text-center px-2"><i class="bi bi-circle"></i></div>
                        <div id="white-score" class="text-center px-2">2</div>
                    </div>
                    <div class="text-center my-3">
                        <div class="btn-group btn-group-sm" role="group" aria-label="Gruppo di controlli">
                            <button id="first" class="btn btn-success bi bi-chevron-bar-left" data-counter="0"
                                    disabled=""></button>
                            <button id="prev" class="btn btn-success bi bi-chevron-left" data-counter="0"
                                    disabled=""></button>
                            <button id="next" class="btn btn-success bi bi-chevron-right" data-counter="0"
                                    disabled=""></button>
                            <button id="last" class="btn btn-success bi bi-chevron-bar-right" data-counter="0"
                                    disabled=""></button>
                        </div>
                    </div>
                </div>

                <div class="tab-pane fade d-flex justify-content-center" id="set" role="tabpanel">
                    <div class="btn-group mt-5" role="group" aria-label="Toggle group">

                        <input type="radio" class="btn-check" name="options" id="opt1" autocomplete="off" checked>
                        <label class="btn btn-outline-success" style="color: black;" for="opt1"><i class="bi bi-circle-fill"></i></label>

                        <input type="radio" class="btn-check" name="options" id="opt2" autocomplete="off">
                        <label class="btn btn-outline-success" style="color: white;" for="opt2"><i class="bi bi-circle-fill"></i></label>

                        <input type="radio" class="btn-check" name="options" id="opt3" autocomplete="off">
                        <label class="btn btn-outline-success" style="color: black;" for="opt3"><i class="bi bi-x-square"></i></label>

                    </div>
                </div>

                <div class="tab-pane fade"
                     id="draw"
                     role="tabpanel">
                    Draw
                </div>

                <div class="tab-pane fade"
                     id="lessons"
                     role="tabpanel">
                    Lessons
                </div>

            </div>
        </div>
    </div>
</div>

<script src="js/othello.js"></script>

</body>
</html>
