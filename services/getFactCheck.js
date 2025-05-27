const db = require("../models"),
  FactCheck = db.factCheckButton;

const getfactCheckCount = async (article_id) => {
  const counts = await FactCheck.findAll({
    attributes: [
      'factCheck_type',
      [db.Sequelize.fn('COUNT', db.Sequelize.col('factCheck_type')), 'count']
    ],
    where: { article_id },
    group: ['factCheck_type'],
    raw: true
  });

  const result = { fact: 0, nofact: 0 };
  counts.forEach(({ factCheck_type, count }) => {
    result[factCheck_type] = parseInt(count, 10);
  });

  return result;
}

module.exports = { getfactCheckCount };