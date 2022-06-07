<?php

require_once "IndicatorBroker.php";
require_once "IndicatorValueBroker.php";
require_once "EuCalculator.php";
require_once "ProcessStatusBroker.php";
require_once "PermissionBroker.php";
require_once "FormulaBroker.php";
require_once "WeightValueBroker.php";
require_once "Prioritizer.php";
require_once "config.php";

class DB
{
    var $indicatorBroker;
    var $indicatorValueBroker;
    var $euCalculator;
    var $processStatusBroker;
    var $permissionBroker;
    var $formulaBroker;
    var $weightValueBroker;
    var $prioritizer;
    var $connection;

    function __construct()
    {
        $this->indicatorBroker = new IndicatorBroker();
        $this->indicatorValueBroker = new IndicatorValueBroker();
        $this->euCalculator = new EuCalculator();
        $this->processStatusBroker = new ProcessStatusBroker();
        $this->permissionBroker = new PermissionBroker();
        $this->formulaBroker = new FormulaBroker();
        $this->weightValueBroker = new WeightValueBroker();
        $this->prioritizer = new Prioritizer();
    }

    function setConnection($c)
    {
        $this->connection = $c;

        $this->indicatorBroker->setConnection($this->connection);
        $this->indicatorValueBroker->setConnection($this->connection);
        $this->euCalculator->setConnection($this->connection);
        $this->prioritizer->setConnection($this->connection);
        $this->processStatusBroker->setConnection($this->connection);
        $this->permissionBroker->setConnection($this->connection);
        $this->formulaBroker->setConnection($this->connection);
        $this->weightValueBroker->setConnection($this->connection);
    }
}
