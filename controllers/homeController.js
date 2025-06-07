const db = require("../models"),
	Article = db.article;

// 서비스 카테고리 모아보기(현재는 최신 이슈만 존재)
exports.showMainPage = async (req, res) => {
	try {
                // 최신 이슈 카테고리 : 최신 기사 3개 미리보기
		data = await Article.findAll({
			limit: 3,
			order: [['created_at', 'DESC']]
		});

                // 메인페이지 렌더링
		res.render('home', { article: data });
	} catch (err) {
		res.status(500).send({
			message: err.message
		});
	}
};
