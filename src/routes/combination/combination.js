const route = require('express').Router();
const { authorize } = require('../../middleware/auth');
const { imageUpload } = require('../../middleware/upload');
const combinationController = require('../../controllers/combination/combination')
const { User_roles } = require('../../../config.json');

route.route('/:id?')
    .post(authorize([User_roles.Admin]), imageUpload().array('images', 6), combinationController.create)
    .put(authorize([User_roles.Admin]), imageUpload().array('images', 6), combinationController.update)
    .get(authorize([User_roles.Admin, User_roles.User]), combinationController.getCombination)
module.exports = route;