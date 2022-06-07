<?php

$tablesReady = array();
$tablesReady["A"] = "2014-2019";
$tablesReady["Q"] = "2014-2019";
$tablesReady["QA"] = $tablesReady["Q"];
$tablesReady["A_and_computed"] = $tablesReady["A"];

$allEuCountriesForSqlQuery = "AT,BE,BG,CY,CZ,DE,DK,EE,EL,ES,FI,FR,HR,HU,IE,IT,LT,LU,LV,MT,NL,PL,PT,RO,SE,SI,SK,UK";

// Used e.g. to populate the custom select dropdowns
$allEuMemberStatesIso2s = array(
    "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "EL", "ES", "FI", "FR", "HR", "HU",
    "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK", "UK"
);


$euCandidateCountries = array("AL", "ME", "MK", "RS", "TR");

$euMembersAndCandidatesIso2sForSqlQuery = "AL,AT,BE,BG,CY,CZ,DE,DK,EE,EL,ES,FI,FR,HR,HU,IE,IT,LT,LU,LV,ME,MK,MT,NL,PL,PT,RO,RS,SE,SI,SK,TR,UK";

$euMembersAndCandidatesIso2s = array(
    "AL", "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "EL", "ES", "FI", "FR", "HR",
    "HU", "IE", "IT", "LT", "LU", "LV", "ME", "MK", "MT", "NL", "PL", "PT", "RO", "RS",
    "SE", "SI", "SK", "TR", "UK"
);

if (!defined("MISSING_VALUE")) {
    define("MISSING_VALUE", "Missing value");
}

if (!defined("EMPTY_VALUE")) {
    define("EMPTY_VALUE", null); // Empty value
}

if (!defined("INITIAL_VALUE")) {
    define("INITIAL_VALUE", " "); // Default initial value
}

if (!defined("NOT_AVAILABLE_VALUE")) {
    define("NOT_AVAILABLE_VALUE", "NA"); // NA value (not available)
}

if (!defined("NOT_AVAILABLE_VALUE_FOR_COMPUTED")) {
    define("NOT_AVAILABLE_VALUE_FOR_COMPUTED", "not computable"); // NA value (not available)
}

if (!defined("NOT_AVAILABLE_VALUE_FOR_RAW")) {
    define("NOT_AVAILABLE_VALUE_FOR_RAW", "NA"); // NA value (not available)
}

$allRelevantYears = array(2014, 2015, 2016, 2017, 2018, 2019);


$indicatorBasicFields = "no_of_indicator, name_of_indicator, indicator_origin_type, has_calculation_exception, calculation_exception_text";

if (!function_exists("printr")) {
    function printr($o, $msg = "")
    {
        print "$msg<pre>";
        print_r($o);
        print "</pre>\n";
    }
}

if (!function_exists("is_valid_number")) {
    function is_valid_number($o)
    {
        $o = trim($o);

        if ($o == "") {
            return false;
        }

        if ($o !== 0) {
            if (!isset($o) || !is_numeric($o)) {
                return false;
            }
        }

        return true;
    }
}
