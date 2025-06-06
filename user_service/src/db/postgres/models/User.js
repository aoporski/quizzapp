module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sub: {
        // dawniej: keycloakId
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      preferred_username: {
        // dawniej: username
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      firstName: {
        // dawniej: name
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        // dawniej: surname
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'isverified',
      },
      isBanned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'isbanned',
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
        allowNull: false,
      },
    },
    {
      tableName: 'Users',
    }
  );

  return User;
};
