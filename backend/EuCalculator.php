<?php

require_once "Constants.php";
require_once "Util.php";
require_once "config.php";

class EuCalculator
{
    var $connection;

    function setConnection($c)
    {
        $this->connection = $c;
    }

    // The outcome of this method is the following associative array: 
    // [no_of_indicator, computed_value, year]
    function getCountryFichesValuesForStrictEuAggregation()
    {
        include "Constants.php";
        /*

        (ANALOGY WITH FOOD MAKING)

        1. (Buy groceries and seasoning) Take values for all EU (MS and CC) countries of all ingredients for all years, thus having the resulting array (ivs) as such: 
        [
            RB1=>[
                2014=>[
                    AT=>0.1,
                    BE=>... -II-,
                    ... -II-
                ],
                2015=>[
                    ... -II-
                ]
                ... -II-
            ],
            RB2=> [
                ... -II-
            ]
            ... -II-

        ]
        2. Go through the formulas of C.F. indicators (cfi) (more or less 300 of them), and for each cfi do:
            2.1. (Get recipe) Get lists of all ingredients (ai), numerator ingredients (ni) and denominator ingredients (di) for that cfi. Get the divisor for that cfi. For the reference, ai = ni + di only, ai does not take equivalence nor exception ingredients into consideration nor calculation
            2.2. For each indicator, go through each of the 6 years (y) and for y, do:
                2.2.1 (Assemble the pot) For each member state (ms) (there are 28) do:
                    2.2.1.1 Take the original iv for each indicator from the ai list, for year y and country ms, copy it to the pot (which is an associative array) for the cooking process (set pot[cfi][ai][y][ms]). 
                2.2.3 (Scour the pot) Go through each ms and in the pot do:
                    2.2.3.1 Take the potted iv for each indicator from the ai list, for year y for that ms(pot[cfi][ai][y][ms]). If it is missing (or NA or not computable or not calculated), set all pot values of that ms to zero (pot[cfi][foreach ai][y][ms]).
                2.2.4. (Cook) Run the formula according to the ai, ni and di, and their values in the pot, and write down that computed value into the dish space (dish[cfi][y] is now calculated).
            
        4. Present all the dishes :) (result is in the format [no, value, year, name])

        */

        error_reporting(E_ALL);

        // 1.

        $fb = new FormulaBroker();
        $fb->setConnection($this->connection);
        $fb->structureIngredientsLists();

        $wvb = new WeightValueBroker();
        $wvb->setConnection($this->connection);
        $weightsMatrix = $wvb->getAllWeightsValuesTree();

        //$ingSql = Util::returnArrayAsSqlList($fb->getIngredientsList());

        $q = "select i.no_of_indicator as no, iv.year as year, 
            iv.country_code as country, iv.value as value 
            from indicators i 
            join indicators_values iv on (iv.indicator_id = i.indicator_id)";

        // where i.no_of_indicator in($ingSql)";

        $res = mysqli_query($this->connection, $q);

        $ivs = array();

        while ($r = $res->fetch_assoc()) {
            //
            $no = $r["no"];
            $year = $r["year"];
            $country = $r["country"];
            $value = $r["value"];

            $ivs[$no][$year][$country] = $value;
        }

        //print "ivs is:<pre>";
        //print_r($ivs);
        //print "<pre>";
        //return;

        // 2.
        $q = "select i.no_of_indicator as no, 
        i.name_of_indicator as name, 
        icf.divide_by_eu_total as divide_by_eu_total,
        icf.use_ingredient_logic_for_eu_aggregation as use_ingredient_logic ,
        if(icf.use_ingredient_logic_for_eu_aggregation, icf.nos_of_indicators_in_numerator_sum, 'NOT RELEVANT') as main_ingredient,
        if(icfe.use_ingredient_logic_for_eu_aggregation, icfe.nos_of_indicators_in_numerator_sum, 'NOT RELEVANT') as main_ingredient_in_exception,
        remove_ratios_bigger_than_1_for_eu_aggregation
        from indicators i 
        join indicators_computations_formulas icf on (icf.no_of_destination_indicator = i.no_of_indicator) 
        left join indicators_computations_formulas_exceptions icfe on (icfe.no_of_destination_indicator = i.no_of_indicator) 
        where i.is_country_fiches_indicator order by no asc, icfe.apply_to_year asc;";

        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);

