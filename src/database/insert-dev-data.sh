#!/bin/bash

psql -U notificator -h localhost notifications -f ./dev-data.sql
