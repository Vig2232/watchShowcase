const route = require('express').Router();
const { authorize } = require('../../middleware/auth');
const strapsControllers = require('../../controllers/straps/straps');
const { imageUpload } = require('../../middleware/upload');
const { User_roles } = require('../../../config.json');

route.route('/:strap_id?')
    .post(authorize([User_roles.Admin]), imageUpload().single('strapImage'), strapsControllers.create)
    .put(authorize([User_roles.Admin]), imageUpload().single('strapImage'), strapsControllers.update)
    .get(authorize([User_roles.User, User_roles.Admin]), strapsControllers.getStraps)
module.exports = route;