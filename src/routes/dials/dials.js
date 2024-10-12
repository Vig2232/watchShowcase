const route = require('express').Router();
const { authorize } = require('../../middleware/auth')
const dialControllers = require('../../controllers/dials/dial')
const { imageUpload } = require('../../middleware/upload');
const { User_roles } = require('../../../config.json');

route.route('/:dial_id?')
    .post(authorize([User_roles.Admin]), imageUpload().single('dialImage'), dialControllers.create)
    .put(authorize([User_roles.Admin]), imageUpload().single('dialImage'), dialControllers.update)
    .get(authorize([User_roles.Admin, User_roles.User]), dialControllers.getDial)
module.exports = route;