        // 2.1. (Get recipe)
        $cfIndicators = array();
        while ($r = $result->fetch_assoc()) {
            // Some KPI-s need to use ingredient's logic to do the EU aggregation, and not just copy of a ratio
            if (1 == $r["use_ingredient_logic"]) {
                $logicOf = $r["main_ingredient"];
                $eLogicOf = $r["main_ingredient_in_exception"];
            } else {
                $logicOf = $r["no"];
                $eLogicOf = $r["main_ingredient_in_exception"];
            }

            //$y = $r["exception_year"];

            foreach ($allRelevantYears as $y) {

                if ($fb->doesIndicatorHaveExceptionForYear($r["no"], $y)) {
                    $r["ingredients_in_numerator"][$y] = $fb->getNumeratorIngredientsForExceptionYear($eLogicOf, $y);
                    $r["ingredients_in_denominator"][$y] = $fb->getDenominatorIngredientsForExceptionYear($eLogicOf, $y);
                    $r["ingredients"][$y] = $fb->getIngredientsForExceptionYear($eLogicOf, $y);
                    $r["divisor"][$y] = $fb->getDivisorInExceptionYear($eLogicOf, $y);
                } else {

                    $r["ingredients_in_numerator"][$y] = $fb->getNumeratorIngredientsOfIndicator($logicOf);
                    $r["ingredients_in_denominator"][$y] = $fb->getDenominatorIngredientsOfIndicator($logicOf);
                    $r["ingredients"][$y] = $fb->getIngredientsOfIndicator($logicOf);
                    $r["divisor"][$y] = $fb->getDivisorInRegularFormula($logicOf);
                }
            }

            array_push($cfIndicators, $r);
        }

        //printr($cfIndicators, "cfis are:");
        //return;

        // 2.2.

        // Ingredients
        $pot = array();

        // Final output, around 28 X 6 results (number of C.F. indicators times number of years)
        $dishes = array();

        // Counter of valid numbers, i.e. participation matrix of countries
        $participation = array();

        // Logger parameters
        $logNo = 'KPI.F.7x';
        $logYear = 2014;

