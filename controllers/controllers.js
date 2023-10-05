const {
	fetchTopics,
	fetchArticles,
	fetchArticleById,
} = require('../models/models')

exports.getTopics = (req, res) => {
	fetchTopics().then((topics) => {
		res.status(200).send({ topics })
	})
}

exports.getArticles = (req, res) => {
	const { topic } = req.query
	fetchArticles(topic).then((articles) => {
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
