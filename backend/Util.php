<?php

class Util
{
    // Return as comma separated (delimiter), apostrophe wrapped (wrapper) elements list, per default
    public static function returnArrayAsSqlList($arr, $d = ",", $w = "'")
    {
        $sn = "";

        foreach ($arr as $e) {
            $sn .= $w . $e . $w . $d;
        }

        $ret = substr($sn, 0, strlen($sn) - 1);

        return $ret;
    }
}
