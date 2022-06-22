<?php

require_once "config.php";

class DB
{
    public $connection;

    public function __construct()
    {
        
    }

    public function setConnection($c)
    {
        $this->connection = $c;

        
    }
}
