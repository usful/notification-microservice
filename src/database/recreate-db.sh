#!/bin/bash

DATABASE=$1
USER=$2
BASEDIR=$(dirname $0)

dropdb $DATABASE --if-exists &&
createdb -O notificator -E utf8 $DATABASE &&
psql -U $USER -h localhost $DATABASE -f "${BASEDIR}/schema.sql"
