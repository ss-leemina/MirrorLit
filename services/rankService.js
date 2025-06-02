// 자동 등급 평가하는 함수                                                                                                                            
const db = require("../models");
const User = db.User;
const UserRank = db.UserRank;
const Comment = db.comment;
const CommentReaction = db.CommentReaction;
const UserNotification = db.UserNotification;

//등급 평가 함수
const evaluateUserRank = async (userId) => {
	try {
		//사용자 정보 불러오기
		const user = await User.findByPk(userId);
		if (!user) return; //유저 존재하지 않는 경우 종료

		//현재 등급 확인
		const currentRank = await UserRank.findByPk(user.rank_id);

		//댓글 수 계산
		const commentCount = await Comment.count({
			where: { user_id: userId }
		});

		//추천 수(추천 누른 수) 확인
		const upvoteCount = await CommentReaction.count({
			where: {
				user_id: userId,
				reaction_type: 'like'
			}
		});

		//전체 등급 불러오기
		const ranks = await UserRank.findAll({
			order: [['min_comments', 'ASC'], ['min_upvotes', 'ASC']]
		});

		//등급이 확장되어도 문제 없을 수 있도록
		const defaultRank = ranks.find(rank => rank.min_comments === 0 && rank.min_upvotes === 0);
		let newRank = defaultRank || ranks[0];

		//유저가 승급 조건 만족했는지 확인
		for (const rank of ranks) {
			if (
				commentCount >= rank.min_comments &&
				upvoteCount >= rank.min_upvotes
			) {
				newRank = rank;
			}
		}

		//등급 변경된 경우 업데이트, 알림기능
		if (user.rank_id !== newRank.rank_id) {
			//등급 업데이트
			await user.update({ rank_id: newRank.rank_id });
      
			//알림 DB에 저장
			await UserNotification.create({
				user_id: user.user_id,
				message: `${newRank.name}'등급으로 승급되었습니다.`
			});

			//SSE알림 전송(실시간)
			if (global.sendSSE) {
				global.sendSSE(user.user_id, `${newRank.name} 등급으로 승급되었습니다.`);
			}

			console.log(`사용자 '${user.name}'이(가) '${newRank.name}' 등급으로 승급되었습니다.`);
		}
	} catch (err) {
		console.error('등급 평가 실패: ', err);
	}
};

module.exports = { evaluateUserRank };