<?php

require_once "DB.php";
require_once "config.php";
require_once "IndicatorBroker.php";


class ApiHelper
{
    var $db;
    var $connection;

    public function determineValueTypeForIndicatorSqlRow($r)
    {
        if (1 == $r["is_percentage"]) {
            return "percentage";
        }

        if (1 == $r["is_textual_values_indicator"]) {
            return "text";
        }

        return "number";
    }



    // Init the needed values to null, if empty (used on query page)
    function initResultForQueryPage($ret, $countriesArray, $indicatorsArray, $years)
    {
        // Add missing indicator values for some years, in order not to break entire results section when one year is missing
        foreach ($countriesArray as $c) {
            foreach ($indicatorsArray as $i) {
                foreach ($years as $year) {
                    if (empty($ret[$c][$year]) || empty($ret[$c][$year][$i])) {
                        //echo "not the $ret of $c of $year";

                        //print "i is:<pre>";
                        //print_r($i);
                        //print "</pre>";


                        if ("computed" == $this->db->indicatorBroker->getIndicatorOriginTypeByNo($i)) {
                            $ret[$c][$year][$i] = array(NOT_AVAILABLE_VALUE_FOR_COMPUTED, "default");
                        } else {
                            $ret[$c][$year][$i] = array(NOT_AVAILABLE_VALUE_FOR_RAW, "default");
                        }
                    } else {
                    }
                }
            }
        }

        return $ret;
    }

    /*
        Processes the raw data from input from http, forms the formatted data to give out to DB broker
        $rawData - full raw http data e.g. Array([A1] => Array([t] => s [v] => ext-import .........
        $indicatorNameField - name of the field where indicator name is located  e.g. A3
        $yearColumns - range of columns e.g. B-G
        $countriesRows - range of rows e.g. 2-30
    */
    function prepareDataForNewIndicator(
        $rawData,
        $noOfIndicatorField = "A2",
        $indicatorNameField = "B2",
        $isKpiIndicatorField = "C2",
        $strategicObjectiveField = "D2",
        $extractedFromFileTypeField = "E2",
        $extractedFromFileYearField = "F2",
        $yearColumns = array("B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"),
        $countriesRows = "5-37"
    ) {
        $ret = array();

        // Prepare indicator part
        $ret["noOfIndicator"] = $rawData[$noOfIndicatorField]["v"];
        $ret["nameOfIndicator"] = $rawData[$indicatorNameField]["v"];
        $ret["isKpiIndicator"] = $rawData[$isKpiIndicatorField]["v"];
        $ret["strategicObjective"] = $rawData[$strategicObjectiveField]["v"];
        $ret["extractedFromFileType"] = $rawData[$extractedFromFileTypeField]["v"];
        $ret["extractedFromFileYear"] = $rawData[$extractedFromFileYearField]["v"];

        // Prepare indicator values part
        $ranges = explode("-", $countriesRows);
        $countriesStartingRow = $ranges[0];
        $countriesEndingRow = $ranges[1];

        foreach ($yearColumns as $yearColumn) {
            for ($i = $countriesStartingRow; $i <= $countriesEndingRow; $i++) {

                // Find the year (2013 or 2014 or 2015 or.....)
                $year = $rawData[$yearColumn . ($countriesStartingRow - 1)]["v"];

                // Get the country code (AT or BE or BG or.....) assume temporarily that it is always column A, even if first year column is not B
                $countryColumn = $yearColumns[0] == "B" ? "A" : "A";
                $country = $rawData[$countryColumn . $i]["v"];

                //echo "country: " . $country;
                //echo "year: " . $year;

                $values[$year][$country] = $rawData[$yearColumn . $i]["v"];
            }
        }

        $ret["values"] = $values;

        //print "ret is:<pre>";
        //print_r($ret);
        //print "</pre>";

        return $ret;
    }

    // Filter of indicators of certain type (computed or not, and based on which file it is extracted from)
    function getIndicatorFileTypeSqlCondition($fileType)
    {
        switch ($fileType) {
            case "A":
                $fileTypeSqlCondition = " extracted_from_file_type = 'consolidated-a' ";
                break;
            case "Q":
                $fileTypeSqlCondition = " extracted_from_file_type = 'consolidated-q' ";
                break;
            case "QA":
                $fileTypeSqlCondition = " (extracted_from_file_type = 'consolidated-q' or extracted_from_file_type = 'consolidated-a') ";
                break;
            case "AQ":
                $fileTypeSqlCondition = " (extracted_from_file_type = 'consolidated-a' or extracted_from_file_type = 'consolidated-q') ";
                break;
            case "A_and_computed":
                $fileTypeSqlCondition = " (extracted_from_file_type = 'consolidated-a' or i.is_computed) ";
                break;
            case "ALL":
                $fileTypeSqlCondition = " 1=1 ";
                break;
            default:
                $fileTypeSqlCondition = " 1=1 ";
                break;
        }
        return $fileTypeSqlCondition;
    }
}
