
# Dependencies
PostgreSQL

# Setup Database

## User and database
createuser --superuser --createrole --inherit --login notificator
createdb -O notificator -E utf8 notifications

# Load schema
psql -U notificator -h localhost notifications -f ../database/schema.sql

# Connect to db from localhost
psql -U notificator notifications