        foreach ($cfIndicators as $cfi) {
            $no = $cfi["no"];

            $participation[$no] = [];

            // Some KPI-s have an additional restriction to cut their ingredients out if they are over 100 percent
            if ("1" == $cfi["remove_ratios_bigger_than_1_for_eu_aggregation"]) {
                $removeBigRatios = true;
                //echo "removeBigRatios is true for $no";
            } else {
                $removeBigRatios = false;
            }

            foreach ($allRelevantYears as $y) {

                // Particular pieces of info for calculation of the indicator
                $allIndicatorIngredients = $cfi["ingredients"][$y];
                $divisor = $cfi["divisor"][$y];

                // 2.2.1 (Assemble the pot)
                foreach ($allEuMemberStatesIso2s as $ms) {

                    // Initially set the participation matrix of all to 1
                    $participation[$no][$y][$ms] = 1;

                    // 2.2.1.1 (Clone ingredient, do minor processing, and put to pot)
                    foreach ($allIndicatorIngredients as $ai) {

                        $pot[$no][$ai][$y][$ms] = is_valid_number($ivs[$ai][$y][$ms]) ? $ivs[$ai][$y][$ms] : "missing";
                    }
                }


                // 2.2.3 (Scour the pot(s))
                $isRatioFormula = count($cfi["ingredients_in_denominator"][$y]) > 0;
                $scourSumFormulas = true;
                $scourValuesInSumFormulas = false;
                $scourParticipationsInSumFormulas = true;

                if ($isRatioFormula || $scourSumFormulas) {

                    foreach ($allEuMemberStatesIso2s as $ms) {
                        // 2.2.3.1
                        foreach ($allIndicatorIngredients as $ai2) {
                            if (!is_valid_number($pot[$no][$ai2][$y][$ms]) || ($removeBigRatios && $ivs[$no][$y][$ms] > 1)) {

                                // If country's value is not available, count it out of the participation
                                if ($isRatioFormula || $scourParticipationsInSumFormulas) {
                                    if (!is_valid_number($pot[$no][$ai2][$y][$ms])) {
                                        $participation[$no][$y][$ms] = 0;
                                    }
                                }

                                if ($no == $logNo && $y == $logYear) {
                                    //printr($pot[$no][$ai][$y][$ms], "not is valid number for pot[$no][$ai][$y][$ms]:");
                                }

                                // Set all values for this year for this country to zero
                                if ($isRatioFormula || $scourValuesInSumFormulas) {
                                    foreach ($allIndicatorIngredients as $ai3) {
                                        $pot[$no][$ai3][$y][$ms] = 0;
                                    }
                                }
                            } else {


                                if ($no == $logNo && $y == $logYear) {

                                    //printr($pot[$no][$ai][$y][$ms], "is valid number for pot[$no][$ai][$y][$ms]:");
                                }
                            }
                        }
                    }
                }

                // 2.2.4. (Cook) Run the formula according to the ni and di values in the pot, and the divisor, and write down that computed value into the dish space (so the dish[cfi][y] is now calculated).
                $dish = array(); // one particular dish is one c.f. indicator for one year
                $dish["no_of_indicator"] = $no;
                $dish["year"] = $y;

                if (0 == count($cfi["ingredients_in_denominator"][$y])) {
                    // Simple sum recipe
                    $numeratorSum = 0;
                    foreach ($allEuMemberStatesIso2s as $ms) {
                        foreach ($cfi["ingredients_in_numerator"][$y] as $ni) {

                            $numeratorSum += is_valid_number($pot[$no][$ni][$y][$ms]) ? $pot[$no][$ni][$y][$ms] : 0;
                        }
                    }

                    if ($logNo == $no && $y == $logYear) {
                        //printr($numeratorSum, "numeratorSum is:");
                        //printr($divisor, "divisor is:");
                    }

                    $dish["computed_value"] = $numeratorSum / $divisor;
                } else {
                    // Ratio recipe
                    $numeratorSum = 0;
                    foreach ($allEuMemberStatesIso2s as $ms) {
                        foreach ($cfi["ingredients_in_numerator"][$y] as $ni) {

                            $numeratorSum += $pot[$no][$ni][$y][$ms];
                        }
                    }

                    $denominatorSum = 0;
                    foreach ($allEuMemberStatesIso2s as $ms) {

                        foreach ($cfi["ingredients_in_denominator"][$y] as $di) {

                            $denominatorSum += $pot[$no][$di][$y][$ms];
                        }

                        if ($logNo == $no && $logYear == $y) {

                            printr("for $ms, denominator is: $denominatorSum");
                        }

                        // Edge case for MT, KPI.K.10, 2014 that causes discrepance between
                        // Country Fiches page EU value, and query page EU value
                        //if (0 == $pot[$no][$di][$y][$ms]) {
                        if (0 == $ivs[$no][$y][$ms]) {
                            //$participation[$no][$y][$ms] = 0;
                        }
                    }

                    if ($denominatorSum == 0) {
                        $dish["computed_value"] = "division by zero";
                    } else {
                        $dish["computed_value"] = ($numeratorSum / $denominatorSum) / $divisor;
                    }

                    //$dish["computed_value"] = $denominatorSum == 0 ? "division by zero" : ($numeratorSum / $denominatorSum) / $divisor;
                }

                // Set the result to 1, since EU / EU is 1
                if ($cfi["divide_by_eu_total"]) {
                    $dish["computed_value"] = 1;
                }

                $totalParticipationPerWeight1 = 0;
                $totalParticipationPerWeight2 = 0;
                $totalParticipationPerWeight3 = 0;
                $totalParticipationPerWeight4 = 0;
                $totalParticipationPerWeight5 = 0;

                // Calculate the participation levels according to each ratio
                foreach ($allEuMemberStatesIso2s as $c) {

                    $participates = $participation[$no][$y][$c];

                    if ($logYear == $y && $logNo == $no && !$participates) {
                        printr("not summing that of $c");
                    }

                    $totalParticipationPerWeight1 += $participates * $weightsMatrix[1][$c][$y];
                    $totalParticipationPerWeight2 += $participates * $weightsMatrix[2][$c][$y];
                    $totalParticipationPerWeight3 += $participates * $weightsMatrix[3][$c][$y];
                    $totalParticipationPerWeight4 += $participates * $weightsMatrix[4][$c][$y];
                    $totalParticipationPerWeight5 += $participates * $weightsMatrix[5][$c][$y];
                }

                $dish["participation-weights-ti"] = $totalParticipationPerWeight1;
                $dish["participation-weights-imports-only"] = $totalParticipationPerWeight2;
                $dish["participation-weights-gdp"] = $totalParticipationPerWeight3;
                $dish["participation-weights-kpi-bp-6"] = $totalParticipationPerWeight4;
                $dish["participation-weights-arithmetic"] = $totalParticipationPerWeight5;

                array_push($dishes, $dish);
            } // END foreach $allRelevantYears

        } // END foreach cfIndicators

