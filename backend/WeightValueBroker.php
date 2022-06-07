<?php

require "Constants.php";
require_once "config.php";

class WeightValueBroker
{
    var $connection;

    function setConnection($c)
    {
        $this->connection = $c;
    }

    // The function accepts the weight name, the country ISO2 and year
    function getWeightValue($weight, $country, $year)
    {
    }

    function getAllWeightsValuesTree()
    {
        $q = "select w.eu_aggregation_weight_id as id, w.weight_name, year, country_code as country, wv.value as value
            from eu_aggregation_weights_values wv 
            join eu_aggregation_weights w on (w.eu_aggregation_weight_id = wv.eu_aggregation_weight_id);";


        $result = mysqli_query($this->connection, $q);

        while ($row = $result->fetch_assoc()) {
            $id = $row["id"];
            $year = $row["year"];
            $country = $row["country"];
            $value = $row["value"];

            $r[$id][$country][$year] = $value;
        }

        return $r;
    }
}
