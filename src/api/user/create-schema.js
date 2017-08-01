const koaJoiBouncer = require('koa-joi-bouncer');
const Joi = koaJoiBouncer.Joi;

module.exports = koaJoiBouncer.middleware({
  body: Joi.object().keys({
    external_id: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string(),
    sms: Joi.string(),
    voice: Joi.string(),
    delivery: Joi.array().items(Joi.string()),
    language: Joi.string(),
    timezone: Joi.string(),
    active: Joi.boolean(),
    groups: Joi.array().items(Joi.string()),
  }),
});
