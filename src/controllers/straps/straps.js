const { Op } = require('sequelize')
const snakecaseKeys = require('snakecase-keys')
const { deleteImages } = require('../../helper/images');

exports.create = async (req, res) => {
    let responce = {
        code: 200,
        status: true,
        message: 'Strap created successfully',
        data: {}
    };
    try {
        const { Straps } = global.sequelize;
        req.body = snakecaseKeys(req.body)

        let check = await Straps.findOne({ where: { name: { [Op.regexp]: `^${req.body.name}` } } });
        if (check)
            return res.json({ ...responce, status: false, message: 'Strap already exist' });

        req.body = { ...req.body, image_url: (req?.file?.path) ? req?.file?.path : "" }

        let data = await Straps.create({ ...req.body, created_by: req.userId });
        if (!data)
            return res.json({ ...responce, status: false, message: 'Strap not created' });

        responce = { ...responce, data };

    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error.message, code: 500 };
    }
    return res.json(responce)
}

exports.update = async (req, res) => {
    let responce = { code: 200, status: true, message: 'Straps updated successfully', data: {} };
    try {
        const { Straps } = global.sequelize;

        req.body = snakecaseKeys(req.body);

        let imgData = await Straps.findOne({ where: { id: req?.params?.strap_id }, attributes: ['image_url', 'id'] });

        deleteImages([imgData?.id ? imgData.image_url : req?.file?.path]);

        if (!imgData?.id) return res.json({ ...responce, status: false, message: 'Straps not found' });

        req?.file?.path ? req.body.image_url = req.file.path : false;

        let data = await Straps.update({ ...req.body }, { where: { id: req?.params?.strap_id } });
        console.log('data', data)
        if (!data) return res.json({ ...responce, status: false, message: 'Straps not updated' });
    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error.message, code: 500 };
    }
    return res.json(responce)
}

exports.getStraps = async (req, res) => {
    let responce = { code: 200, status: true, message: 'Strps fetched successfully', data: {} };

    try {
        const { Straps } = global.sequelize;

        let { page = 1, limit = 10, search, watch_id, available = true } = req.query;

        let { strap_id } = req.params;

        let query = { limit: Number(limit), offset: Number((page - 1) * limit) };

        strap_id ? query = { where: { id: strap_id } } : watch_id ? query.where = { watch_id } : search ? query.where = { is_available: available, name: { [Op.regexp]: `^${search}` } } : query.where = { is_available: available };

        let data = await Straps.findAll({ ...query });

        responce = { ...responce, data };

    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error.message, code: 500 };
    }
    return res.json(responce)
}