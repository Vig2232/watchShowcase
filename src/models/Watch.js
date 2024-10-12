module.exports = (sequelize, DataTypes) => {
    const Watch = sequelize.define(
        'Watch',
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
            model: {
                type: DataTypes.STRING,
                allowNull: false
            },
            base_price: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            additional_charges: {
                type: DataTypes.INTEGER,
                defaultValue: 2
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
            tableName: 'Watch',
        }
    );
    Watch.associate = (model) => {
        Watch.belongsTo(model.User, {
            foreignKey: 'created_by',
            sourceKey: 'id',
            as: 'watch_created_by'
        });
        Watch.hasMany(model.Dials, {
            foreignKey: 'watch_id',
            sourceKey: 'id',
            as: 'watch_watch_id'
        })
    }
    return Watch;
}