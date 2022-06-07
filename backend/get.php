<?php

require_once "ApiHelper.php";
require_once "Constants.php";
require_once "DB.php";
require_once "config.php";
require_once "Prioritizer.php";

//error_reporting(0);

if (!$cv->verifyJwt()) { // Precautionary call to check if someone tries to use the api without being authorized
    return false;
}

$entity = $_GET["entity"];

// Serves for Country Fiches and summary pages data
if ("summary-extended" == $entity) {
    $countryCode = $_GET["country_code"];

    // Special EU aggregation value
    if ("EU-aggregated" == $countryCode) {
        $euc = $db->euCalculator;
        $res = $euc->getCountryFichesValuesForEuAggregation();
    }

    // Special EU aggregation value - strict version
    if ("EU-aggregated-strict" == $countryCode) {
        $euc = $db->euCalculator;
        $res = $euc->getCountryFichesValuesForStrictEuAggregation();
    }

    // A country
    if (in_array($countryCode, $euMembersAndCandidatesIso2s)) {

        $query = "select 
        i.no_of_indicator as no_of_indicator,
        iv.value as computed_value,
        iv.year,
        i.name_of_indicator
        from kpi_indicators_mapping kim
        join indicators i on (i.indicator_id = kim.computed_indicator_id)
        join indicators_values iv on (iv.indicator_id = i.indicator_id)
        where 1=1
        and iv.country_code = '" . $countryCode . "'
        order by i.indicator_id asc, iv.year asc limit 100000;";

        /* query result is in the format:
        
        no_of_indicator, computed_value, year, name_of_indicator
        
        echo $query;
        return;

        */

        $result = mysqli_query($connect, $query);

        $res = array();
        while ($r = $result->fetch_assoc()) {
            array_push($res, $r);
        }

        // $res is an array of associative arrays (no_of_indicator, computed_value, year, name_of_indicator)

    }

    echo json_encode($res);
}

// summary indicators list
if ("summary-original-indicators-list" == $entity) {
    $q = "select i2.no_of_indicator as no_of_indicator, 
        i2.old_name_of_indicator as name_of_indicator, 
        i2.name_of_indicator as new_name_of_indicator, 
        i2.strategic_objective as strategic_objective,
        i2.unit, 
        i2.extra_key_1,
        i2.is_percentage as is_percentage
        from kpi_indicators_mapping kim
        join indicators i2 on (i2.indicator_id = kim.computed_indicator_id);";

    //echo $q;
    //return;

    $result = mysqli_query($connect, $q);

    //print "<pre>";
    //print_r($result);
    //print "</pre>";

    $res = array();

    while ($r = $result->fetch_assoc()) {

        //print "r is: <pre>";
        //print_r($r);
        //print "</pre>";

        array_push($res, $r);
    }

    echo json_encode($res);
}

// GET - Country Fiches indicators - used for the list of C.F. on query page
if ("country-fiches-indicators-list" == $entity) {
    $q = "select no_of_indicator from indicators where is_country_fiches_indicator;";

    //echo $q;
    //return;

    $result = mysqli_query($connect, $q);

    //print "<pre>";
    //print_r($result);
    //print "</pre>";

    $res = array();

    while ($r = $result->fetch_assoc()) {

        //print "r is: <pre>";
        //print_r($r);
        //print "</pre>";

        array_push($res, $r);
    }

    echo json_encode($res);
}

// GET - Country list
if ("eu-members-list" == $entity) {

    $res = array();

    foreach ($allEuMemberStatesIso2s as $c) {
        $o = new stdClass();
        $o->country = $c;
        array_push(
            $res,
            $o
        );
    }

    echo json_encode($res);
}

// GET - EU member states list
if ("eu-members-and-candidates-list" == $entity) {

    $q = "select * from countries
    where is_eu_member or is_eu_candidate";

    //echo $q;
    //return;

    $result = mysqli_query($connect, $q);

    $res = array();
    while ($r = $result->fetch_assoc()) {
        //
        $o = new stdClass();

        $o->country_code = $r["country_code"];
        $o->country = $r["country_code"];
        $o->country_name = $r["country_name"];
        $o->is_eu_member = $r["is_eu_member"];
        $o->is_eu_candidate = $r["is_eu_candidate"];

        array_push(
            $res,
            $o
        );
    }


    echo json_encode($res);
}


