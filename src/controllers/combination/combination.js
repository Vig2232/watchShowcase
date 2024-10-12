const snakecaseKeys = require('snakecase-keys')
const { deleteImages } = require('../../helper/images');

exports.create = async (req, res) => {
    let responce = {
        code: 200,
        status: true,
        message: 'Dial with strap created successfully',
        data: {}
    };
    try {
        const { combination } = global.sequelize;
        req.body = snakecaseKeys(req.body);

        let check = await combination.findOne({ where: { ...req.body } });

        if (check)
            return res.status(responce.code).json({ ...responce, status: false, message: 'Data already exist' });

        req?.files?.length ? req.body.image_urls = req.files.map(img => img.path) : false;

        let data = await combination.create({ ...req.body, created_by: req.userId });

        if (!data)
            return res.status(responce.code).json({ ...responce, status: false, message: 'Data not created' });

        responce = { ...responce, data };

    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error, code: 500 };
    }
    return res.status(responce.code).json(responce)
}

exports.update = async (req, res) => {
    let responce = { code: 200, status: true, message: 'Combination updated successfully', data: {} };
    try {
        const { combination } = global.sequelize;

        req.body = snakecaseKeys(req.body);

        let imgData = await combination.findOne({ where: { id: req?.params?.id }, attributes: ['id', 'image_urls'] });

        deleteImages(imgData?.id ? imgData.image_urls.filter(item => !JSON.parse(req?.body?.image_urls).includes(item)) : req?.files.map(img => img.path));

        if (!imgData?.id) return res.json({ ...responce, status: false, message: 'Combination not found' });

        let img = [...req?.files.map(img => img.path)];

        req?.body?.image_urls ? img.push(...JSON.parse(req?.body?.image_urls)) : false;

        req.body.image_urls = img;

        let data = await combination.update({ ...req.body }, { where: { id: req?.params?.id } });

        if (!data) return res.json({ ...responce, status: false, message: 'Combination not updated' });


    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error.message, code: 500 };
    }
    return res.json(responce)
};

exports.getCombination = async (req, res) => {
    let responce = { code: 200, status: true, message: 'Strps fetched successfully', data: {} };

    try {
        const { combination } = global.sequelize;
        let { id } = req.params;

        let { page = 1, limit = 10 } = req.query;

        let ids = ["strap_id", "dial_id", "watch_id", "chrono_case_id", "movement_id", "bezel_id", "hands_id", "seconds_id", "crowns_id", "caseback_id"];

        let query = { where: {}, limit: Number(limit), offset: Number((page - 1) * limit) };

        ids.forEach(id => {
            req.query[id] ? query.where[id] = req.query[id] : false;
        })

        let data = await combination.findAll({ ...query });

        responce = { ...responce, data: id ? data[0] : data };

    } catch (error) {
        console.log('error', error);
        responce = { ...responce, status: false, message: error.message, code: 500 };
    }
    return res.json(responce)
}

