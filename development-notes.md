
## Postgres commands
pg_ctl -D /usr/local/var/postgres start
pg_ctl -D /usr/local/var/postgres stop

## API

### User

__Create user__
curl -v -X POST -H "Content-Type: application/json" localhost:8080/api/user -d '{"external_id":1,"name":"Rubens 1", "email":"rubens1@random.com","delivery":["email"]}'

__Get user__
curl -v localhost:8080/api/user/5

__Update user__
curl -v -X PUT -H "Content-Type: application/json" localhost:8080/api/user/5 -d '{"name":"Rubens 55"}'

__Delete user__
curl -v -X DELETE -H "Content-Type: application/json" localhost:8080/api/user/5

### Template

__Create template__
curl -v -X POST -H "Content-Type: application/json" localhost:8080/api/template -d '{"name":"template 1", "email": "string template of email 1"}'

__Get template__
curl -v localhost:8080/api/template/1

__Update template__
curl -v -X PUT -H "Content-Type: application/json" localhost:8080/api/template/1 -d '{"name":"template 1_1", "email": "string template of email 1_1"}'

__Delete template__
curl -v -X DELETE -H "Content-Type: application/json" localhost:8080/api/template/1

### Notification

// Now + one day in seconds
Math.floor((Date.now() / 1000) + 86400);

__Create notification__
curl -v -X POST -H "Content-Type: application/json" localhost:8080/api/notification -d '{"by":["email"],"at":1500659152,"template_id":1,"users":[234234]}'

__Get notification__
curl -v localhost:8080/api/notification/1

__Update notification__
curl -v -X PUT -H "Content-Type: application/json" localhost:8080/api/notification/1 -d '{"by":["email", "sms"]}'

__Delete notification__
curl -v -X DELETE -H "Content-Type: application/json" localhost:8080/api/notification/1

__Get sent notifications__
curl -v localhost:8080/api/notification/sent

## Postgres queries

__How to query by hour of the day using account's timezone__
... rest of the query
WHERE extract(
  hour FROM current_timestamp
  AT TIME ZONE account.timezone
) = 17
