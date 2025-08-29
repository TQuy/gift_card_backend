module.exports = (sequelize, DataTypes) => {
  const GiftCard = sequelize.define('GiftCard', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'brands',
        key: 'id',
      },
    },
    brandName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },
    activationCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senderName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recipientName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recipientEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    recipientPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryType: {
      type: DataTypes.ENUM('personal', 'send_as_gift'),
      allowNull: false,
    },
    deliveryTime: {
      type: DataTypes.ENUM('immediately', 'custom'),
      allowNull: false,
    },
    deliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    period: {
      type: DataTypes.ENUM('morning', 'afternoon', 'evening'),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
      allowNull: false,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'gift_cards',
    timestamps: true,
    createdAt: 'issuedAt',
    updatedAt: 'updatedAt',
  });

  return GiftCard;
};