if ("indicators-list" == $entity) {

    $year = $_GET["year"] ? $_GET["year"] : "0000";


    if (in_array($year, $allRelevantYears)) { // GET - Indicators (names) list for a certain year

    }


    if ("0000" == $year || "all" == $year || "" == $year) { // GET - Indicators (names) list for all years

        $fileType = $_GET["fileType"] ? $_GET["fileType"] : "QA";

        $fieldsToFetch = $indicatorBasicFields;

        $ib = $db->indicatorBroker;
        $res = $ib->getAllIndicatorsBasicInfos($fileType, $fieldsToFetch);
        echo json_encode($res);
    }
}

// Get indicator value(s) (used in trends page)
if ("indicator" == $entity) {
    $indicator = $_GET["indicator"] ? $_GET["indicator"] : "no indicator name given";
    $country = $_GET["country"] ? $_GET["country"] : "no country code given";
    $fileType = $_GET["fileType"] ? $_GET["fileType"] : "QA"; // A or Q or QA

    $fileTypeSqlCondition = $apiHelper->getIndicatorFileTypeSqlCondition($fileType);

    $q = "select year, value, is_percentage
            from indicators_values as iv 
            join indicators i on (iv.indicator_id = i.indicator_id)
            where country_code = '$country' 
            and $fileTypeSqlCondition
            and no_of_indicator = '$indicator'";

    //echo $q;
    //return;

    $result = mysqli_query($connect, $q);

    $ret = array();

    if ("2015-2019" == $tablesReady[$fileType]) {
        $ret[2015] = "null";
        $ret[2016] = "null";
        $ret[2017] = "null";
        $ret[2018] = "null";
        $ret[2019] = "null";
    }

    if ("2014-2019" == $tablesReady[$fileType]) {
        $ret[2014] = "null";
        $ret[2015] = "null";
        $ret[2016] = "null";
        $ret[2017] = "null";
        $ret[2018] = "null";
        $ret[2019] = "null";
    }

    //print "<pre>result is:";
    //print_r($result);
    //print "</pre>";

    while ($r = $result->fetch_assoc()) {

        $units = $apiHelper->determineValueTypeForIndicatorSqlRow($r);
        $ret[$r["year"]] = array("value" => $r["value"], "units" => $units);
        //print "<pre>";
        //print_r($r);
        //print "</pre>";
    }

    echo json_encode($ret);

    //$r = $result->fetch_assoc();
    //echo json_encode($r);

}

if ("indicator-value" == $entity) {
    //
}

if ("eu-total" == $entity) {
    $no = !empty($_GET["no"]) ? $_GET["no"] : false;
    $year = !empty($_GET["year"]) ? $_GET["year"] : false;

    //return $no;

    $q = "select sum(value) as total from indicators_values iv
    join indicators i on (i.indicator_id = iv.indicator_id)
    join countries c on (c.country_code = iv.country_code)
    where c.is_eu_member
    and year = $year 
    and no_of_indicator = '$no';";

    //echo $q;
    //return;

    $result = mysqli_query($connect, $q);

    $r = $result->fetch_assoc();


    echo json_encode($r);
}

