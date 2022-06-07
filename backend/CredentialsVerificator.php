<?php

use \Firebase\JWT\JWT;

class CredentialsVerificator
{
    public function setConnection($connect)
    {
        $this->connect = $connect;
    }

    // Verifies the username/password credentials
    public function verifyCredentials($username, $password)
    {
        $connect = $this->connect;

        $username = htmlspecialchars(strip_tags($username));
        $password = htmlspecialchars(strip_tags($password));

        // Create salt and rehash password
        $prehash = crypt($password, SALT);
        $password = crypt($password, $prehash);

        // select query
        $query = "select * from users where username = '" . $username . "' and password = '" . $password . "'";

        $result = mysqli_query($connect, $query);

        $r = $result->fetch_assoc();

        $response = new stdClass();

        if ($r) {

            $response->authenticated = true;
            $response->role = $r["role"];
            $response->username = $username;

            return $response;
        } else {

            $response->authenticated = false;
            return $response;
        }
    }

    // Verifies the JWT token
    public function verifyJwt()
    {

        $headers = apache_request_headers();

        $authHeader = explode(" ", $headers["Authorization"]);

        $jwt = $authHeader[1] ? $authHeader[1] : "";

        // This value has not been generated on server, but independently, on the client, but it needs to accord
        $clientVersion = $authHeader[2] ? $authHeader[2] : "";

        if (empty($jwt)) {
            echo "No jwt token found in headers.";
            return false;
        }

        $jwtDecoded = JWT::decode($jwt, JWT_SECRET_KEY, array('HS256'));

        //print "JWT decoded is:<pre>";
        //print_r($jwtDecoded);
        //print "</pre>";

        // Verify the signing is proper
        if (
            JWT_SERVER_NAME_CLAIM_VALUE != $jwtDecoded->iss || // serve ony client that got the server claim value from server
            JWT_CLIENT_CLAIM_VALUE !== $clientVersion // serve only the client that has a certain value on it
        ) {
            echo "Failed to verify the JWT token $jwtDecoded<br/>";
            return false;
        }

        // Verify that the token has not expired
        $jwtExpirationInterval = 60;

        if ($jwtDecoded->iat) {
            $iat = $jwtDecoded->iat;
        } else {
            return false;
        }

        $t = time();

        $minutesPassedSinceLogin = ($t - $iat) / 60; // divided by 60 to get minutes

        error_log("minutes passed is " . $minutesPassedSinceLogin);

        if ($minutesPassedSinceLogin > $jwtExpirationInterval) {
            return false;
        }

        return true;
    }
}
