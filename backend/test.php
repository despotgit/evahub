<?php

include_once "Constants.php";
/* 
//TIME INTERVALS
$timeFormat = "Y-m-d H:i:s";

$now = new DateTime("NOW");


//echo "now is:";
//echo $now->format($timeFormat);
//print_r($now);

$toAdd = new DateInterval('PT24H');


$d1 = new DateTime("NOW");
$d1->add($toAdd);

//echo $d1["date"];

//echo "<br/>d1:";
//echo $d1->format($timeFormat);

if ($d1 > $now) {
    echo "<br/>d1 is bigger";
} else {
    echo "<br/>now is bigger";
}

$diff = date_diff($d1, $now);

//echo "difference is:";
//print_r($diff);

echo "number of days in the diff is: " . $diff->days . " and hours: " . $diff->h;

*/

/*
$a = array();

$a["jedan"]["dva"]["tri"] = 1.5;
$a["jedan"]["dva"]["cetri"] = 4;
$a["jedan"]["dva"]["pet"] = 5;

print "a is:<pre>";
print_r($a);
print "</pre>";
*/

/* VALID NUMBER TEST
$num = 0;

echo "is it valid, $num:";
echo !$num ? "NO!" : "YES!";

*/

$o = "one";

if ($o != 0) {
    echo "it is not equal to zero";
} else {
    echo "it is equal to zero";
}
