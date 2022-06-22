<?php
// The JWT secret
define("JWT_SECRET_KEY", "FDF89F906815206ABB3270BCB808CDAE6F08BE2B07097A76A507650BD456B4BD");

// Server name for comparison of the claim, serves when we want to refresh the tokens ("cookies" on the localStorage)
define("JWT_SERVER_NAME_CLAIM_VALUE", "CUP server v5.3");

// Client value but on the server
define("JWT_CLIENT_NAME_CLAIM_VALUE", "CUP client");

// Claim value on the client
define("JWT_CLIENT_CLAIM_VALUE", "5.4");
