const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//모델 생성
db.article = require("./article.js")(sequelize, Sequelize);
db.articleImage = require("./articleImage.js")(sequelize, Sequelize);
db.comment = require("./comment.js")(sequelize, Sequelize);

//관계 정의
require("./associate.js")(db);

module.exports = db;
