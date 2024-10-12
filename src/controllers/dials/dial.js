const { Op } = require('sequelize')
const snakecaseKeys = require('snakecase-keys');
const { deleteImages } = require('../../helper/images');

exports.create = async (req, res) => {
    let responce = {
        code: 200,
        status: true,
        message: 'Dial created successfully',
        data: {}
    };
    try {
        const { Dials } = global.sequelize;

        req.body = snakecaseKeys(req.body)

        let check = await Dials.findOne({ where: { name: { [Op.regexp]: `^${req.body.name}` } } });

        if (check) return res.json({ ...responce, status: false, message: 'Dials already exist' });

        req.body = { ...req.body, image_url: (req?.file?.path) ? req?.file?.path : "" }

        let data = await Dials.create({ ...req.body, created_by: req.userId });

        if (!data) return res.json({ ...responce, status: false, message: 'Dials not created' });

        responce = { ...responce, data };

    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error.message, code: 500 };
    }
    return res.json(responce)
}

exports.update = async (req, res) => {
    let responce = { code: 200, status: true, message: 'Dial updated successfully', data: {} };
    try {
        const { Dials } = global.sequelize;

        req.body = snakecaseKeys(req.body);

        let imgData = await Dials.findOne({ where: { id: req?.params?.dial_id }, attributes: ['image_url', 'id'] });

        deleteImages([imgData?.id ? imgData.image_url : req?.file?.path]);

        if (!imgData?.id) return res.json({ ...responce, status: false, message: 'Dials not found' });

        req?.file?.path ? req.body.image_url = req.file.path : false;

        let data = await Dials.update({ ...req.body }, { where: { id: req?.params?.dial_id } });

        if (!data) return res.json({ ...responce, status: false, message: 'Dials not updated' });

    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error.message, code: 500 };
    }
    return res.json(responce)
}

exports.getDial = async (req, res) => {
    let responce = { code: 200, status: true, message: 'Dial fetched successfully', data: {} };

    try {
        const { Dials } = global.sequelize;

        let { page = 1, limit = 10, search, watch_id, available = true } = req.query;

        let { dial_id } = req.params;

        let query = { limit: Number(limit), offset: Number((page - 1) * limit) };

        dial_id ? query = { where: { id: dial_id } } : watch_id ? query.where = { watch_id } : search ? query.where = { is_available: available, name: { [Op.regexp]: `^${search}` } } : query.where = { is_available: available };

        let data = await Dials.findAll({ ...query });

        responce = { ...responce, data: dial_id ? data[0] : data };

    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error.message, code: 500 };
    }
    return res.json(responce)
}