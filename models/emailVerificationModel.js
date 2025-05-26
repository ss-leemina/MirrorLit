module.exports = (sequelize, Sequelize) => {
  const EmailVerification = sequelize.define("EmailVerification", {
    verification_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    verified: {
      type: Sequelize.STRING(5),
      allowNull: false,
      defaultValue: 'N'
    },
    code: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    sent_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    verified_at: {
      type: Sequelize.DATE,
      allowNull: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'email_verifications',
    timestamps: false 
  });

  EmailVerification.associate = (models) => {
    EmailVerification.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE"
    });
  };

  return EmailVerification;
};
