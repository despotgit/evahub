<?php

require "Constants.php";
require "Util.php";

class IndicatorValueBroker
{
    var $connection;

    function setConnection($c)
    {
        $this->connection = $c;
    }

    function updateIndicatorValue(IndicatorValue $iv) //  $year, $indicatorId, $countryCode, $value)
    {
        // Update indicator value given the year, indicator id and country code:
        $q = "update indicators_values set value='$iv->value' where 1=1
            and year=$iv->year 
            and indicator_id=$iv->indicatorId  
            and country_code='$iv->countryCode'";

        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);
        return $result;
    }

    // Add an indicator value to the DB
    function saveIndicatorValueToDB(IndicatorValue $iv)
    {

        // Add the indicator from DB
        $q = "insert into indicators_values (
        `year`,
        `Q1`,
        `Q2`,
        `Q3`,
        `Q4`,
        `indicator_id`,
        `country_code`,
        `value`,
        `additional_info`,
        `origin`,
        `import_batch_id`)
        VALUES
        (
        '$iv->year',
        '$iv->q1',
        '$iv->q2',
        '$iv->q3',
        '$iv->q4',
        '$iv->indicatorId',
        '$iv->countryCode',
        '$iv->value',
        '$iv->additionalInfo',
        '$iv->origin',
        '$iv->batchId'
        )";


        $result = mysqli_query($this->connection, $q);
        return $result;
    }

    // Add the heregiven indicator values to the DB
    function saveIndicatorsValuesToDB(array $indicatorsValues)
    {
        foreach ($indicatorsValues as $iv) {
            $this->saveIndicatorValueToDB($iv);
        }
    }

    // Delete all indicator values given the indicator's details
    function deleteIndicatorValuesByIndicatorDetails(Indicator $ind)
    {

        $no = $ind->noOfIndicator;
        $ty = $ind->extractedFromFileType;
        $ye = $ind->extractedFromFileYear;


        // Delete the indicator from DB
        $q = "delete from indicators_values where indicator_id in(select indicator_id from indicators 
        where no_of_indicator='$no' and extracted_from_file_type='$ty' and extracted_from_file_year='$ye')";

        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);
    }

    // Delete all indicator values for a certain indicator_id
    function deleteIndicatorValuesByIndicatorId($indicatorId)
    {
        // Delete the indicator from DB
        $q = "delete from indicators_values where indicator_id=$indicatorId";

        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);
    }

    // Delete only one indicator value
    function deleteIndicatorValuesByIndicatorValueId(IndicatorValue $indicatorValue)
    {
        $id = $indicatorValue->indicatorValueId;
        // Delete the indicator from DB
        $q = "delete from indicators_values where indicator_value_id=$id";

        //echo $q;
        //return;

        $result = mysqli_query($this->connection, $q);
    }

    // Delete indicator values by indicator's no_of_indicator
    function deleteIndicatorValuesByNoOfIndicator($no)
    {
        // Delete the indicator from DB
        $q = "delete from ids";
        $result = mysqli_query($this->connection, $q);

        $q = "insert into ids select indicator_id from indicators where no_of_indicator='$no'";
        $result = mysqli_query($this->connection, $q);

        $q = "delete from indicators_values where indicator_id in(select indicator_id from ids);";
        $result = mysqli_query($this->connection, $q);

        //echo $q;
        //return;

        return;
    }

    // Delete indicator values by indicator's no_of_indicator
    function deleteIndicatorValuesByNoAndYear($no, $ye)
    {
        $q = "delete from ids";
        $result = mysqli_query($this->connection, $q);

        $q = "insert into ids select indicator_id from indicators where no_of_indicator='$no'";
        $result = mysqli_query($this->connection, $q);

        $q = "delete from indicators_values where indicator_id in(select indicator_id from ids) and year = " . $ye . ";";
        $result = mysqli_query($this->connection, $q);

        //echo $q;
        //return;

        return;
    }

    // Save the whole import batch of indicators values
    function saveIndicatorsValuesImportBatch($id)
    {
        //
        $q = "insert into indicators_values_backup select * from indicators_values where import_batch_id='$id'";
        $result = mysqli_query($this->connection, $q);
    }
}
