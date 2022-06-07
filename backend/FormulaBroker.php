<?php

require_once "ApiHelper.php";
require_once "Constants.php";
require_once "config.php";

class FormulaBroker
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

    // The constructor is private
    // to prevent initiation with outer code.
    public function __construct()
    {
        // The expensive process (e.g.,db connection) goes here.
    }

    function setConnection($c)
    {
        $this->connection = $c;
    }

    public function structureIngredientsLists($convertNosToUpper = true)
    {
        error_reporting(E_ALL);
        // Prevent this function to run the whole course very often
        if (!is_null($this->ingredientsList)) {
            //error_log("not null, so take it.");
            return;
        }

        //error_log("null, so create it.");

        $q = "select icf.no_of_destination_indicator as no_of_destination_indicator,
            icf.nos_of_indicators_in_numerator_sum as nos_of_indicators_in_numerator_sum,
            icf.nos_of_indicators_in_denominator_sum as nos_of_indicators_in_denominator_sum,
            icf.nos_of_indicators_for_equivalence_formula as nos_of_indicators_for_equivalence_formula,
            icfe.nos_of_indicators_in_numerator_sum as nos_of_indicators_in_numerator_sum_in_exception,
            icfe.nos_of_indicators_in_denominator_sum as nos_of_indicators_in_denominator_sum_in_exception,
            icfe.nos_of_indicators_for_equivalence_formula as nos_of_indicators_for_equivalence_formula_in_exception
            from indicators_computations_formulas icf 
            left join indicators_computations_formulas_exceptions icfe on (icf.no_of_destination_indicator = icfe.no_of_destination_indicator)";

        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);

        // Full list of all ingredients from regular and exceptions formulas
        $ingredients = array();

        // Partial list of ingredients, from numerator from regular formula
        $numeratorIngredients = array();

        // Partial list of ingredients, from denominator from regular formula
        $denominatorIngredients = array();

        // Partial list of ingredients, from equivalence from regular formula
        $equivalenceIngredients = array();

        // Go through each destination indicator
        while ($r = $result->fetch_assoc()) {
            $destinationNo = $r["no_of_destination_indicator"];

            $numerator = $r["nos_of_indicators_in_numerator_sum"];
            $denominator = $r["nos_of_indicators_in_denominator_sum"];
            $equivalence = $r["nos_of_indicators_for_equivalence_formula"];

            $numeratorInException = $r["nos_of_indicators_in_numerator_sum_in_exception"];
            $denominatorInException = $r["nos_of_indicators_in_denominator_sum_in_exception"];
            $equivalenceInException = $r["nos_of_indicators_for_equivalence_formula_in_exception"];

            $nums = explode(",", $numerator);
            $dens = explode(",", $denominator);
            $equs = explode(",", $equivalence);

            $numsInException = explode(",", $numeratorInException);
            $densInException = explode(",", $denominatorInException);
            $equsInException = explode(",", $equivalenceInException);

            // Full list of ingredients for an indicator, from numerator, denominator and equivalence 
            // parts from regular and exception formula
            $ingredients = array();

            // Ingredients from numerator from regular formula
            $numeratorIngredients = array();

            // Ingredients from denominator from regular formula
            $denominatorIngredients = array();

            // Ingredients from equivalence definition from regular formula
            $equivalenceIngredients = array();

            // INGREDIENTS FROM THE REGULAR FORMULA:

            // Add ingredients from the numerator
            if (!empty($numerator)) {
                foreach ($nums as $nu) {
                    if ($convertNosToUpper) {
                        $nu =  strtoupper($nu);
                    }

                    // Append it to the list of ingredients
                    if (in_array($nu, $ingredients)) {
                    } else {
                        array_push($ingredients, $nu);
                    }

                    // Append it also to the numerator list of ingredients
                    if (in_array($nu, $numeratorIngredients)) {
                    } else {
                        array_push($numeratorIngredients, $nu);
                    }
                }
            }

            // Add ingredients from the denominator
            if (!empty($denominator)) {
                foreach ($dens as $de) {
                    if ($convertNosToUpper) {
                        $de =  strtoupper($de);
                    }

                    // Append it to the list of ingredients
                    if (in_array($de, $ingredients)) {
                    } else {
                        array_push($ingredients, $de);
                    }

                    // Append it also to the denominator list of ingredients
                    if (in_array($de, $denominatorIngredients)) {
                    } else {
                        array_push($denominatorIngredients, $de);
                    }
                }
            }

            // Add ingredients from the equivalence 
            if (!empty($equivalence)) {
                foreach ($equs as $eq) {
                    if ($convertNosToUpper) {
                        $eq =  strtoupper($eq);
                    }

                    // Append it to the list of ingredients
                    if (in_array($eq, $ingredients)) {
                    } else {
                        array_push($ingredients, $eq);
                    }

                    // Append it also to the equivalence list of ingredients
                    if (in_array($eq, $equivalenceIngredients)) {
                    } else {
                        array_push($equivalenceIngredients, $eq);
                    }
                }
            }

            // INGREDIENTS FROM THE EXCEPTION FORMULA:

            // Add ingredients from the numerator
            if (!empty($numeratorInException)) {
                foreach ($numsInException as $nie) {
                    if ($convertNosToUpper) {
                        $nie =  strtoupper($nie);
                    }

                    if (in_array($nie, $ingredients)) {
                    } else {
                        array_push($ingredients, $nie);
                    }
                }
            }

            // Add ingredients from the denominator
            if (!empty($denominatorInException)) {
                foreach ($densInException as $die) {
                    if ($convertNosToUpper) {
                        $die =  strtoupper($die);
                    }

                    if (in_array($die, $ingredients)) {
                    } else {
                        array_push($ingredients, $die);
                    }
                }
            }

            // Add ingredients from the equivalence
            if (!empty($equivalenceInException)) {
                foreach ($equsInException as $eie) {
                    if ($convertNosToUpper) {
                        $eie =  strtoupper($eie);
                    }

                    if (in_array($eie, $ingredients)) {
                    } else {
                        array_push($ingredients, $eie);
                    }
                }
            }

            // Finish the business for this indicator, write down the processed data

            // Regular formulas
            $this->ingredientsList[$destinationNo] = $ingredients;

            $this->numeratorIngredientsList[$destinationNo] = $numeratorIngredients;
            $this->denominatorIngredientsList[$destinationNo] = $denominatorIngredients;
            $this->equivalenceIngredientsList[$destinationNo] = $equivalenceIngredients;
        }
    }

    /* 
    The exception structure will be an associative array like so:
    [
        KPI.K.13=>[
            2014=>[
                numerator=>[
                    B3.1,
                    ...-II-
                ],
                denominator=>[
                    F1.1,
                    ...-II-
                ]
            ],
            2015=>[
                ... -II-
            ]
            ... -II-
        ],
        RB3=> [
            ... -II-
        ]
        ... -II-
    ]
    */
    public function getExceptionStructureForIngredient($no, $convertNosToUpper = true)
    {
        $structure = array();

        $q = "select * from indicators_computations_formulas_exceptions icfe 
        where no_of_destination_indicator='$no'";

        $result = mysqli_query($this->connection, $q);

        // Go through each exception (typically each of these is a year)
        while ($r = $result->fetch_assoc()) {

            $year = $r["apply_to_year"];

            $structure[$year] = array();

            $nums = array_filter(explode(",", $r["nos_of_indicators_in_numerator_sum"]));
            $dens = array_filter(explode(",", $r["nos_of_indicators_in_denominator_sum"]));

            $numeratorIngredients = array();
            $denominatorIngredients = array();

            // Add ingredients from the numerator
            foreach ($nums as $nie) {
                if ($convertNosToUpper) {
                    $nie =  strtoupper($nie);
                }

                if (in_array($nie, $numeratorIngredients)) {
                } else {
                    array_push($numeratorIngredients, $nie);
                }
            }

            // Add ingredients from the denominator
            foreach ($dens as $die) {
                if ($convertNosToUpper) {
                    $die =  strtoupper($die);
                }

                if (in_array($die, $denominatorIngredients)) {
                } else {
                    array_push($denominatorIngredients, $die);
                }
            }

            $structure[$year]["numeratorIngredients"] = $numeratorIngredients;
            $structure[$year]["denominatorIngredients"] = $denominatorIngredients;
            $structure[$year]["useIngredientLogic"] = $r["use_ingredient_logic_for_eu_aggregation"];
        }

        return $structure;
    }



    // Get ingredients list for all indicators
    public function getIngredientsList()
    {
        $this->structureIngredientsLists();

        return $this->ingredientsList;
    }

    public function doesIndicatorHaveExceptions($no)
    {
        $q = "select count(*) as count from indicators_computations_formulas_exceptions icfe 
        where no_of_destination_indicator='$no'";

        $result = mysqli_query($this->connection, $q);
        $res = $result->fetch_assoc();
        $does = $res["count"] > 0 ? true : false;

        return $does;
    }

    public function doesIndicatorHaveExceptionForYear($no, $year)
    {
        $q = "select count(*) as count from indicators_computations_formulas_exceptions icfe 
        where no_of_destination_indicator='$no' and apply_to_year = $year";

        $result = mysqli_query($this->connection, $q);
        $res = $result->fetch_assoc();
        $does = $res["count"] > 0 ? true : false;

        //error_log("doesIndicator $no HaveExceptionForYear $year: " . $does);

        return $does;
    }

    // Get dependants based on the ingredientsList
    function getDependantsOfIndicator($no)
    {
        $ingredientsList = $this->getIngredientsList();

        $dependants = array();
        foreach ($ingredientsList as $destinationIndicator => $ingredients) {
            if (in_array($no, $ingredients)) {
                if (!in_array($destinationIndicator, $dependants)) { // in order to avoid duplicates in the list
                    array_push($dependants, $destinationIndicator);
                }
            }
        }

        return $dependants;
    }

    // Get ingredients of an indicator
    function getIngredientsOfIndicator($no)
    {
        $ingredientsList = $this->getIngredientsList();
        return $ingredientsList[$no];
    }

    // Get numerator ingredients of an indicator
    function getNumeratorIngredientsOfIndicator($no)
    {
        $ni = $this->numeratorIngredientsList;
        return $ni[$no];
    }

    // Get denominator ingredients of an indicator
    function getDenominatorIngredientsOfIndicator($no)
    {
        $di = $this->denominatorIngredientsList;
        return $di[$no];
    }

    // Get the divisor in regular formula for the indicator
    function getDivisorInRegularFormula($no)
    {
        $q = "select divide_result_by as divisor from indicators_computations_formulas where no_of_destination_indicator='" . $no . "'";
        $result = mysqli_query($this->connection, $q);

        $r = $result->fetch_assoc();
        $divisor = $r["divisor"];
        //echo "divisor is: " . $divisor . "\n\n";
        return $divisor;
    }

    // EXCEPTIONS:

    function getIngredientsForExceptionYear($no, $year)
    {
        $s = $this->getExceptionStructureForIngredient($no);
        return array_merge($s[$year]["numeratorIngredients"], $s[$year]["denominatorIngredients"]);
    }

    public function getNumeratorIngredientsForExceptionYear($no, $year)
    {
        $s = $this->getExceptionStructureForIngredient($no);
        if ($no == 'RK3.1' && $year == 2014) {
            //printr($s[$year]["numeratorIngredients"], "ingredients of $no in $year are:");
        }
        return $s[$year]["numeratorIngredients"];
    }

    public function getDenominatorIngredientsForExceptionYear($no, $year)
    {
        $s = $this->getExceptionStructureForIngredient($no);
        return $s[$year]["denominatorIngredients"];
    }

    // Get the divisor in regular formula for the indicator
    function getDivisorInExceptionYear($no, $year)
    {
        return 1;
    }
}
