<?php

set_time_limit(7200);

require_once "DB.php";
require_once "config.php";
require_once "IndicatorBroker.php";
require_once "IndicatorValueBroker.php";
require_once "ProcessStatusBroker.php";

class Calculator
{
    var $connection;

    function setConnection($c)
    {
        $this->connection = $c;
    }

    function recalculateAll($showPlanOnly = false, $onlyReadyIndicators = false)
    {
        error_reporting(E_ALL);
        /*
 
        1. Go through each ready regular formula, and take its no
        2. For that no:
            2.1. Run the formula for that no and 
            2.2. Run the exception formulas for that no
         
        */

        if ($onlyReadyIndicators) {
            $q = "select * from indicators_computations_formulas where is_ready_for_recalculation order by calculation_priority asc";
        } else {
            $q = "select * from indicators_computations_formulas order by calculation_priority asc";
        }


        $result = mysqli_query($this->connection, $q);

        // Traverse all individual formulas and run them
        while ($r = $result->fetch_assoc()) {
            $no = $r["no_of_destination_indicator"];
            $this->runRegularFormulaForIndicator($no, $showPlanOnly);
            $this->runExceptionFormulasForIndicator($no, $showPlanOnly);
        }
    }

    function runRegularFormulaForIndicator($no, $showPlanOnly = false)
    {
        $connect = $this->connection;

        $q = "select * from indicators_computations_formulas where no_of_destination_indicator='$no'";

        $result = mysqli_query($connect, $q);

        // Traverse all found individual formulas and run them
        while ($r = $result->fetch_assoc()) {

            $this->runFormulaInstructionSet($r, $showPlanOnly);
        }

        return $result;
    }

    function runAllRegularFormulas($showPlanOnly = false)
    {
        $connect = $this->connection;

        $q = "select * from indicators_computations_formulas order by calculation_priority asc";

        $result = mysqli_query($connect, $q);

        // Traverse all individual formulas and run them
        while ($r = $result->fetch_assoc()) {

            $this->runFormulaInstructionSet($r, $showPlanOnly);
        }

        return $result;
    }

    function runAllReadyRegularFormulas($showPlanOnly = false)
    {
        $connect = $this->connection;

        $q = "select * from indicators_computations_formulas where is_ready_for_recalculation order by calculation_priority asc";

        $result = mysqli_query($connect, $q);

        // Traverse all individual formulas and run them
        while ($r = $result->fetch_assoc()) {

            $this->runFormulaInstructionSet($r, $showPlanOnly);
        }

        return $result;
    }

    function runExceptionFormulasForIndicator($no, $showPlanOnly = false)
    {
        $connect = $this->connection;

        $q = "select * from indicators_computations_formulas_exceptions 
            where no_of_destination_indicator='$no' order by calculation_priority asc";

        $result = mysqli_query($connect, $q);

        // Traverse all individual formulas and run them
        while ($r = $result->fetch_assoc()) {
            $this->runFormulaInstructionSet($r, $showPlanOnly);
        }

        return $result;
    }

    function runAllExceptionFormulas($showPlanOnly = false)
    {
        $q = "update indicators_computations_formulas_exceptions set is_ready_for_recalculation = 1";

        $result = mysqli_query($this->connect, $q);

        $this->runAllReadyExceptionFormulas($showPlanOnly);
    }


    function runAllReadyExceptionFormulas($showPlanOnly = false)
    {
        $connect = $this->connection;

        $q = "select * from indicators_computations_formulas_exceptions where is_ready_for_recalculation order by calculation_priority asc";

        $result = mysqli_query($connect, $q);

        // Traverse all individual formulas and run them
        while ($r = $result->fetch_assoc()) {
            $this->runFormulaInstructionSet($r, $showPlanOnly);
        }

        return $result;
    }

