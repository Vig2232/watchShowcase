const router = require('express').Router();
const userRoutes = require('./user/auth');
const watchRoutes = require('./watch/watch');
const strapsRoutes = require('./straps/straps');
const dialsRoutes = require('./dials/dials');
const chronoCasesRoutes = require('./chronoCases/chronoCases');
const combinationRoutes = require('./combination/combination')

router.use('/user', userRoutes);
router.use('/watch', watchRoutes);
router.use('/straps', strapsRoutes);
router.use('/dials', dialsRoutes);
router.use('/chronoCases', chronoCasesRoutes);
router.use('/dialXStrap', combinationRoutes)

module.exports = router;