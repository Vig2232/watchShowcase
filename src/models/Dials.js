module.exports = (sequelize, DataTypes) => {
    const Dials = sequelize.define(
        'Dials',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            price: {
                type: DataTypes.FLOAT,
                defaultValue: 0
            },
            image_url: {
                type: DataTypes.STRING
            },
            watch_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            is_available: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
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
            }
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'Dials',
        }
    );
    Dials.associate = (model) => {
        Dials.belongsTo(model.Watch, {
            foreignKey: 'watch_id',
            sourceKey: 'id',
            as: 'dials_watch_id'
        });
        Dials.belongsTo(model.User, {
            foreignKey: 'created_by',
            sourceKey: 'id',
            as: 'dials_created_by'
        });
        Dials.hasMany(model.Combination, {
            foreignKey: 'dial_id',
            sourceKey: 'id',
            as: 'dial_x_dial_id'
        });
    }
    return Dials;
}