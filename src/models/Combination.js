module.exports = (sequelize, DataTypes) => {
    const Combination = sequelize.define(
        'Combination',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            dial_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            image_urls: {
                type: DataTypes.JSON,
                allowNull: false
            },
            strap_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            watch_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            chrono_case_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            movement_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            bezel_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            hands_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            seconds_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            crowns_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            caseback_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: false
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
            tableName: 'Combination',
        }
    );
    Combination.associate = (model) => {
        Combination.belongsTo(model.Straps, {
            foreignKey: 'strap_id',
            sourceKey: 'id',
            as: 'combination_strap_id'
        });
        Combination.belongsTo(model.Dials, {
            foreignKey: 'dial_id',
            sourceKey: 'id',
            as: 'combination_dial_id'
        });
        Combination.belongsTo(model.Watch, {
            foreignKey: 'watch_id',
            sourceKey: 'id',
            as: 'combination_watch_id'
        });
        Combination.belongsTo(model.Chrono_cases, {
            foreignKey: 'chrono_case_id',
            sourceKey: 'id',
            as: 'combination_chrono_case_id'
        });
        Combination.belongsTo(model.Movement, {
            foreignKey: 'movement_id',
            sourceKey: 'id',
            as: 'combination_movement_id'
        });
        Combination.belongsTo(model.Bezel, {
            foreignKey: 'bezel_id',
            sourceKey: 'id',
            as: 'combination_bezel_id'
        });
        Combination.belongsTo(model.Hands, {
            foreignKey: 'hands_id',
            sourceKey: 'id',
            as: 'combination_hands_id'
        });
        Combination.belongsTo(model.Seconds, {
            foreignKey: 'seconds_id',
            sourceKey: 'id',
            as: 'combination_seconds_id'
        });
        Combination.belongsTo(model.Crowns, {
            foreignKey: 'crowns_id',
            sourceKey: 'id',
            as: 'combination_crowns_id'
        });
        Combination.belongsTo(model.Caseback, {
            foreignKey: 'caseback_id',
            sourceKey: 'id',
            as: 'combination_caseback_id'
        });
    }
    return Combination;
}