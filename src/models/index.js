const Sequelize = require("sequelize");
const path = require("path");
const fs = require("fs");
const { Data_base } = require("../../config.json");

const baseName = path.basename(__filename);

let db = {};

let sequelize = new Sequelize(
  Data_base.Data_base,
  Data_base.User_name,
  Data_base.Password,
  {
    host: Data_base.host,
    dialect: "mysql",
    logging: false,
  }
);

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== baseName && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );

    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Perform connection check
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Synchronize the model with the database
    await sequelize.sync({ alter: true, force: false });

    // // Close the connection when done
    // await sequelize.close();
    // console.log('Connection closed.');
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
