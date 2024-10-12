const db = require('./src/models')

exports.init = () => {
    global.sequelize = db;
}