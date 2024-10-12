const { Op } = require('sequelize');
const snakecaseKeys = require('snakecase-keys');

exports.create = async (req, res) => {
    let responce = {
        code: 200,
        status: true,
        message: 'Watch created successfully',
        data: {}
    };
    try {
        const { Watch } = global.sequelize;
        req.body = snakecaseKeys(req.body);

        let check = await Watch.findOne({ where: { model: req.body.model } });
        if (check)
            return res.status(responce.code).json({ ...responce, status: false, message: 'Watch already exist' });

        let data = await Watch.create({ ...req.body, created_by: req.userId });
        if (!data)
            return res.status(responce.code).json({ ...responce, status: false, message: 'Watch not created' });

        responce = { ...responce, data };

    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error, code: 500 };
    }
    return res.json(responce)
}

exports.update = async (req, res) => {
    let responce = { code: 200, status: true, message: 'Watch created successfully', data: {} };
    try {
        const { Watch } = global.sequelize;
        req.body = snakecaseKeys(req.body);

        let data = await Watch.update({ ...req.body }, { where: { id: req?.params?.watch_id } });
        if (!data) return res.status(responce.code).json({ ...responce, status: false, message: 'Watch not created' });

    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error, code: 500 };
    }
    return res.json(responce)
}

exports.getWatch = async (req, res) => {
    let responce = { code: 200, status: true, message: 'Watch fetched successfully', data: {} };
    try {
        const { Watch, Dials, Combination } = global.sequelize;
        let { watch_id: id } = req.params;
        let { page = 1, limit = 10, search, available = true } = req.query;

        let query = {
            where: { is_available: available },
            include: [
                {
                    model: Dials,
                    as: 'watch_watch_id',
                    limit: 1,
                    is_available: true,
                    attributes: ['price'],
                    include: [{
                        model: Combination,
                        as: 'dial_x_dial_id',
                        limit: 1,
                        attributes: ['image_urls'],
                    }]
                }
            ]
        }

        id ? query.where = { is_available: available, id } :
            search ? query = { ...query, where: { is_available: available, [Op.or]: [{ name: { [Op.regexp]: `^${search}` } }, { model: { [Op.regexp]: `^${search}` } }] }, limit: Number(limit), offset: Number((page - 1) * limit) }
                : query = { ...query, limit: Number(limit), offset: Number((page - 1) * limit) };

        let data = await Watch.findAll({ ...query });
        if (!data.length) return res.status(responce.code).json({ ...responce, status: false, message: 'Watch not found' });

        data = JSON.parse(JSON.stringify(data)).map(obj => {
            let correctedObj = { ...obj, images: obj?.watch_watch_id[0]?.dial_x_dial_id[0]?.image_urls };
            delete correctedObj.watch_watch_id;
            return correctedObj;
        });
        responce = { ...responce, data: id ? data[0] : data };

    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error.message, code: 500 };
    }
    return res.json(responce)

}

exports.estimate = async (req, res) => {
    let responce = { code: 200, status: true, message: 'Watch fetched successfully', data: {} };
    try {
        let { watch_id, dial_id, strap_id } = req.body;
        let { Watch, Dials, combination, Straps } = global.sequelize;

        let data = await Watch.findOne({
            where: {
                id: watch_id
            },
            attributes: ['base_price'],
            is_available: true,
            include: [
                {
                    model: Dials,
                    as: 'watch_watch_id',
                    where: { id: dial_id },
                    limit: 1,
                    is_available: true,
                    attributes: ['price'],
                    include: [
                        {
                            model: combination,
                            as: 'dial_x_dial_id',
                            limit: 1,
                            attributes: ['id'],
                            include: [
                                {
                                    model: Straps,
                                    where: { id: strap_id },
                                    as: 'dial_x_strap_strap_id',
                                    attributes: ['price']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!data) return res.json({ ...responce, message: 'Data not found' });
        responce.data = JSON.parse(JSON.stringify(data));
        delete responce.data.watch_watch_id;
    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error, code: 500 };
    }
    return res.status(responce.code).json(responce)
}