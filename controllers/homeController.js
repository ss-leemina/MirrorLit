const db = require("../models"),
	Article = db.article;

exports.showMainPage = async (req, res) => {
	try {
		data = await Article.findAll({
			limit: 3,
			order: [['created_at', 'DESC']]
		});
		res.render('home', { article: data });
	} catch (err) {
		res.status(500).send({
			message: err.message
		});
	}
};
