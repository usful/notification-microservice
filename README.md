# Notification Microservice
__A micro-service for sending notifications 😎🔥😎!__

Have you tried to implement __push notifications, sms, voice or email services__ in your server/app 😮?   
Is it a __hassle__ 😵?   
How do __handle errors__ 😰?   
What do you do when you need to __escalate into sending thousands of notifications__ 😳?   
__Which service__ should you use 🤔?

Take all those boring and painful tasks, planning and decisions and throw them away! We already walked that road and we don't want you to lose your time on this so you can focus on making the good bucks 💰💰, going to the gym 🏋🏼‍ and get a beer 🍺.

## Ok you got me! how does it works?

We basically abstracted all those services' APIs into a super simple to use server-to-server API!

![GitHub Logo](/docs/img/black-box.png)

And thats it!

__The workflow basics__ (using push notifications as example):

- Create a notification template, for example the welcome push notification for all users where "username" and some other info will be replace for each different user.

- When a user logs in or register to your app send it also to the notification server along with the username and id for future usage.

- Whenever you main server wants it can create notifications to multiple users by id, or by groups also filtering by tags!

- You can register webhooks so your main app knows when the notifications were sent successfully, if there where errors or some user token doesn't work anymore.

## Awesome give me an example!

You got it bro, lets curl!

__Create an user__
```
curl -v -X POST \
-H "Content-Type: application/json" \
localhost:8080/api/user \
-d '{"external_id":"205","name":"Rubens 205", "email":"ruben@random.com","delivery":["email"],"groups":["group1","group2"]}'
```
Here we are telling the notification server to create an user with an id `205`, activate email delivery and add it to some groups.

__Create a template__
```
curl -v -X POST \
-H "Content-Type: application/json" \ localhost:8080/api/template \
-d '{"name":"test-template-1","email":{"subject":"hello <%= data.username %>","text":"<title>This is html content</title><body>and here is a number <%= data.num %> cheers!</body>"}}'  
```
Here we are creating a template for emails with name `test-template-1` in `ejs` with placeholder that will be replaced with data from the user or data from the notification itself.

__Create notification__
```
curl -v -X POST -H \
"Content-Type: application/json" \
localhost:8080/api/notification \
-d'{"by":["email"],"at":1503599342,"template_id":1,"users":["user-1"],"required_by":["email"],"data":{"num":30}}'
```
Here we are creating the notification with a sending date, specific user and some data in it.


__You just sent a notification to your first user 😎🔥!__

## Wanna set it up? Its easy!

### Setup your PostgreSQL database, could be local, AWS, etc..

- Create a super user called "notificator"
- Run the sh script in src/database/setup.sh, this will create the "notifications" database with the correct schema

### Clone this repo

- Run `npm install` on this repo's folder
- Create a copy of the file `env/.env.example` with the name `env/.env.production` to setup all your keys.

### Running it for production
- ...   


...   
Error levels of winstons
error, warn, info, verbose, debug, silly


...   
JavaScript Library on its way

# Under construction ... 🚧👾💪🏽
