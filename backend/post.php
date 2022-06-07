<?php

set_time_limit(7200);

require_once "DB.php";
require_once "config.php";
require_once "IndicatorBroker.php";
require_once "IndicatorValueBroker.php";
require_once "ProcessStatusBroker.php";
require_once "PermissionBroker.php";
require_once "Calculator.php";
require_once "Amender.php";

use \Firebase\JWT\JWT;

$operation = !empty($factors[4]) ? $factors[4] : ""; // authenticate, rest ....
$entity = !empty($factors[5]) ? $factors[5] : ""; // indicator, kpi.... (used in REST calls)
$verb = !empty($factors[6]) ? $factors[6] : ""; // add, delete, update, rebuild..... (used in REST calls)

// Log in with username and password
if ("authenticate" == $operation) {

    //[HTTP_X_FORWARDED_FOR] => 88.149.228.234
    //[SERVER_ADDR] => 139.191.1.32

    $_POST = json_decode(file_get_contents('php://input'), true);
    $u = $_POST["username"];
    $p = $_POST["password"];

    $cv = new CredentialsVerificator();
    $cv->setConnection($connect);
    $response = $cv->verifyCredentials($u, $p);

    if ($response->authenticated) {
        $t = time();
        $payload = array(
            "iss" => JWT_SERVER_NAME_CLAIM_VALUE,
            "aud" => JWT_CLIENT_NAME_CLAIM_VALUE,
            "cip" => empty($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["REMOTE_ADDR"] : $_SERVER["HTTP_X_FORWARDED_FOR"],
            "iat" => $t

        );

        /**
         * IMPORTANT:
         * You must specify supported algorithms for your application. See
         * https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40
         * for a list of spec-compliant algorithms.
         */
        $jwt = JWT::encode($payload, JWT_SECRET_KEY);

        //print_r($jwt);

        $response->token = $jwt;
        $response->iat = $t;
    }

    echo json_encode($response);
}

// REST service
if ("rest" == $operation) {

    // Security check
    if (!$cv->verifyJwt()) { // Precautionary call to check if someone tries to use the api without being authorized to do so.
        return false;
    }

    $_POST = json_decode(file_get_contents('php://input'), true);
    $data = $_POST["data"];

    // Import indicator and its values for all countries for all years
    if ("indicator-package" == $entity) {
        if ("rebuild" == $verb) {

            //print "IN!!!!! data from post is, for adding new indicator is: <pre>";
            //print_r($data);
            //print "</pre>";

            $indicatorData = $apiHelper->prepareDataForNewIndicator(
                $data,
                "A2",
                "B2",
                "C2",
                "D2",
                "E2",
                "F2",
                array("B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"),
                "5-40"
            );

            //print "<pre>indicatorData is:";
            //print_r($indicatorData);
            //print "</pre>";

            // Add indicator
            $ni = new Indicator();
            $ni->strategicObjective = $indicatorData["strategicObjective"];
            $ni->noOfIndicator = $indicatorData["noOfIndicator"];
            $ni->nameOfIndicator = $indicatorData["nameOfIndicator"];
            $ni->isKpiIndicator = $indicatorData["isKpiIndicator"];
            $ni->extractedFromFileType = $indicatorData["extractedFromFileType"];
            $ni->extractedFromFileYear = $indicatorData["extractedFromFileYear"];
            $ni->additionalInfo = "Added from REST service";

            // Destroy (potentially existent) previous indicator with the same no_of_indicator
            $db->indicatorValueBroker->deleteIndicatorValuesByNoOfIndicator($ni->noOfIndicator);
            $db->indicatorBroker->deleteIndicatorByNoOfIndicator($ni->noOfIndicator);

            // Add the indicator itself to the DB
            $db->indicatorBroker->saveIndicatorToDB($ni);

            // Get the new indicator ID
            $newIndicatorId = $db->indicatorBroker->getIndicatorIdByNoOfIndicator($ni->noOfIndicator);

            // Add indicator values


            //print "ajdi is:<pre>";
            //print_r($indicatorId);
            //print "</pre>";

            foreach ($indicatorData["values"] as $year => $v) {

                //print "v is:<pre>";
                //print_r($v);
                //print "</pre>";

                foreach ($v as $country => $countryIndicatorValue) {

                    $iv = new IndicatorValue();
                    $iv->year = $year;
                    $iv->indicatorId = $newIndicatorId;
                    $iv->countryCode = $country;
                    $iv->value = $countryIndicatorValue;
                    $iv->additionalInfo = "Imported from Import Indicator Package page";
                    $iv->origin = "raw";

                    $db->indicatorValueBroker->saveIndicatorValueToDB($iv);
                }
            }
        }
    }

    // Used on import year indicators values page, accepts: noOfIndicator, year, country and value
    if ("indicator-value" == $entity) {
        if ("add" == $verb) {

            $ind = new Indicator();

            $ind->noOfIndicator = empty($data["noOfIndicator"]) ? "" : $data["noOfIndicator"];

            $indicatorId = $db->indicatorBroker->getIndicatorIdByNoOfIndicator($ind->noOfIndicator);

            $iv = new IndicatorValue();
            $iv->indicatorId = $indicatorId;
            $iv->year = $data["fileYear"];
            $iv->countryCode = $data["countryCode"];
            $iv->value = $data["value"];
            $iv->additionalInfo = $data["additionalInfo"];
            $iv->origin = $data["origin"];
            $iv->batchId = $data["batchId"];

            $db->indicatorValueBroker->saveIndicatorValueToDB($iv);
            return;
        }

        if ("delete" == $verb) {

            $iv = new IndicatorValue();
            $iv->indicatorValueId = $data["indicatorValueId"];

            $db->indicatorValueBroker->deleteIndicatorValuesByIndicatorValueId($iv);
        }

        // Bulk delete values by no_of_indicaotr
        if ("delete-by-no" == $verb) {

            $no = empty($data["noOfIndicator"]) ? "" : $data["noOfIndicator"];

            $db->indicatorValueBroker->deleteIndicatorValuesByNoOfIndicator($no);
        }

        // Bulk delete values by no_of_indicaotr
        if ("delete-by-no-and-year" == $verb) {

            $no = empty($data["noOfIndicator"]) ? "" : $data["noOfIndicator"];
            $ye = empty($data["fileYear"]) ? "" : $data["fileYear"];

            $db->indicatorValueBroker->deleteIndicatorValuesByNoAndYear($no, $ye);
        }
    }

    if ("process-status" == $entity) {

        // Add indicator to indicators table
        if ("update" == $verb) {
            //print "in rest post process-status as entity, update as verb, data is:<pre>";
            //print_r($data);
            //print "</pre>";

            $p = $data["process"];
            $s = $data["status"];

            $ps = new ProcessStatus();
            $ps->process = $p;
            $ps->status = $s;

            $db->processStatusBroker->updateProcessStatus($ps);

            return;
        }
    }

    if ("acl" == $entity) {

        // Add indicator to indicators table
        if ("update" == $verb) {
            //print "in rest post data is:<pre>";
            //print_r($data);
            //print "</pre>";

            $permission = new Permission();

            $permission->permissionObject = $data["permissionObject"];
            $permission->location = $data["location"];
            $permission->userType = $data["userType"];
            $permission->value = $data["value"];

            $db->permissionBroker->updatePermission($permission);

            return;
        }
    }

    if ("indicator" == $entity) {

        // Add indicator to indicators table
        if ("add" == $verb) {
            $ind = new Indicator();

            $ind->extraKey1 = $data["extraKey1"];
            $ind->extraKey2 = $data["extraKey2"];
            $ind->extraKey3 = $data["extraKey3"];
            $ind->extraKey4 = $data["extraKey4"];
            $ind->noOfIndicator = $data["noOfIndicator"];
            $ind->extractedFromFileYear = $data["fileYear"];
            $ind->extractedFromFileType = $data["fileType"];
            $ind->nameOfIndicator = $data["nameOfIndicator"];
            $ind->additionalInfo = $data["additionalInfo"];
            $ind->isKpiIndicator = $data["isKpiIndicator"];
            $ind->strategicObjective = $data["strategicObjective"];

            $db->indicatorBroker->saveIndicatorToDB($ind);
            return;
        }

        // Delete only the indicator by indicator details
        if ("delete" == $verb) {
            $ind = new Indicator();

            $ind->noOfIndicator = $data["noOfIndicator"];
            $ind->extractedFromFileYear = $data["fileYear"];
            $ind->extractedFromFileType = $data["fileType"];

            $db->indicatorBroker->deleteIndicatorByIndicatorDetails($ind);
            return;
        }

        // Delete only the indicator by no_of_indicator
        if ("delete-by-no" == $verb) {
            $ind = new Indicator();

            $ind->noOfIndicator = $data["noOfIndicator"];

            $db->indicatorBroker->deleteIndicatorByNoOfIndicator($ind->noOfIndicator);
            return;
        }

        // Delete the indicator of a certain year AND its associated indicator values
        if ("destroy" == $verb) {
            $ind = new Indicator();

            $ind->noOfIndicator = $data["noOfIndicator"];
            $ind->extractedFromFileYear = $data["fileYear"];
            $ind->extractedFromFileType = $data["fileType"];

            $db->indicatorValueBroker->deleteIndicatorValuesByIndicatorDetails($ind);
            $db->indicatorBroker->deleteIndicatorByIndicatorDetails($ind);

            return;
        }

        // Hard destroy the indicator, and indicator values
        if ("hard-destroy" == $verb) {
            $ind = new Indicator();

            $ind->noOfIndicator = $data["noOfIndicator"];

            //try {
            $db->indicatorValueBroker->deleteIndicatorValuesByNoOfIndicator($ind->noOfIndicator);
            $db->indicatorBroker->deleteIndicatorByNoOfIndicator($ind->noOfIndicator);
            //} catch (Exception $e) {
            //    error_log($e);
            //}

            return;
        }

        // Delete the indicator of a certain year and its associated indicator values
        if ("ratio-rebuild" == $verb) {
            $ind = new Indicator();

            $ind->noOfIndicator = $data["noOfIndicator"];
            $ind->extractedFromFileYear = $data["fileYear"];
            $ind->extractedFromFileType = $data["fileType"];

            $db->indicatorValueBroker->deleteIndicatorValuesByNoOfIndicator($ind->noOfIndicator);
            $db->indicatorBroker->deleteIndicatorByNoOfIndicator($ind->noOfIndicator);

            return;
        }

        // Recalculation process
        if ("process-all-regular-formulas" == $verb) {

            // TO DO

        }

        if ("process-exceptions" == $verb) {

            include "ProcessExceptions.php";
        }

        // Recalculation process
        if ("recalculate-all" == $verb) {


            $calculator = new Calculator();
            $calculator->setConnection($connect);
            $calculator->recalculateAll(false, true);
        }

        if ("save-iv-import-batch" == $verb) {

            $id = $data;

            $db->indicatorValueBroker->saveIndicatorsValuesImportBatch($id);
        }
    }

    if ("global" == $entity) {
        if ("process-final-amendments" == $verb) {
            //ini_set('display_errors', 1);
            //error_reporting(E_ALL);

            $amender = new Amender();
            $amender->setConnection($connect);
            $amender->makeAmendments();
        }
    }

    if ("computation-formula" == $entity) {
        if ("prioritize-formulas" == $verb) {
            include "PrioritizeFormulas.php";
        }
    }
}
