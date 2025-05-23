//팩트체크 버튼
exports.factCheckButton = async (req, res) => {
  const articleId = req.params.articleId;
  console.log(`articleId: ${articleId}`);
  res.redirect(`/articles/${articleId}`);
}