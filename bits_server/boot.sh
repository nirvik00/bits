#!/bin/sh
exec gunicorn -b :3200 server:app


