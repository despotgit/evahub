<?php

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
