const simplecrypt = require("simplecrypt");

const settings = process.env.NODE_ENV === "production" ? require("../../settings") : require("../../settings-dev");

const sc = simplecrypt({
  password: settings.secret,
  salt: "10",
});

module.exports = (sequelize, DataTypes) => {
  const DataRequest = sequelize.define("DataRequest", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dataset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
        model: "Dataset",
        key: "id",
        onDelete: "cascade",
      },
    },
    method: {
      type: DataTypes.STRING,
    },
    route: {
      type: DataTypes.TEXT,
    },
    headers: {
      type: DataTypes.TEXT,
      set(val) {
        return this.setDataValue("headers", sc.encrypt(JSON.stringify(val)));
      },
      get() {
        try {
          return JSON.parse(sc.decrypt(this.getDataValue("headers")));
        } catch (e) {
          return this.getDataValue("headers");
        }
      }
    },
    body: {
      type: DataTypes.TEXT,
      set(val) {
        return this.setDataValue("body", sc.encrypt(val));
      },
      get() {
        try {
          return sc.decrypt(this.getDataValue("body"));
        } catch (e) {
          return this.getDataValue("body");
        }
      }
    },
    useGlobalHeaders: {
      type: DataTypes.BOOLEAN,
      required: true,
      defaultValue: true,
    },
    query: {
      type: DataTypes.TEXT,
    },
    pagination: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    items: {
      type: DataTypes.STRING,
      defaultValue: "items",
    },
    itemsLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    offset: {
      type: DataTypes.STRING,
      defaultValue: "offset",
    },
  }, {
    freezeTableName: true,
  });

  DataRequest.associate = (models) => {
    models.DataRequest.belongsTo(models.Dataset, { foreignKey: "dataset_id" });
  };

  return DataRequest;
};
