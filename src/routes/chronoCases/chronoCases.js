const route = require('express').Router();
const { authorize } = require('../../middleware/auth')
const chronoCasesControllers = require('../../controllers/chronoCases/chronoCases')

route.route('/')
    .post(authorize, chronoCasesControllers.create)
module.exports = route;