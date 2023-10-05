const {
	fetchTopics,
	updateArticle,
	fetchArticles,
	fetchArticleById,
} = require('../models/models')

exports.getTopics = (req, res) => {
	fetchTopics().then((topics) => {
		res.status(200).send({ topics })
	})
}

exports.getArticles = (req, res) => {
	fetchArticles().then((articles) => {
		res.status(200).send({ articles })
	})
}

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params

	fetchArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article })
		})
		.catch((err) => {
			next(err)
		})
}

exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params
	const delta = req.body.inc_votes

	updateArticle(delta, article_id)
		.then((updatedArticle) => {
			res.status(200).send({ article: updatedArticle })
		})
		.catch((err) => {
			next(err)
		})
}
