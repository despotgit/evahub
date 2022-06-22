<?php

require_once "Constants.php";
require_once "DB.php";
require_once "config.php";

//error_reporting(0);

if (!$cv->verifyJwt()) { // Precautionary call to check if someone tries to use the api without being authorized
    return false;
}

$entity = $_GET["entity"];
