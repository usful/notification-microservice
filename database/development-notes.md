
## Postgres commands
pg_ctl -D /usr/local/var/postgres start
pg_ctl -D /usr/local/var/postgres stop

## API

__Create user__
curl -X POST -H "Content-Type: application/json" localhost:8080/api/user/create -d '{"external_id":1,"name":"Rubens 1", "email":"rubens1@random.com","delivery":["email"]}'

__Get user__
curl localhost:8080/api/user/5

__Update user__
curl -X PUT -H "Content-Type: application/json" localhost:8080/api/user/5 -d '{"name":"Rubens 55"}'

## Postgres queries

__How to query by hour of the day using account's timezone__
... rest of the query
WHERE extract(
  hour FROM current_timestamp
  AT TIME ZONE account.timezone
) = 17
