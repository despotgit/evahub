<?php

require_once "ApiHelper.php";
require_once "Constants.php";
require_once "DB.php";
require_once "config.php";
require_once "Prioritizer.php";
require_once "WeightValueBroker.php";


$db = new DB();

$db->setConnection($connect);

$b = new WeightValueBroker();
$b = $db->weightValueBroker;

$result = $b->getAllWeightsValuesTree();

print "and now:<pre>";
//print_r($result);

print_r($result);

print "</pre>";
