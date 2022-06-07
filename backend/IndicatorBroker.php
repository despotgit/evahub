<?php

require "Constants.php";
require_once "config.php";

class IndicatorBroker
{
    var $connection;

    function setConnection($c)
    {
        $this->connection = $c;
    }

    // Add the indicator to DB
    function saveIndicatorToDB(Indicator $ind)
    {
        //print "in indicator broker, ind is:<pre>";
        //print_r($ind);
        //print "</pre>";

        // Add the indicator to DB
        $q = "insert into indicators (
        `strategic_objective`,
        `extra_key_1`,
        `extra_key_2`,
        `extra_key_3`,
        `extra_key_4`,
        `name_of_indicator`,
        `no_of_indicator`,
        `unit`,
        `is_kpi_indicator`,
        `extracted_from_file_type`,
        `extracted_from_file_year`,
        `additional_info`)
        VALUES
        (
        '$ind->strategicObjective',
        '$ind->extraKey1',
        '$ind->extraKey2',
        '$ind->extraKey3',
        '$ind->extraKey4',
        '$ind->nameOfIndicator',
        '$ind->noOfIndicator',
        '$ind->unit',
        $ind->isKpiIndicator,
        '$ind->extractedFromFileType',
        '$ind->extractedFromFileYear',
        '$ind->additionalInfo'
        )";

        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);
        return $result;

        //print "result is:<pre>";
        //print_r($result);
        //print "</pre>";
    }

    // Delete indicator from indicators table, given indicator's id
    function deleteIndicatorById($id)
    {
        // Delete the indicator from DB
        $q = "delete from indicators where indicator_id=$id";

        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);
        return $result;
    }

    // Delete indicator from indicators table, given indicator's no_of_indicator, type of file and year of file
    function deleteIndicatorByIndicatorDetails(Indicator $ind)
    {
        // Delete the indicator from DB
        $q = "delete from indicators where no_of_indicator='$ind->noOfIndicator' 
            and extracted_from_file_type='$ind->extractedFromFileType' 
            and extracted_from_file_year='$ind->extractedFromFileYear'";

        //echo "query for deletion of the indicator is: ";
        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);
        return $result;
    }

    // Delete indicator(s) from indicators table, given indicator(s)'s no_of_indicator, if not subject to any sql CONSTRAINT
    function deleteIndicatorByNoOfIndicator($code)
    {
        // Delete the indicator(s) from DB
        $q = "delete from indicators where no_of_indicator='$code'";

        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);
        return $result;
    }


    // Get indicator_id by no_of_indicator
    function getIndicatorIdByNoOfIndicator($no)
    {
        $q = "select indicator_id from indicators where no_of_indicator='$no' order by indicator_id desc limit 1";


        $result = mysqli_query($this->connection, $q);

        $r = $result->fetch_assoc();
        $id = $r["indicator_id"];

        //echo "id is: " . $id;

        return $id;
    }

    // Get indicator_id by no_of_indicator, type of file and year of file
    function getIndicatorIdByIndicatorDetails(Indicator $ind)
    {
        $no = $ind->noOfIndicator;
        $fileType = $ind->extractedFromFileType;
        $fileYear = $ind->extractedFromFileYear;

        // Delete the indicator from DB
        $q = "select indicator_id from indicators 
            where no_of_indicator='$no' 
            and extracted_from_file_type='$fileType' 
            and extracted_from_file_year='$fileYear'";

        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);

        $r = $result->fetch_assoc();
        $id = $r["indicator_id"];

        //echo "id is: " . $id;

        return $id;
    }

    // Get indicator_id by no_of_indicator, type of file and year of file
    function getIndicatorIdByReducedIndicatorDetails(Indicator $ind)
    {
        $no = $ind->noOfIndicator;
        $fileType = $ind->extractedFromFileType;

        // Delete the indicator from DB
        $q = "select indicator_id from indicators 
            where no_of_indicator='$no' 
            and extracted_from_file_type='$fileType'";

        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);

        $r = $result->fetch_assoc();
        $id = $r["indicator_id"];

        //echo "id is: " . $id;

        return $id;
    }

    // Get indicator_origin_type by no_of_indicator, fetching the first found indicator
    function getIndicatorOriginTypeByNo($no)
    {
        // Delete the indicator from DB
        $q = "select indicator_origin_type from indicators 
            where no_of_indicator='$no' order by indicator_id desc limit 1";

        $result = mysqli_query($this->connection, $q);

        $r = $result->fetch_assoc();
        $ot = $r["indicator_origin_type"];

        //echo "ot is: " . $ot;

        return $ot;
    }

    // Determine value type of an indicator
    function isIndicatorAPercentage($no)
    {
        // Delete the indicator from DB
        $q = "select is_percentage from indicators 
            where no_of_indicator='$no'";

        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);

        $r = $result->fetch_assoc();

        $ip = $r["is_percentage"];


        if (1 == $ip) {
            return true;
        } else {
            return false;
        }
    }

    function getAllIndicatorsBasicInfos($fileType, $fieldsToFetch)
    {
        if ("Q" == $fileType) {
            $q = "select distinct $fieldsToFetch from indicators where not is_hidden and extracted_from_file_type='consolidated-q' order by no_of_indicator asc";
        }

        if ("A" == $fileType) {
            $q = "select distinct $fieldsToFetch from indicators where not is_hidden and extracted_from_file_type='consolidated-a' order by no_of_indicator asc";
        }

        if ("ALL" == $fileType) {
            $q = "select distinct $fieldsToFetch from indicators where not is_hidden order by no_of_indicator asc";
        }


        if ("raw" == $fileType) {
            $q = "select distinct $fieldsToFetch from indicators where not is_hidden 
                and indicator_origin_type = 'raw' order by no_of_indicator asc";
        }

        if ("computed" == $fileType) {
            $q = "select distinct $fieldsToFetch from indicators where not is_hidden 
                and indicator_origin_type = 'computed' order by no_of_indicator asc";
        }


        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);

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

        return $res;
    }
}
