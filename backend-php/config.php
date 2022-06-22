<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept");

// Needed for the password check
define("SALT", "J75prrWYDVabYXDbV8tV");

require_once "jwtAuthenticationServer.php";

$productionServerDbSchema = "CUP";
$devDbSchema = "CUP";
$useLocalDbOnTheWindowsDevMachine = true;

// Take DB credentials based on the server files are on:

// Check if we are on Theseus server
$serverRoot = $_SERVER["DOCUMENT_ROOT"];

if ($serverRoot == "/srv/www/theseus-test/") {
    $server = "theseus";
} else {
    if ($serverRoot == "C:/xampp/htdocs") {
        $server = "xampp";
    } else {
        $server = "other";
    }
}

// Set the values in case we are on theseus (production) server
if ("theseus" == $server) {

    define('DB_HOST', 'as-sitafs.jrc.org');
    define('DB_NAME', $productionServerDbSchema);
    define('DB_USER', 'CUP_admin');
    define('DB_PASS', '#CUP-admin!');
}

// Set the values in case we are on the Windows development machine (in the JRC Ispra office)
if ("xampp" == $server) {

    if ($useLocalDbOnTheWindowsDevMachine) {
        define('DB_HOST', 'localhost');
        define('DB_NAME', $devDbSchema);
        define('DB_USER', 'root');
        define('DB_PASS', '');
    } else {
        define('DB_HOST', 'as-sitafs.jrc.org');
        define('DB_NAME', $devDbSchema);
        define('DB_USER', 'CUP_admin');
        define('DB_PASS', '#CUP-admin!');
    }
}

// Macbook environment. Set the values in case we are on another dev machine, so using custom DB credentials
if (
    $server != "xampp" &&
    $server != "theseus"
) {
    define('DB_HOST', 'localhost');
    define('DB_NAME', $devDbSchema);
    define('DB_USER', 'root');
    define('DB_PASS', 'root');
}

$connect = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
//mysqli_set_charset($connect, "utf32");

if (mysqli_connect_errno($connect)) {
    die("Failed to connect:" . mysqli_connect_error());
}
