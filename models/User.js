const bcrypt = require("bcryptjs");

const USER_ROLES = { ADMIN: 1, USER: 2 };

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //   len: [6, 255],
        // },
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: USER_ROLES.USER,
        validate: {
          isIn: [Object.values(USER_ROLES)],
        },
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
      },
    }
  );

  // Instance method to check password
  User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Instance method to get role name
  User.prototype.getRoleName = function () {
    const roleNames = Object.keys(USER_ROLES);
    return (
      roleNames.find((name) => USER_ROLES[name] === this.role) || "UNKNOWN"
    );
  };

  // Static method to check if user is admin
  User.prototype.isAdmin = function () {
    return this.role === USER_ROLES.ADMIN;
  };

  // Add constants to model
  User.USER_ROLES = USER_ROLES;

  return User;
};
