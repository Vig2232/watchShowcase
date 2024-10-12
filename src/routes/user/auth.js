const route = require('express').Router();
const userController = require('../../controllers/user/user')
const { User_roles } = require('../../../config.json');
const { authorize } = require('../../middleware/auth');
const { imageUpload } = require('../../middleware/upload');

route.route('/:mobileNumber?')
    .post(imageUpload().single('image'), userController.addUser)
    .put(userController.logIn)
    .get(authorize([User_roles.Admin, User_roles.User]), userController.getUser)
    .patch(authorize([User_roles.Admin, User_roles.User]), imageUpload().single('image'), userController.updateUser)

module.exports = route;