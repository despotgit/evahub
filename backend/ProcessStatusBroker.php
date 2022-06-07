<?php

require "Constants.php";
require_once "config.php";
require_once "ProcessStatus.php";

class ProcessStatusBroker
{
    var $connection;

    function setConnection($c)
    {
        $this->connection = $c;
    }

    // Add the indicator to DB
    function updateProcessStatus(ProcessStatus $ps)
    {

        $p = $ps->process;
        $s = $ps->status;

        // Add the indicator to DB
        $q = "update process_status set status = '$s' where process = '$p'";

        //error_log("in the status broker");
        //error_log($q);
        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);
        //return $result;
    }
}
