import bcrypt from "bcryptjs";
import { Sequelize, DataTypes } from "sequelize";
import { USER_ROLES } from "@/config/constants";

export default (sequelize: Sequelize): any => {
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
        beforeCreate: async (user: any) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
        beforeUpdate: async (user: any) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
      },
    }
  );

  // Instance method to check password
  (User.prototype as any).comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Instance method to get role name
  (User.prototype as any).getRoleName = function (): string {
    const roleNames = Object.keys(USER_ROLES) as Array<keyof typeof USER_ROLES>;
    return (
      roleNames.find((name) => USER_ROLES[name] === this.role) || "UNKNOWN"
    );
  };

  // Static method to check if user is admin
  (User.prototype as any).isAdmin = function (): boolean {
    return this.role === USER_ROLES.ADMIN;
  };

  // Add constants to model
  (User as any).USER_ROLES = USER_ROLES;

  return User;
};
