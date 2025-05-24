module.exports = (sequelize, Sequelize) => {
	const UserRank = sequelize.define('user_rank', {
		rank_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		rank_name: {
			type: Sequelize.STRING(10),
			allowNull: false,
			unique: true
		},
		promotion_comments: Sequelize.INTEGER,
		promotion_upvotes: Sequelize.INTEGER
		//description: Sequelize.TEXT
	}, {
		timestamps: false,
		tableName: 'user_rank'
	});

	return UserRank;
};
