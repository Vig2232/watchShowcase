const jwt = require('jsonwebtoken');
const config = require('../../config.json')
const func = require('../helper/functions')
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            user_name: {
                type: DataTypes.STRING
            },
            profile_picture: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            mobile_number: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password_hash: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password_salt: {
                type: DataTypes.STRING,
                allowNull: false
            },
            user_type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            user_access: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            deleted_at: {
                type: DataTypes.DATE,
            },
            deleted_by: {
                type: DataTypes.INTEGER,
            },
            profile_picture: {
                type: DataTypes.STRING,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'User',
        }
    );

    User.prototype.token = (user) => {
        const timeDifferenceSeconds = func.expireSeconds()

        const jwtToken = jwt.sign(
            {
                id: user.id,
                user_name: user.user_name,
                email: user.email,
                mobile_number: user.mobile_number,
                user_type: user.user_type,

            },
            config.Token_secret,
            {
                algorithm: 'HS256',
                expiresIn: timeDifferenceSeconds
            }
        )
        return jwtToken;
    }
    return User;
}