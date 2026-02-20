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
    <div class="board"></div>

    <div class="side">
        CONTROLLI
    </div>
</div>

<script src="js/othello.js"></script>

</body>
</html>
