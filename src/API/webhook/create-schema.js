const koaJoiBouncer = require('koa-joi-bouncer');
const Joi = koaJoiBouncer.Joi;
const constants = require('../../constants');

module.exports = koaJoiBouncer.middleware({
  body: Joi.object().keys({
    url: Joi.string().required(),
    transport: Joi.string().valid(constants.delivery_type).required(),
  }),
});
