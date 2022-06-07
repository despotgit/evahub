<?php

require_once "config.php";
require_once "ApiHelper.php";
require_once "Constants.php";
require_once "CredentialsVerificator.php";
require_once "vendor/autoload.php";
require_once "DB.php";
require_once "Indicator.php";
require_once "IndicatorValue.php";

$db = new DB();
$db->setConnection($connect);
$cv = new CredentialsVerificator();

$apiHelper = new ApiHelper();
$apiHelper->db = $db;

$uri = $_SERVER['REQUEST_URI'];


/*

    1. select one by one row from calculations table, which is containing the updated formulas and no_of_indicator for which formulas are valid
    2. join them with indicators_computations_formulas table
    3. compare the ingredients from the two, if there are any differences, log them on-screen or in a log file.

*/

$q = "select c.formula as checky, 
      icf.no_of_destination_indicator,
      icf.nos_of_indicators_in_numerator_sum as numerator_nos, 
      icf.nos_of_indicators_in_denominator_sum as denominator_nos,
      icf.divide_result_by,
      icf.divide_by_eu_total as divide_by_eu_total
      from indicators_computations_formulas_raw_check_table c 
      join indicators_computations_formulas icf on c.no_of_indicator = icf.no_of_destination_indicator;";


$result = mysqli_query($connect, $q);

$ret = "";

$separator = "\n";

while ($r = $result->fetch_assoc()) {

    $no = $r["no_of_destination_indicator"];

    //print "Begin!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!r is:<pre>";
    //print_r($r);
    //print "</pre>";

    // Control formula
    $c = $r["checky"];

    // First separate the numerator and denominator parts of the control formula
    $ce = explode("/", $c);

    // Process the numerator string from the control table
    if (count($ce) > 0) {
        $cn = $ce[0];
        $cn = str_replace("(", "", $cn);
        $cn = str_replace(")", "", $cn);
        $cn = explode("+", $cn);
        $controlNumeratorArray = array(); // Numerator sum indicators array
        foreach ($cn as $n) {
            array_push($controlNumeratorArray, trim($n, " "));
        }
    }

    // Process the denominator string from the control table
    if (count($ce) > 1) {
        $cd = $ce[1];
        $cd = str_replace("(", "", $cd);
        $cd = str_replace(")", "", $cd);
        $cd = explode("+", $cd);
        $controlDenominatorArray = array(); // Denominator sum indicators array

        foreach ($cd as $d) {
            array_push($controlDenominatorArray, trim($d, " "));
        }
    }

    //print "controlNumeratorArray is:<pre>";
    //print_r($controlNumeratorArray);
    //print "</pre>";

    //print "controlDenominatorArray is:<pre>";
    //print_r($controlDenominatorArray);
    //print "</pre>";

    //if (!empty($r["numerator_nos"])) $existingNumeratorArray = explode(",", $r["numerator_nos"]);
    //if (!empty($r["denominator_nos"])) $existingDenominatorArray = explode(",", $r["denominator_nos"]);
    //if (!empty($r["divide_result_by"])) $existingDivisor = $r["divide_result_by"];
    //if (!empty($r["divide_by_eu_total"])) $existingDivideByEuTotal = $r["divide_by_eu_total"];

    $existingNumeratorArray = empty($r["numerator_nos"]) ? null : explode(",", $r["numerator_nos"]);
    $existingDenominatorArray = empty($r["denominator_nos"]) ? null : explode(",", $r["denominator_nos"]);
    if (!empty($r["divide_result_by"])) $existingDivisor = $r["divide_result_by"];
    if (!empty($r["divide_by_eu_total"])) $existingDivideByEuTotal = $r["divide_by_eu_total"];

    // Set to all caps
    $arr1 = array();
    foreach ($existingNumeratorArray as $el) {
        array_push($arr1, strtoupper($el));
    }
    $existingNumeratorArray = $arr1;

    $arr2 = array();
    foreach ($existingDenominatorArray as $el) {
        array_push($arr2, strtoupper($el));
    }
    $existingDenominatorArray = $arr2;

    $arr3 = array();
    foreach ($controlNumeratorArray as $el) {
        array_push($arr3, strtoupper($el));
    }
    $controlNumeratorArray = $arr3;

    $arr4 = array();
    foreach ($controlDenominatorArray as $el) {
        array_push($arr4, strtoupper($el));
    }
    $controlDenominatorArray = $arr4;

    //print "existingNumeratorArray is:<pre>";
    //print_r($existingNumeratorArray);
    //print "</pre>";

    //print "existingDenominatorArray is:<pre>";
    //print_r($existingDenominatorArray);
    //print "</pre>";


    // Numerators check
    if (count($ce) > 0) {
        //echo "CHECKPOINT 1";

        // Check if all control numerator indicators are in db numerator list
        foreach ($controlNumeratorArray as $cni) {
            //echo "CHECKPOINT 2";
            if (!in_array($cni, $existingNumeratorArray)) {
                //echo "CHECKPOINT 3";
                $ret .= $separator . "Indicator: " . $no . ": " . $cni . " should be in formula in numerator but it's not.";
            }
        }

        // Check if all db numerator indicators are in control numerator list
        foreach ($existingNumeratorArray as $eni) {
            if (!in_array($eni, $controlNumeratorArray)) {
                $ret .= $separator . "Indicator: " . $no . ": " . $eni . " should not be in formula in numerator but it is.";
            }
        }
    }

    // Denominators check
    if (count($ce) > 1) {

        // Check if all control denominator indicators are in db denominator list
        foreach ($controlDenominatorArray as $cdi) {
            //echo "no is: $no , existing divisor is:" . $existingDivisor;
            //echo "is_null existingdivisor is: " . is_null($existingDivisor);
            //echo "cdi is: " . $cdi;

            //echo "no is: $no , existing eu is:" . $existingDivideByEuTotal;
            //echo "is_null existingDivideByEuTotal is: " . is_null($existingDivideByEuTotal);
            //echo "cdi is: " . $cdi . "\n";

            if (
                ($cdi != "EU" && !in_array($cdi, $existingDenominatorArray) && ($cdi != $existingDivisor))
                || ($cdi == 'EU' && $existingDivideByEuTotal != 1)
            ) {
                $ret .= $separator . "Indicator: " . $no . ": " . $cdi . " should be in formula in denominator but it's not.";
            }
        }

        // Check if all db denominator indicators are in control denominator list

        if (!empty($existingDenominatorArray)) {
            foreach ($existingDenominatorArray as $edi) {
                if (!in_array($edi, $controlDenominatorArray)) {

                    //print "indicator: $no<pre>";
                    //print_r($existingDenominatorArray);
                    //print "</pre>";

                    //print "denominator_nos is:<pre>";
                    //print_r($r["denominator_nos"]);
                    //print "</pre>";

                    //echo "no is: $no";

                    //echo "edi is: " . $edi;

                    $ret .= $separator . "Indicator: " . $no . ": " . $edi . " should not be in formula in denominator but it is.";
                }
            }
        }
    }
}

echo json_encode($ret);