// Data to return to query page
if ("advanced" == $entity) {

    $aggregation = !empty($_GET["aggregation"]) ? $_GET["aggregation"] : false;
    $isEuSelected = !empty($_GET["isEuSelected"]) && $_GET["isEuSelected"] == "true" ? true : false;
    $indicators = !empty($_GET["indicators"]) ? $_GET["indicators"] : "no indicator names given";
    $countries = (!empty($_GET["countries"]) && ($_GET["countries"]) != "all") ? $_GET["countries"] : $allEuCountriesForSqlQuery;
    $weights = !empty($_GET["weights"]) ? $_GET["weights"] : "";
    $fileType = !empty($_GET["fileType"]) ? $_GET["fileType"] : "AQ"; // A or Q or AQ

    $requestedCountries = (array) explode(",", $countries);

    if ($isEuSelected) {
        array_push($requestedCountries, "EU");
    }

    $countries = "EU," . $euMembersAndCandidatesIso2sForSqlQuery;

    $indicatorsArray = (array) explode(",", $indicators);
    $countriesArray = (array) explode(",", $countries);
    $weightsArray = (array) explode(",", $weights);


    if ($isEuSelected) {
        // Init the result set for EU
        foreach ($allRelevantYears as $ye) {
            foreach ($indicatorsArray as $no) {
                // Init the sum to zero
                if (!isset($ret["EU"][$ye][$no][0])) {

                    $ret["EU"][$ye][$no][0] = 0;
                }

                if (!isset($ret["EU"][$ye][$no][2])) {

                    $ret["EU"][$ye][$no][2] = 0;
                }

                if (!isset($ret["EU"][$ye][$no][3])) {

                    $ret["EU"][$ye][$no][3] = 0;
                }
            }
        }
    }

    //print "<pre>weightsArray is: ";
    //print_r($weightsArray);
    //print "</pre>";

    $ret = array();

    // Init aggregation variables: Add aggregated countries as well to the list of countries for sql, and set sums to zero
    if ($aggregation) {
        array_push($countriesArray, "aggregation");
        $aggregationArray = (array) explode(",", $aggregation);

        foreach ($aggregationArray as $a) {
            if (in_array($a, (array) $countriesArray)) {
                // that country (which will be part of the aggregation) has already been added to the field list of the query, don't add it again
            } else {
                array_push($countriesArray, $a);
            }
        }

        foreach ($allRelevantYears as $ye) {
            foreach ($indicatorsArray as $no) {
                // Init the aggregation sum to zero
                if (!isset($ret["aggregation"][$ye][$no][0])) {
                    //echo "in init of aggregation values, ye and no are: " . $ye . " and " . $no;
                    $ret["aggregation"][$ye][$no][0] = 0;
                }
            }
        }
    }

    $is = "'" . $indicatorsArray[0] . "'";

    // Form the indicators list for the SQL query
    foreach ($indicatorsArray as $key => $i) {
        if ($key != 0) {
            $is .= ",'" . trim($i) . "'";
        }
    }

    $fileTypeSqlCondition = $apiHelper->getIndicatorFileTypeSqlCondition($fileType);

    $q = "select iv.country_code, 
        iv.year, 
        no_of_indicator, 
        iv.value as value, " . ($weights == "" ? "" : "iv.value * awv.value as weighted_value, ") .
        "is_percentage, is_computed, is_textual_values_indicator " . ($weights == "" ? "" : ", awv.value as weight ") .
        " from indicators_values iv join indicators i on (iv.indicator_id = i.indicator_id)" .
        ($weights == "" ? "" : " left join eu_aggregation_weights aw on(true)") .
        ($weights == "" ? "" : " left join eu_aggregation_weights_values awv on (awv.country_code = iv.country_code and awv.year = iv.year and aw.eu_aggregation_weight_id = awv.eu_aggregation_weight_id)") .
        " where iv.country_code in('" . implode("','", $countriesArray) . "')" .
        ($weights == "" ? "" : " and aw.eu_aggregation_weight_id in(" . implode(",", $weightsArray) . ")") .
        "and iv.year in (2014, 2015, 2016, 2017, 2018, 2019) " .
        "and $fileTypeSqlCondition " .
        "and no_of_indicator in(" . $is . ") order by country_code asc, iv.year, no_of_indicator asc, indicator_origin_type asc";

    //echo $q;
    //return;

    $result = mysqli_query($connect, $q);

    // Add missing indicator values for some years, in order not to break entire results section when one year is missing
    $ret = $apiHelper->initResultForQueryPage($ret, $requestedCountries, $indicatorsArray, $allRelevantYears);

    $addedToAggregate = array();

    $addedToEuCountriesSetArray = array();

    // Process the fetched raw results
    while ($r = $result->fetch_assoc()) {

        $type = $apiHelper->determineValueTypeForIndicatorSqlRow($r);

        $no = $r["no_of_indicator"];
        $ye = $r["year"];
        $co = $r["country_code"];
        $va = $r["value"];
        $wv = !empty($r["weighted_value"]) ? $r["weighted_value"] : null;
        $we = !empty($r["weight"]) ? $r["weight"] : null;

        if (in_array($co, $requestedCountries)) {
            $ret[$co][$ye][$no] = array($va, $type);
        }

        // EU calculation:
        if ($isEuSelected) {
            if (in_array($co, $allEuMemberStatesIso2s)) { // Sanity check - we only take values of EU member states into account

                // For controls if the indicator value (country, year, no_of_indicator, value) is already added or not
                $euCountriesSet = array($co, $ye, $no);

                // Only account for this indicator value - in the EU calculations - if not already calculated
                if (!in_array($euCountriesSet, $addedToEuCountriesSetArray)) {
                    array_push($addedToEuCountriesSetArray, $euCountriesSet);
                    if (is_numeric($va)) {

                        $ret["EU"][$ye][$no][0] += $wv; // Add this country's weighted value to the aggregate sum
                        $ret["EU"][$ye][$no][1] = $type;
                        $ret["EU"][$ye][$no][2] += 1;
                        $ret["EU"][$ye][$no][3] += $we; // Add this country's weight to the weights sum


                    } else {
                    }
                }
            }
        }

        // Calculate also the aggregation
        if ($aggregation) {

            // For controls if already added or not
            $set = array($co, $ye, $no);

            if (isset($aggregationArray) && in_array($co, $aggregationArray) && !in_array($set, $addedToAggregate)) {
                array_push($addedToAggregate, $set);

                if ("percentage" == $type) {
                    $ret["aggregation"][$ye][$no][0] += is_numeric($va) ? ($va / count($aggregationArray)) : 0;
                } else {
                    $ret["aggregation"][$ye][$no][0] += is_numeric($va) ? $va : 0;
                }

                $ret["aggregation"][$ye][$no][1] = $type;
            }
        }
    }

    if ($aggregation && isset($aggregationArray)) {
        $ret["aggregationName"] = implode(',', $aggregationArray);
    }

    //print "to return:<pre>";
    //print_r($ret);
    //print "</pre>";

    echo json_encode($ret);
}


