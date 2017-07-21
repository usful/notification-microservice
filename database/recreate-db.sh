#!/bin/bash

dropdb notifications &&
createdb -O notificator -E utf8 notifications &&
psql -U notificator -h localhost notifications -f ./schema.sql
