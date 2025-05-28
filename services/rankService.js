// 자동 등급 평가하는 함수                                                                                                                            
const { User, comment, CommentReaction, UserRank, UserNotification } = require("../models");

async function evaluateUserRank(userId) {
        try {
                const user = await User.findByPK(userId);
                if (!user) return;

                //현재 등급 불러오기
                const currentRank = await UserRank.findUser(user.rank_id);
                if (currentRank?.name == '기존') return;

                //댓글 수 확인
                const commentCount = await comment.count({
                        where: { user_id: userId }
                });

                //추천 수(추천 누른 수) 확인
                const upvoteCount = await CommentReaction.count({
                        where: {
                                user_id: userId,
                                reactioin_type: 'upvote'
                        }
                });

                //전체 등급 불러오기
                const ranks = await UserRank.findALL({ order: [['min_comments', 'ASC']] });

                //승급 조건 만족했는지 확인
                for (const rank of ranks) {
                        if (
                                commentCount >= rank.min_comments &&
                                upvoteCount >= rank.min_upvotes &&
                                user.rank_id !== rank.rank_id
                        ) {
                                user.rank_id = rank.rank_id;
                                await user.save();

                                await UserNotification.create({
                                        user_id: user.user_id,
                                        message: `${rank.rank_name}'등급으로 승급되었습니다.`
                                });

                                console.log(`사용자 '${user.name}'이(가) '${rank.name}' 등급으로 승급되었습니다.`);
                        }
                }
        } catch (err) {
                console.error('등급 평가 실패: ', err);
        }
}

module.exports = { evaluateUserRank };
