
# Development decision notes
- User contact information is directly on the user to decrease project complexity
- Each notification has enabled the type of transport it should use
- verification_status, delivery_type, notification_status are ENUMS on db

# Future features
- GeoJSON, possibly postgis
- Push notifications tokens API, register, unregister, Web hooks for failed deliveries
- Timezones, for now all is handled in utc + 0 or unixtimestamps
- Enforce unique user email, sms... in database


## Postgres commands
pg_ctl -D /usr/local/var/postgres start
pg_ctl -D /usr/local/var/postgres stop

## API

### Ping server
curl -v localhost:8080/api/ping

### User

__Create user__
curl -v -X POST -H "Content-Type: application/json" localhost:8080/api/user -d '{"external_id":"205","name":"Rubens 205", "email":"rubens205@random.com","delivery":["email"],"groups":["group1","group2"]}'

__Get user__
curl -v localhost:8080/api/user/5

__Update user__
curl -v -X PUT -H "Content-Type: application/json" localhost:8080/api/user/3 -d '{"name":"Rubens 55","groups":["group3","group4"]}'

__Delete user__
curl -v -X DELETE -H "Content-Type: application/json" localhost:8080/api/user/5

__Get users by group__
curl -v localhost:8080/api/users/group1

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
curl -v -X POST -H "Content-Type: application/json" localhost:8080/api/notification -d '{"by":["email"],"at":1501027243,"template_id":1,"users":["101", "102"]}'

__Get notification__
curl -v localhost:8080/api/notification/1

__Update notification__
curl -v -X PUT -H "Content-Type: application/json" localhost:8080/api/notification/1 -d '{"by":["email", "sms"],"users":[1, 2]}'

__Delete notification__
curl -v -X DELETE -H "Content-Type: application/json" localhost:8080/api/notification/1

__Get sent notifications__
curl -v localhost:8080/api/notification/sent

__Get unsent notifications__
curl -v localhost:8080/api/notification/unsent

## Postgres queries

__How to query by hour of the day using account's timezone__
... rest of the query
WHERE extract(
  hour FROM current_timestamp
  AT TIME ZONE account.timezone
) = 17
