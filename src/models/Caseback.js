module.exports = (sequelize, DataTypes) => {
    const Caseback = sequelize.define(
        'Caseback',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING
            },
            price: {
                type: DataTypes.INTEGER
            },
            watch_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            image_url: {
                type: DataTypes.STRING
            },
            created_by: {
                type: DataTypes.INTEGER,
            },
            is_available: {
                type: DataTypes.BOOLEAN
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
            tableName: 'Caseback',
        }
    );
    Caseback.associate = (model) => {
        Caseback.belongsTo(model.Watch, {
            foreignKey: 'watch_id',
            sourceKey: 'id',
            as: 'caseback_watch_id'
        });
        Caseback.belongsTo(model.User, {
            foreignKey: 'created_by',
            sourceKey: 'id',
            as: 'caseback_created_by'
        });
    }
    return Caseback;
}