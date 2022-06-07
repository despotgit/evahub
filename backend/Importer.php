<?php


class Importer
{

    function import($fileName, $tableName, $mappingRule)
    {
        /* 

        $fileName - the name of the excel file to take and process
        $tableName -  the name of the sql table to update if neccesary during the process
        $mappingRule - rule of reflection of an excel field to a table field (optional)
        
        TO DO:go through each row of the excel file, and for each do operations specified:
        1. take that indicator ID (no_of_indicator) from the excel file, take the values of each field of that row, reflect it adequately to db fields, 
           find that indicator row in DB, update its row if necessary with the extra_key_1, extra_key_2, extra_key_3, extra_key_4, and other values 
           as necessary.
        2. done.
          



        */
        error_log('niente');
    }
}



$importer = new Importer();