    // Run a particular formula with all data pieces given
    function runFormulaInstructionSet($r, $showPlanOnly)
    {

        $connect = $this->connection;

        //$no = explode(',', $r["no_of_destination_indicator"]);
        //$no = $no[0];
        $no = $r["no_of_destination_indicator"];

        $num = null;
        if ($r["nos_of_indicators_in_numerator_sum"]) {
            $num = explode(',', $r["nos_of_indicators_in_numerator_sum"]);
        }

        //print "up:<pre>";
        //print_r($num);
        //print "</pre>";

        $den = null;
        if ($r["nos_of_indicators_in_denominator_sum"]) {
            $den = explode(',', $r["nos_of_indicators_in_denominator_sum"]);
        }

        //print "down:<pre>";
        //print_r($den);
        //print "</pre>";

        $equ = null;
        if ($r["nos_of_indicators_for_equivalence_formula"]) {
            $equ = explode(',', $r["nos_of_indicators_for_equivalence_formula"]);
        }

        //print "equ:<pre>";
        //print_r($equ);
        //print "</pre>";

        $applyToYear = null;

        $applyToYear = $r["apply_to_year"];

        if (empty($applyToYear) || 0 == $applyToYear || "ALL" == strtoupper($applyToYear)) {
            $applyToYear = 'null';
        }

        $prioritizeCalculateFromComputed = $r["prioritize_calculate_from_computed"];
        if ($prioritizeCalculateFromComputed) {
            $prioritizeCalculateFromComputed = "true";
        } else {
            $prioritizeCalculateFromComputed = "false";
        }

        $ignoreFileTypeForDb = true;

        $fileType = $r["file_type"];

        if ("none" == $fileType || $ignoreFileTypeForDb) {
            //
            $fileType = "null";
        } else {
            $fileType = "'$fileType'";
        }

        //print "file type is:";
        //print_r($fileType);
        //print "</pre>";

        $divisor = $r["divide_result_by"];

        $divideByEuTotal = $r["divide_by_eu_total"];
        if ($divideByEuTotal) {
            $divideByEuTotal = 'true';
        } else {
            $divideByEuTotal = 'false';
        }

        // Whether to keep the raw or not, for the time being
        $keepRaw = $r["keep_raw_number_if_not_computable"];
        if ($keepRaw) {
        } else {
            $sp = "call sp_remove_indicators_values_by_no('$no', $applyToYear)";
            echo $sp . ";\n";
            if ($showPlanOnly) {
            } else {
                $spResult = mysqli_query($connect, $sp);
            }
        }

        //print "divide_by_eu_total is:";
        //print_r($divideByEuTotal);
        //print "</pre>";

        if (!empty($r["fixed_value"])) {
            $v = $r["fixed_value"];
            $sp = "call sp_calculate_iv_from_fixed_value('$no','$v',$applyToYear)";
        } else {

            if ($r["is_equivalence_formula"] == 1) {
                if (count($equ) == 2) {
                    // process it separately, make equivalence-of-3 as equivalence-of-2-plus-the-first
                    $sp = "call sp_calculate_iv_for_indicator_based_on_3_indicators_equivalence('$no','$equ[0]','$equ[1]','$equ[1]',$applyToYear,null)";
                }

                if (count($equ) == 3) {
                    //
                    $sp = "call sp_calculate_iv_for_indicator_based_on_3_indicators_equivalence('$no','$equ[0]','$equ[1]','$equ[2]',$applyToYear,null)";
                }
            } else {

                if (count($num) == 1) {
                    if (count($den) == 0) {
                        //
                        $sp = "call sp_calculate_iv_from_1_indicator('$no','$num[0]',$applyToYear,$fileType,$prioritizeCalculateFromComputed,$divisor,$divideByEuTotal)";
                    }

                    if (count($den) == 1) {
                        //
                        $sp = "call sp_calculate_iv_from_1_over_1_indicators('$no','$num[0]','$den[0]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 2) {
                        //
                        $sp = "call sp_calculate_iv_from_1_over_2_indicators('$no','$num[0]','$den[0]','$den[1]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 3) {
                        //
                        $sp = "call sp_calculate_iv_from_1_over_3_indicators('$no','$num[0]','$den[0]','$den[1]','$den[2]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 4) {
                        //
                        $sp = "call sp_calculate_iv_from_1_over_4_indicators('$no','$num[0]','$den[0]','$den[1]','$den[2]','$den[3]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 6) {
                        //
                        $sp = "call sp_calculate_iv_from_1_over_6_indicators('$no','$num[0]','$den[0]','$den[1]','$den[2]','$den[3]','$den[4]','$den[5]',$applyToYear,$fileType,$divisor)";
                    }
                }

                if (count($num) == 2) {
                    if (count($den) == 0) {
                        //
                        $sp = "call sp_calculate_iv_from_2_indicators_sum('$no','$num[0]','$num[1]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 1) {
                        //
                        $sp = "call sp_calculate_iv_from_2_over_1_indicators('$no','$num[0]','$num[1]','$den[0]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 2) {
                        //
                        $sp = "call sp_calculate_iv_from_2_over_2_indicators('$no','$num[0]','$num[1]','$den[0]','$den[1]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 3) {
                        //
                        $sp = "call sp_calculate_iv_from_2_over_3_indicators('$no','$num[0]','$num[1]','$den[0]','$den[1]','$den[2]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 4) {
                        //
                        $sp = "call sp_calculate_iv_from_2_over_4_indicators('$no','$num[0]','$num[1]','$den[0]','$den[1]','$den[2]','$den[3]',$applyToYear,$fileType,$divisor)";
                    }


                    if (count($den) == 6) {
                        //
                        $sp = "call sp_calculate_iv_from_2_over_6_indicators('$no','$num[0]','$num[1]','$den[0]','$den[1]','$den[2]','$den[3]','$den[4]','$den[5]',$applyToYear,$fileType,$divisor)";
                    }
                }

                if (count($num) == 3) {
                    if (count($den) == 0) {
                        //
                        $sp = "call sp_calculate_iv_from_3_indicators_sum('$no','$num[0]','$num[1]','$num[2]',$applyToYear,$fileType,$divisor)";
                    }
                    if (count($den) == 6) {
                        //
                        $sp = "call sp_calculate_iv_from_3_over_6_indicators('$no','$num[0]','$num[1]','$num[2]','$den[0]','$den[1]','$den[2]','$den[3]','$den[4]','$den[5]',$applyToYear,$fileType,$divisor)";
                    }
                }

                if (count($num) == 4) {
                    if (count($den) == 0) {
                        //
                        $sp = "call sp_calculate_iv_from_4_indicators_sum('$no','$num[0]','$num[1]','$num[2]','$num[3]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 1) {
                        //
                        $sp = "call sp_calculate_iv_from_4_over_1_indicators('$no','$num[0]','$num[1]','$num[2]','$num[3]','$den[0]',$applyToYear,$fileType,$divisor)";
                    }
                }

                if (count($num) == 5) {
                    if (count($den) == 0) {
                        //
                        $sp = "call sp_calculate_iv_from_5_indicators_sum('$no','$num[0]','$num[1]','$num[2]','$num[3]','$num[4]',$applyToYear,$fileType,$divisor)";
                    }
                }

                if (count($num) == 6) {

                    if (count($den) == 0) {
                        //
                        $sp = "call sp_calculate_iv_from_6_indicators_sum('$no','$num[0]','$num[1]','$num[2]','$num[3]','$num[4]','$num[5]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 1) {
                        //
                        $sp = "call sp_calculate_iv_from_6_over_1_indicators('$no','$num[0]','$num[1]','$num[2]','$num[3]','$num[4]','$num[5]','$den[0]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 2) {
                        //
                        $sp = "call sp_calculate_iv_from_6_over_2_indicators('$no','$num[0]','$num[1]','$num[2]','$num[3]','$num[4]','$num[5]','$den[0]','$den[1]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 3) {
                        //
                        $sp = "call sp_calculate_iv_from_6_over_3_indicators('$no','$num[0]','$num[1]','$num[2]','$num[3]','$num[4]','$num[5]','$den[0]','$den[1]','$den[2]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 4) {
                        //
                        $sp = "call sp_calculate_iv_from_6_over_4_indicators('$no','$num[0]','$num[1]','$num[2]','$num[3]','$num[4]','$num[5]','$den[0]','$den[1]','$den[2]','$den[3]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 5) {
                        //
                        $sp = "call sp_calculate_iv_from_6_over_5_indicators('$no','$num[0]','$num[1]','$num[2]','$num[3]','$num[4]','$num[5]','$den[0]','$den[1]','$den[2]','$den[3]','$den[4]',$applyToYear,$fileType,$divisor)";
                    }

                    if (count($den) == 6) {
                        //
                        $sp = "call sp_calculate_iv_from_6_over_6_indicators('$no','$num[0]','$num[1]','$num[2]','$num[3]','$num[4]','$num[5]','$den[0]','$den[1]','$den[2]','$den[3]','$den[4]','$den[5]',$applyToYear,$fileType,$divisor)";
                    }
                }

                if (count($num) == 7) {
                    if (count($den) == 0) {
                        //
                        $sp = "call sp_calculate_iv_from_7_indicators_sum('$no','$num[0]','$num[1]','$num[2]','$num[3]','$num[4]','$num[5]','$num[6]',$applyToYear,$fileType,$divisor)";
                    }
                }
            } // END ELSE branch (process regular formulas with ratios of sums)
        }

        // Finally, trigger the calculation/insertion stored procedure
        echo $sp . ";\n";
        if ($showPlanOnly) {
        } else {
            $spResult = mysqli_query($connect, $sp);
        }

        // If need be, remove the duplicates smartly
        if ($keepRaw) {
            $sp = "call sp_smart_remove_duplicate_ivs('$no', true)";
            echo $sp . ";\n";
            if ($showPlanOnly) {
            } else {
                $spResult = mysqli_query($connect, $sp);
            }
        } else {
        }

        // Addition due to not using joins properly but sum() - s in sp-s so nulls stick and form resulting
        // rows
        $sp = "call sp_set_nulls_to_not_computable('$no')";
        echo $sp . ";\n";
        if ($showPlanOnly) {
        } else {
            $spResult = mysqli_query($connect, $sp);
        }
    }
}
