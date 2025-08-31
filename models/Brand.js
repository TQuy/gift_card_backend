module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define(
    "Brand",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Singapore",
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "+123 4455 6677 8899",
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "XYZ Limited",
      },
      products: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "brands",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  return Brand;
};
