module.exports = (sequelize, DataTypes) => {
    const Straps = sequelize.define(
        'Straps',
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
            tableName: 'Straps',
        }
    );
    Straps.associate = (model) => {
        Straps.belongsTo(model.Watch, {
            foreignKey: 'watch_id',
            sourceKey: 'id',
            as: 'straps_watch_id'
        });
        Straps.belongsTo(model.User, {
            foreignKey: 'created_by',
            sourceKey: 'id',
            as: 'straps_created_by'
        });
    }
    return Straps;
}