<!DOCTYPE HTML>

<?php
header('Cross-Origin-Opener-Policy: same-origin');
header('Cross-Origin-Embedder-Policy: require-corp');

$host = $_SERVER['HTTP_HOST'];
$isLocalhost = str_contains($host, 'localhost');
$isTest = str_contains($host, 'test');
$isProd = !$isTest && !$isLocalhost;
$root = $isLocalhost ? '/othello-blackboard/dist/' : '/';
$assets = require __DIR__ . '/assets.php';
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
    <link href="<?= $assets['main.css'] ?>" rel="stylesheet">

    <!-- PWA -->
    <link rel="manifest" href="<?= $root ?>manifest.json">
    <meta name="theme-color" content="#2c3e50">
    <link rel="icon" href="<?= $root ?>icons/icon-192.png">
</head>

<body>

    <div id="board"></div>

    <div id="side" class="p-1">

        <!-- div class="d-flex justify-content-end w-100 p-2">
            <button class="btn btn-success">Login</button>
        </div -->

        <ul class="nav nav-tabs w-auto flex-nowrap" id="mainTabs" role="tablist">
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

            <!-- li class="nav-item" role="presentation">
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
            </li -->
        </ul>

        <!-- TAB CONTENT -->
        <div id="mode-content" class="tab-content">

            <div class="tab-pane fade show active p-1" id="play" role="tabpanel">
                <div class="d-flex justify-content-center flex-nowrap gap-2 my-2">
                    <div id="black-score" class="text-center px-1" style="min-width:3ch">2</div>
                    <div class="text-center"><i style="color: black;" class="bi bi-circle-fill"></i></div>
                    <div class="text-center px-2"><i id="turn" style="color: black;" class="bi bi-caret-left-fill"></i>
                    </div>
                    <div class="text-center"><i style="color: white;" class="bi bi-circle-fill"></i></div>
                    <div id="white-score" class="text-center px-1" style="min-width:3ch">2</div>
                </div>
                <div class="text-center my-2">
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
                <div id="move-history">
                    <div class="move-row main" data-line="0"></div>
                </div>
            </div>

            <div class="tab-pane fade" id="set" role="tabpanel">
                <div class="row my-2">
                    <div class="col d-flex justify-content-center">
                        <div class="btn-group" role="group" aria-label="Toggle group">

                            <input type="radio" class="btn-check" name="options" id="black-stone" autocomplete="off"
                                   checked>
                            <label class="btn btn-outline-success" style="color: black;" for="black-stone"><i
                                        class="bi bi-circle-fill"></i></label>

                            <input type="radio" class="btn-check" name="options" id="empty-square"
                                   autocomplete="off">
                            <label class="btn btn-outline-success" style="color: black;" for="empty-square"><i
                                        class="bi bi-x-square"></i></label>

                            <input type="radio" class="btn-check" name="options" id="white-stone"
                                   autocomplete="off">
                            <label class="btn btn-outline-success" style="color: white;" for="white-stone"><i
                                        class="bi bi-circle-fill"></i></label>

                        </div>
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col d-flex justify-content-center">
                        <div class="btn-group" role="group" aria-label="Toggle group">
                            <input type="radio" class="btn-check" name="turn-options" id="black-turn"
                                   autocomplete="off"
                                   checked>
                            <label class="btn btn-outline-success" style="color: black;" for="black-turn"><i
                                        class="bi bi-caret-left-fill"></i></label>

                            <input type="radio" class="btn-check" name="turn-options" id="white-turn"
                                   autocomplete="off">
                            <label class="btn btn-outline-success" style="color: white;" for="white-turn"><i
                                        class="bi bi-caret-right-fill"></i></label>
                        </div>
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col d-flex justify-content-center">
                        <button id="reset-position" class="btn btn-success  lh-1 mx-2">
                            <i class="bi bi-circle-fill" style="color: white;"></i><i class="bi bi-circle-fill"
                                                                                      style="color: black;"></i><br>
                            <i class="bi bi-circle-fill" style="color: black;"></i><i class="bi bi-circle-fill"
                                                                                      style="color: white;"></i>
                        </button>
                        <button id="empty-position" class="btn btn-success  lh-1 mx-2">
                            <i class="bi bi-square" style="color: black;"></i><i class="bi bi-square"
                                                                                 style="color: black;"></i><br>
                            <i class="bi bi-square" style="color: black;"></i><i class="bi bi-square"
                                                                                 style="color: black;"></i>
                        </button>
                    </div>
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

<script src="<?= $assets['main.js'] ?>"></script>
<script type="module" src="sensei.js"></script>

</body>
</html>
