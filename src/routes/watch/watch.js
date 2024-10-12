const route = require('express').Router();
const { authorize } = require('../../middleware/auth');
const watchControllers = require('../../controllers/watch/watch');
const { User_roles } = require('../../../config.json');

route.route('/:watch_id?')
    .post(authorize([User_roles.Admin]), watchControllers.create)
    .put(authorize([User_roles.Admin]), watchControllers.update)
    .get(authorize([User_roles.Admin, User_roles.User]), watchControllers.getWatch)
module.exports = route;