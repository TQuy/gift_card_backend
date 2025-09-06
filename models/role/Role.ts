import { Sequelize, DataTypes, Model } from "sequelize";
import { RoleAttributes, RoleCreationAttributes } from "./types";

export const ROLE_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const

// Define the Role model class extending Sequelize Model
class RoleModel
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public status!: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Static property for constants
  public static readonly ROLE_STATUS = ROLE_STATUS;
  public static readonly USER_ROLES = USER_ROLES;
}

export default function (sequelize: Sequelize) {
  RoleModel.init(
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
      sequelize,
      tableName: "roles",
      timestamps: true,
      modelName: "Role",
    }
  );

  return RoleModel;
};

