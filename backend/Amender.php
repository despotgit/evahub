<?php

set_time_limit(7200);

require_once "DB.php";
require_once "config.php";
require_once "IndicatorBroker.php";
require_once "IndicatorValueBroker.php";
require_once "ProcessStatusBroker.php";

class Amender
{
    var $connection;

    function setConnection($c)
    {
        $this->connection = $c;
    }

    function makeAmendments()
    {
        ini_set('display_errors', 1);

        //error_reporting(E_ALL);
        error_reporting(E_ALL);

        $q = "update indicators_values_final_amendments am 
        join indicators i 
        on (i.no_of_indicator = am.no_of_indicator)
        join indicators_values iv 
        on (iv.country_code = am.country_code and iv.year = am.year and iv.indicator_id = i.indicator_id)
        set iv.value = am.value";

        $result = mysqli_query($this->connection, $q);
    }
}
