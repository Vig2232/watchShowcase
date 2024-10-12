const { Op } = require('sequelize')
exports.create = async (req, res) => {
    let responce = {
        code: 200,
        status: true,
        message: 'Hook created successfully',
        data: {}
    };
    try {
        const { chrono_cases } = global.sequelize;
        let check = await chrono_cases.findOne({ where: { name: { [Op.regexp]: `^${req.body.name}` } } });
        if (check) {
            responce = { ...responce, status: false, message: 'Hook already exist' };
            return res.json(responce);
        }
        req.body = { ...req.body, image_url: (req?.file?.path) ? req?.file?.path : "" }

        let data = await chrono_cases.create({ ...req.body });
        if (!data) {
            responce = { ...responce, status: false, message: 'Hook not created' };
            return res.json(responce);
        }
        responce = { ...responce, data };

    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error, code: 500 };
    }
    return res.json(responce)
}