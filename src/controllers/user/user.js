const { createPassword, verifyPassword } = require('../../helper/functions')
const { Op } = require('sequelize');
const snakecaseKeys = require('snakecase-keys')
const { deleteImages } = require('../../helper/images');
const { User_roles } = require('../../../config.json')

exports.addUser = async (req, res) => {
    let responce = {
        code: 200,
        status: true,
        message: 'Admin created successfully',
        data: {}
    }
    try {
        const { User } = global.sequelize;
        req.body = snakecaseKeys(req.body);

        let check = await User.findOne({
            where: {
                mobile_number: req.body.mobile_number,
                user_type: req.body.user_type
            }
        })

        if (check) return res.json({ ...responce, status: false, message: 'Admin already exist in this number' })

        let hashedPassword = createPassword(req.body.password)
        let admin = await User.create({ ...req.body, password_hash: hashedPassword.hash, password_salt: hashedPassword.salt, profile_picture: (req?.file?.path) ? req.file.path : "" });

        !admin ? responce.message = 'Admin not created' : false;
        responce.data = admin


    } catch (error) {
        console.log('error', error)
        responce.status = false;
        responce.code = 500;
        responce.message = error.message

    }
    return res.json(responce)
}

exports.logIn = async (req, res) => {
    let responce = {
        code: 200,
        status: true,
        message: 'Admin logged in successfully',
        data: {}
    }
    try {
        const { User } = global.sequelize;
        let { mobile_number, password, user_type } = req.body
        let user = await User.findOne({
            where: {
                mobile_number,
                user_type
            },
            attributes: ['id', 'user_name', 'mobile_number', 'user_type', 'user_access', 'password_hash', 'password_salt']
        })

        if (!user) {
            responce = { ...responce, status: false, message: 'Admin not found' }
            return res.json(responce)
        }

        let passwordCheck = verifyPassword(password, user.password_hash, user.password_salt)

        if (!passwordCheck) {
            responce = { ...responce, code: 400, status: false, message: 'Incorrect password' }
            return res.json(responce)
        }

        responce.data = {
            token: user.token(
                JSON.parse(JSON.stringify(user))
            )
        }

    } catch (error) {
        console.log('error', error)
        responce = { ...responce, code: 500, status: false, message: error.message }
    }
    return res.json(responce)
}

exports.getUser = async (req, res) => {
    let responce = {
        code: 200,
        status: true,
        message: 'Admin fetched successfully',
        data: {}
    }
    try {
        const { User } = global.sequelize;
        let { search, page = 1, limit = 10 } = req.query
        let { mobileNumber } = req.params

        let query = { offset: (page - 1) * limit, limit: Number(limit) };

        mobileNumber ? query = { where: { mobile_number: mobileNumber } } : search ? query.where = { user_name: { [Op.regexp]: `^${search}` }, is_deleted: false } : req?.user_type === User_roles.User ? query.where = { is_deleted: false, user_type: req?.user_type } : false;

        let data = await User.findAll({ ...query });

        if (!data.length) return res.json({ ...responce, status: false, code: 400, message: 'Admin Not found', data: [] });

        responce = { ...responce, data: mobileNumber ? data[0] : data };

    } catch (error) {
        console.log('error', error)
        responce = { ...responce, code: 500, status: false, message: error.message }
        return res.status(responce.code).json(responce)
    }
    return res.json(responce)
}

exports.updateUser = async (req, res) => {
    let responce = {
        code: 200,
        status: true,
        message: 'Admin updated successfully',
        data: {}
    }
    try {
        const { User } = global.sequelize;
        let { mobileNumber } = req.params;
        req.body = snakecaseKeys(req.body);

        let imgData = await User.findOne({ where: { mobile_number: mobileNumber }, attributes: ['profile_picture', 'id'] });

        deleteImages([imgData?.id ? imgData.profile_picture : req?.file?.page]);

        if (!imgData?.id) return res.status(responce.code).json({ ...responce, code: 400, status: false, message: 'Admin not found' });

        if (req?.file?.path)
            req.body.profile_picture = req.file.path;

        let data = await User.update({ ...req.body, deleted_by: req.userId }, { where: { mobile_number: mobileNumber } });

        !data ? responce.message = 'Admin not created' : false;

    } catch (error) {
        console.log('error', error)
        responce = { ...responce, code: 500, status: false, message: error.message }
        return res.status(responce.code).json(responce)
    }
    return res.json(responce)
}