        // Log
        $potForNo = $pot[$logNo];
        //printr($potForNo, "pot is:");
        foreach ($potForNo as $ing => $ingVal) {
            //printr($ingVal[$logYear], "val for $ing for $logYear is:");
        }

        //print "<pre>";
        //print_r($dishes);
        //print "</pre>";

        //return;


        return $dishes;
    }

    // The goal of next method is to produce associative array: 
    // no_of_indicator, computed_value, year
    function getCountryFichesValuesForEuAggregation()
    {

        /*

        1. Take all CF indicators, and for each
        2. Take his no_of_indicator, formula, and name_of_indicator
        3. Go through formula and separate the numerator ingredients and the denominator ingredients
        4. Then, make the result according to these ingredients :) like so:
        5. If it is a simple sum (no denominator ingredients), just sum up all
        6. If it is a ratio, make the sql, group by year (or just put where year = that one)
        
        */

        $fb = new FormulaBroker();
        $fb->setConnection($this->connection);
        $fb->structureIngredientsLists();

        $q = "select no_of_indicator as no, name_of_indicator as name from indicators where is_country_fiches_indicator";

        $result = mysqli_query($this->connection, $q);

        $cfIndicators = array();

        while ($r = $result->fetch_assoc()) {
            $r["ingredients_in_numerator"] = $fb->getNumeratorIngredientsOfIndicator($r["no"]);
            $r["ingredients_in_denominator"] = $fb->getDenominatorIngredientsOfIndicator($r["no"]);
            $r["divisor"] = $fb->getDivisorInRegularFormula($r["no"]);
            array_push($cfIndicators, $r);
        }

        // Final result to be returned back
        $ret = array();

        foreach ($cfIndicators as $cfi) {

            $q = "";

            $nSql = Util::returnArrayAsSqlList($cfi["ingredients_in_numerator"]);
            $dSql = Util::returnArrayAsSqlList($cfi["ingredients_in_denominator"]);

            $divisor = $cfi["divisor"];

            if (count($cfi["ingredients_in_denominator"]) > 0) {

                $q = "select '" . $cfi["no"] . "' as no, (sum1.v1/"  . $divisor . ")/sum2.v2 as value, sum1.y1 as year
                from
                (select sum(iv1.value) as v1, iv1.year as y1
                from indicators_values iv1 
                join indicators i1 on (i1.indicator_id = iv1.indicator_id)
                join countries c1 on iv1.country_code = c1.country_code
                where c1.is_eu_member and i1.no_of_indicator in (" . $nSql . ")
                group by y1) as sum1
                join
                (select sum(iv2.value) as v2, iv2.year as y2
                from indicators_values iv2 
                join indicators i2 on (i2.indicator_id = iv2.indicator_id)
                join countries c2 on iv2.country_code = c2.country_code
                where c2.is_eu_member and i2.no_of_indicator in (" . $dSql . ")
                group by y2) as sum2
                on (sum1.y1 = sum2.y2)
                group by sum1.y1;";
            } else {

                // simple sum

                $q = "select '" . $cfi["no"] . "' as no, sum(iv.value)/" . $divisor . " as value, iv.year as year
                from indicators_values iv
                join indicators i on (i.indicator_id = iv.indicator_id)
                join countries c on iv.country_code = c.country_code
                where c.is_eu_member and i.no_of_indicator in (" . $nSql . ")
                group by year;";
            }

            //echo "\n no is:" . $cfi["no"] . " and q is: " .  $q;

            $result = mysqli_query($this->connection, $q);


            while ($r = $result->fetch_assoc()) {
                array_push($ret, array(
                    "no_of_indicator" => $cfi["no"],
                    "computed_value" => $r["value"],
                    "year" => $r["year"]
                ));
            }

            //print "ret is:<pre>";
            //print_r($ret);
            //print "<pre>";

        } // END the pass through a single KPI C.F. indicator

        return $ret;
    }
}
