#!/bin/bash

psql -U notificator notifications -c "DELETE FROM user_groups WHERE group_name like 'test-%';"
psql -U notificator notifications -c "DELETE FROM account WHERE external_id like 'test-%';"