// Data to return to speedometer component
if ("speedometer" == $entity) {
    $indicator = !empty($_GET["indicator"]) ? $_GET["indicator"] : "no indicator name given";
    $country = !empty($_GET["country"]) ? $_GET["country"] : "no country name given";
    $countries = "'" . $allEuCountriesForSqlQuery . "'";
    $countries = str_replace(",", "','", $countries);

    //print "is:<pre>";
    //print_r($is);
    //print "</pre>";

    // We only take the data for speedometer from the 'a' file(s) extracted data
    $q = "select country_code, year, no_of_indicator as no_of_indicator, value, is_percentage from indicators_values c 
            join indicators i on (c.indicator_id = i.indicator_id)
            where country_code in(" . $countries . ") 
            and year in (2014, 2015, 2016, 2017, 2018) 
            and extracted_from_file_type = 'consolidated-a'
            and no_of_indicator = '" . $indicator . "'";


    //echo "query is: " . $q;
    //return;

    $result = mysqli_query($connect, $q);

    $ret = array();

    while ($r = $result->fetch_assoc()) {

        $r["unitType"] = $apiHelper->determineValueTypeForIndicatorSqlRow($r);
        //print "an r is:<pre>";
        //print_r($r);
        //print "</pre>";
        array_push($ret, $r);
    }

    echo json_encode($ret);
}



// Get all weights from the DB
if ("weights-list" == $entity) {
    $q = "select * from eu_aggregation_weights order by eu_aggregation_weight_id asc";

    //echo $q;
    //return;

    $result = mysqli_query($connect, $q);

    //print "<pre>";
    //print_r($result);
    //print "</pre>";

    $res = array();

    while ($r = $result->fetch_assoc()) {

        //print "r is: <pre>";
        //print_r($r);
        //print "</pre>";

        array_push($res, $r);
    }

    echo json_encode($res);
}

// Get CDF value from SQL
if ("cdf" == $entity) {
    $dr = !empty($_GET["dr"]) ? $_GET["dr"] : "no dr value given";
    $dof = !empty($_GET["dof"]) ? $_GET["dof"] : "no dof value given";

    $q = "select tdist($dr,$dof) as cdf from users limit 1";

    //echo $q;
    //return;

    $result = mysqli_query($connect, $q);

    //print "<pre>";
    //print_r($result);
    //print "</pre>";

    $res = array();

    $r = $result->fetch_assoc();
    $res = $r["cdf"];

    //print "r is: <pre>";
    //print_r($r);
    //print "</pre>";

    echo json_encode($res);
}

