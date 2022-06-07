<?php

require_once "ApiHelper.php";
require_once "Constants.php";
require_once "config.php";
require_once "FormulaBroker.php";

class Prioritizer
{
    var $connection;

    // List of ingredients for each indicator
    public $ingredientsList = null;

    // List of ingredients for each indicator
    var $numeratorIngredientsList = null;

    // List of ingredients for each indicator
    var $denominatorIngredientsList = null;

    // List of ingredients for each indicator
    var $equivalenceIngredientsList = null;

    var $formulaBroker;

    // The constructor is private
    // to prevent initiation with outer code.
    public function __construct()
    {
        // The expensive process (e.g.,db connection) goes here.
        $this->formulaBroker = new FormulaBroker();
    }

    function setConnection($c)
    {
        $this->connection = $c;
        $this->formulaBroker->setConnection($c);
    }

    // Get the priority of a formula
    function getIndicatorFormulaPriority($no)
    {
        $q = "select calculation_priority from indicators_computations_formulas where no_of_destination_indicator='" . $no . "'";
        $result = mysqli_query($this->connection, $q);

        $r = $result->fetch_assoc();
        $priority = $r["calculation_priority"];

        //echo "id is: " . $id;

        return $priority;
    }

    // Set the priority of a formula
    function setIndicatorFormulaPriority($no, $p)
    {
        $q = "update indicators_computations_formulas set calculation_priority = " . $p . " where no_of_destination_indicator = '" . $no . "'";
        $result = mysqli_query($this->connection, $q);
    }

    // The recursion function for prioritization process
    function prioritizeBranchOfNode($no, $p)
    {
        echo "----in prioritizeBranchOfNode $no\n";
        $dependants = $this->formulaBroker->getDependantsOfIndicator($no);
        $currentPriority = $this->getIndicatorFormulaPriority($no);
        $newPriority = max($currentPriority, $p);

        echo "----setting priority of $no to $newPriority\n";
        $this->setIndicatorFormulaPriority($no, $newPriority);

        foreach ($dependants as $d) {
            $this->prioritizeBranchOfNode($d, $newPriority + 1);
        }
    }

    // Reset all priorities to 1
    function resetAllPriorities()
    {
        $q = "update indicators_computations_formulas set calculation_priority = 1";
        $result = mysqli_query($this->connection, $q);
    }
}
