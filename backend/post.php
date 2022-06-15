<?php

set_time_limit(7200);

require_once "DB.php";
require_once "config.php";

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
            "iat" => $t,

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

}
