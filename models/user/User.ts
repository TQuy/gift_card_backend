import bcrypt from "bcryptjs";
import { Sequelize, DataTypes, Model } from "sequelize";
import Role, { USER_ROLES } from "../role/Role";
import { UserAttributes, UserCreationAttributes, RoleAttributes } from "./types";

// Define the User model class extending Sequelize Model
class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role_id!: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Optional association property
  public userRole?: RoleAttributes;

  // Instance method to check password
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Instance method to check if user is admin
  public async isAdmin(): Promise<boolean> {
    // If role is already loaded, use it
    if (this.userRole) {
      return this.userRole.name === USER_ROLES.ADMIN;
    }

    // Otherwise, fetch the role
    const RoleModel = this.sequelize!.models.Role;
    const role = await RoleModel.findByPk(this.role_id);
    return (role as any)?.name === USER_ROLES.ADMIN;
  }

  // Static method to define associations
  public static associate(models: any) {
    UserModel.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'userRole',
    });
  }
}

export default function (sequelize: Sequelize) {
  UserModel.init(
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
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      modelName: "User",
      hooks: {
        beforeCreate: async (user: UserModel) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
        beforeUpdate: async (user: UserModel) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
      },
    }
  );

  // Attach the associate method to the model
  (UserModel as any).associate = UserModel.associate;

  return UserModel;
}