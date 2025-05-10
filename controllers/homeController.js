const db = require("../db");

exports.showMainPage = (req, res) => {
	res.render('home');
};
