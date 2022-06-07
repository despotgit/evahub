<?php

require "Constants.php";
require_once "config.php";
require_once "Permission.php";

class PermissionBroker
{
    var $connection;

    function setConnection($c)
    {
        $this->connection = $c;
    }

    // Add the indicator to DB
    function updatePermission(Permission $p)
    {
        //print "in updatePermission, p is:<pre>";
        //print_r($p);
        //print "</pre>";

        //return;

        // Add the indicator to DB
        $q = "update acl set value='$p->value' 
            where object='$p->permissionObject' 
            and location='$p->location' 
            and userType='$p->userType'";

        $result = mysqli_query($this->connection, $q);
        return $result;
    }
}