// Batch get CDF values from SQL
if ("cdfs" == $entity) {
    if (
        "xampp" != $server &&
        "theseus" != $server
    ) {
        return; // on other (mamp.....) server currently the cdfs calculation is not implemented, so return
    } else {
        //
    }

    $drs = !empty($_GET["drs"]) ? $_GET["drs"] : "no drs value given";
    $dof = !empty($_GET["dof"]) ? $_GET["dof"] : "no dof value given";

    $drs = explode(',', $drs);

    //print_r($drs);
    //return;

    $q = "select "; //tdist($dr,$dof) 

    $counter = 0;
    foreach ($drs as $dr) {
        if ($counter != 0) {
            $q .= ",";
        }
        $q .= " tdist($dr,$dof) as cdf$counter ";

        $counter++;
    }

    $q .= " from users limit 1";

    //echo $q;
    //return;

    $result = mysqli_query($connect, $q);

    //print "<pre>";
    //print_r($result);
    //print "</pre>";

    $res = array();

    while ($r = $result->fetch_assoc()) {

        //print "r is: <pre>";
        //print_r($r);
        //print "</pre>";

        array_push($res, $r);
    }

    echo json_encode($res[0]);
    //print_r($res[0]);
}

if ("formulas-comparison" == $entity) {
    require_once "FormulaCheck.php";
}

if ("indicator-existence" == $entity) {

    $no = !empty($_GET["no"]) ? $_GET["no"] : "no indicator code given";

    $q = "select * from indicators where no_of_indicator = '" . $no . "'";

    //echo $q;
    //return;

    $result = mysqli_query($connect, $q);

    //print "<pre>";
    //print_r($result);
    //print "</pre>";

    $res = array();

    while ($r = $result->fetch_assoc()) {

        //print "r is: <pre>";
        //print_r($r);
        //print "</pre>";

        array_push($res, $r);
    }

    echo json_encode($res);
}

if ("process-status" == $entity) {

    $process = !empty($_GET["process"]) ? $_GET["process"] : "no process given";

    $q = "select status from process_status where process = '" . $process . "'";

    $result = mysqli_query($connect, $q);

    $res = array();

    $r = $result->fetch_assoc();

    array_push($res, $r);

    echo json_encode($res);
}

if ("permission" == $entity) {
    $object = !empty($_GET["object"]) ? $_GET["object"] : "no object given";
    $location = !empty($_GET["location"]) ? $_GET["location"] : "no location given";
    $userType = !empty($_GET["userType"]) ? $_GET["userType"] : "no usertType given";

    $q = "select value from acl 
        where object = '$object' 
        and location='$location' 
        and userType='$userType'";

    $result = mysqli_query($connect, $q);

    $res = array();

    $r = $result->fetch_assoc();

    array_push($res, $r);

    echo json_encode($r);
}

// Dependency tree for a set of indicators, for each of these indicators, return dependants and ingredients
if ("indicators-dependencies" == $entity) {

    //error_reporting(E_ALL);

    // Form the all indicators array, to be used in case no specific indicators given
    $ib = $db->indicatorBroker;
    $allIndicators = $ib->getAllIndicatorsBasicInfos("ALL", $indicatorBasicFields);
    $all = array();
    foreach ($allIndicators as $ind) {
        array_push($all, $ind["no_of_indicator"]);
    }

    //print "allIndicators:<pre>";
    //print_r($allIndicators);
    //print "</pre>";

    $indicators = !empty($_GET["indicators"]) ? $_GET["indicators"] : implode(",", $all);

    $indicatorsArray = explode(",", $indicators);

    //print "indicatorsArray is:<pre>";
    //print_r($indicatorsArray);
    //print "</pre>";

    $dependencies = array();

    // Get the formulas broker
    $fb = $db->formulaBroker;

    $ings = $fb->getIngredientsList();

    foreach ($indicatorsArray as $no) {
        if (empty($dependencies[$no])) {
            $dependencies[$no] = array();
        }

        $dependencies[$no]["ingredients"] = empty($ings[$no]) ? array() : $ings[$no];

        // Get dependants
        $dependencies[$no]["dependants"] = $fb->getDependantsOfIndicator($no);
    }

    //dependencyStructure
    //print "dependencies is: <pre>";
    //print_r($dependencies);
    //print "</pre>";

    echo json_encode($dependencies);
}
