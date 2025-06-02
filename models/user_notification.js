module.exports = (sequelize, Sequelize) => {
	const Notification = sequelize.define('user_notification', {
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
		created_at: { //알림 생성된 시각 ( 알림 정렬을 위해)
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW //현재 시각 저장
		}
	}, {
		timestamps: false,
		tableName: 'user_notification'
	});

	return Notification;
};


