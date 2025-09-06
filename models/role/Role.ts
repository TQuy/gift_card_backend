import { Sequelize, DataTypes } from "sequelize";

export const ROLE_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0
} as const
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const

export default (sequelize: Sequelize) => {
  const Role = sequelize.define(
    "Role",
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
        validate: {
          isIn: [Object.values(USER_ROLES)],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: ROLE_STATUS.ACTIVE,
        validate: {
          isIn: [Object.values(ROLE_STATUS)],
        },
      },
    },
    {
      tableName: "roles",
      timestamps: true,
    }
  );

  return Role;
};

