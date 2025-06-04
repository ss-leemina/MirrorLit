module.exports = (sequelize, Sequelize) => {
	const UserNotification = sequelize.define('user_notification', {
		notification_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		user_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: "users",
				key: "user_id"
			},
			onDelete: "CASCADE"
		},
		message: Sequelize.TEXT,
		is_checked: {
			type: Sequelize.STRING(5),
			allowNull: false,
			defaultValue: 'N'
		},
	}, {
		timestamps: false,
		tableName: 'user_notification'
	});

	return UserNotification;
};
