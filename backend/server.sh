#!/bin/sh
export FLASK_APP=app.py
export FLASK_ENV=dev
export FLASK_DEBUG=1
/usr/bin/python3 -m flask run