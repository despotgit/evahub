<?php

require_once "ApiHelper.php";
require_once "Constants.php";
require_once "DB.php";
require_once "config.php";
require_once "Prioritizer.php";

$prio = new Prioritizer();
$prio->setConnection($connect);
$prio->resetAllPriorities();

$q = "select * from indicators_computations_formulas";

$result = mysqli_query($connect, $q);

$ingredients = array();

while ($r = $result->fetch_assoc()) {
    $no = $r["no_of_destination_indicator"];

    echo "In the main prioritization loop, doing indicator $no \n";

    $currentPriority = $prio->getIndicatorFormulaPriority($no);
    $prio->prioritizeBranchOfNode($no, $currentPriority);
}
