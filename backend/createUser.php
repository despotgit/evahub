<?php

require "config.php";

//ini_set('display_errors', 1);
//error_reporting(E_ALL);

$email = $_GET["email"];
$username = $_GET["username"];
$password = $_GET["password"];


// sanitize
$username = htmlspecialchars(strip_tags($username));
$email = htmlspecialchars(strip_tags($email));
$password = htmlspecialchars(strip_tags($password));

// hash the password before saving to database
$prehash = crypt($password, SALT);
$password = crypt($password, $prehash);

// insert query
$query = "insert into users set username = '" . $username . "', email = '" . $email . "', password = '" . $password  . "'";


// execute the query, also check if query was successful
if ($connect->query($query)) {
    echo "successfully added a new user";
} else {
    echo "error while adding the new user";
}
