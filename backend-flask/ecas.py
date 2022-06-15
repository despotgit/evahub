import os
import time

import jwt
import requests
from cas import CASClient
from flask import (Blueprint, Flask, Response, current_app, json, redirect,
                   request, send_from_directory, session, url_for)

import config
from auth import authenticateJwt
from db_revoked_tokens_broker import addRevokedToken, getAllUserRevokedTokensDb
from db_users_broker import addDbUser, getDbUser

ecas = Blueprint("ecas", __name__)


@ecas.route("/seta")
def seta(method=["GET"]):
    if config.FLASK_ENV == "dev":
        root = "http://localhost:4200/"
    else:
        root = config.TARGET_PATH + "/"

    if "username" in session:
        iat = time.time()
        payload = {
            "user": session["user_attributes"],
            "iat": iat,
            "iss": "SETA Flask server",
            "sub": session["username"],
        }

        jawt = jwt.encode(payload, current_app.secret_key, algorithm="HS256")

        return redirect(root + "seta-ui/#/home?accessToken=" + jawt)

    return redirect(root + "seta-ui/#/home")


@ecas.route("/login")
def login():
    if "username" in session:
        # Already logged in

        attributes = session["user_attributes"]
        if not getDbUser(attributes["uid"]):
            addDbUser(attributes)

        return redirect(url_for("ecas.seta"))

    # next = request.args.get("next")
    ticket = request.args.get("ticket")
    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        cas_login_url = current_app.cas_client.get_login_url()
        current_app.logger.debug("CAS login URL: %s", cas_login_url)
        return redirect(cas_login_url)

    # There is a ticket, the request come from CAS as callback.
    # need call `verify_ticket()` to validate ticket and get user profile.
    current_app.logger.debug("ticket from CAS is: %s", ticket)
    # current_app.logger.debug("next is: %s", next)

    user, attributes, pgtiou = current_app.cas_client.verify_ticket(ticket)

    current_app.logger.debug(
        "CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s",
        user,
        attributes,
        pgtiou,
    )

    if not user:
        return 'Failed to verify ticket. <a href="/login">Login</a>'
    else:  # Login successful, redirect according to `next` query parameter.

        if not getDbUser(attributes["uid"]):
            addDbUser(attributes)
        session["username"] = user
        session["user_attributes"] = attributes
        r5 = redirect(url_for("ecas.seta"))
        return r5


@ecas.route("/logout-ecas")
def logoutEcas():
    redirect_url = url_for("ecas.logoutCallback", _external=True)
    cas_logout_url = current_app.cas_client.get_logout_url(redirect_url)
    current_app.logger.debug("CAS logout URL: %s", cas_logout_url)

    return redirect(cas_logout_url)


@ecas.route("/logout", methods=["POST"])
def logout():

    req = json.loads(request.data.decode("UTF-8"))

    # If request is valid and authorized, also revoke the token for future access, before its 
    # normal expiry moment. Revoke by adding it to the MongoDB collection of revoked tokens:
    if authenticateJwt(req["username"]):
        addRevokedToken(req["username"], req["jwt"], str(time.time()))
    
    session.pop("username", None)

    response = json.jsonify({"status": "ok"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@ecas.route("/logoutCallback")
def logoutCallback():
    session.pop("username", None)
    return redirect(url_for("ecas.seta"))

@ecas.route("/revoked-tokens/all")
def getAllRevokedTokens():

    tokens = getAllUserRevokedTokensDb()

    response = json.jsonify({"tokens": tokens, "status": "ok"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


