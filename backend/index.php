<?php

require_once "config.php";
require_once "ApiHelper.php";
require_once "Constants.php";
require_once "CredentialsVerificator.php";
require_once "vendor/autoload.php";
require_once "DB.php";
require_once "Indicator.php";
require_once "IndicatorValue.php";

error_reporting(0);

$db = new DB();
$db->setConnection($connect);
$cv = new CredentialsVerificator();

$apiHelper = new ApiHelper();
$apiHelper->db = $db;

$uri = $_SERVER['REQUEST_URI'];

$factors = explode("/", $uri);

//print "<pre>";
//print_r($factors);
//print "</pre>";

// method(POST o GET) / operation / entity / verb / data
$method = $factors[3]; // GET or POST

if ("get" == strtolower($method)) {

    require "get.php";
}

if ("post" == strtolower($method)) {

    require "post.php";
}
