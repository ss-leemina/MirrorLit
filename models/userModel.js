module.exports =  (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      registerDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      level_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      email_verified: {
        type: Sequelize.ENUM("Y", "N"),
        allowNull: false,
        defaultValue: "N",
      },
      // passport-local-sequelize 용 해시/솔트 필드
      myhash: Sequelize.STRING,
      mysalt: Sequelize.STRING,
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  return User;
};