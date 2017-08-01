const koaJoiBouncer = require('koa-joi-bouncer');
const Joi = koaJoiBouncer.Joi;
const constants = require('../../constants');

module.exports = koaJoiBouncer.middleware({
  body: Joi.object().keys({
    by: Joi.array().items(Joi.string().valid(constants.delivery_type)),
    at: Joi.number().integer().required(),
    template_id: Joi.number().integer().required(),
    users: Joi.array().items(Joi.string()),
    required_by: Joi.array().items(Joi.string().valid(constants.delivery_type)),
    data: Joi.object(),
  }),
});
