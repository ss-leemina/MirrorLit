// 이거 db에 넣었습니다! 지워도 괜찮은거면 지워주세요~
// INSERT INTO user_rank(rank_name, min_comments, min_upvotes) VALUES ('신규', 0, 0), ('기존', 5, 10); 

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
		min_comments: Sequelize.INTEGER,
		min_upvotes: Sequelize.INTEGER
		//description: Sequelize.TEXT
	}, {
		timestamps: false,
		tableName: 'user_rank'
	});

	return UserRank;
};