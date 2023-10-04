const {
	fetchTopics,
	fetchArticleById,
	removeCommentById,
} = require('../models/models')

exports.getTopics = (req, res) => {
	fetchTopics().then((topics) => {
		res.status(200).send({ topics })
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

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params

	removeCommentById(comment_id)
		.then((deletedComment) => {
			res.status(204).send()
		})
		.catch((err) => {
			next(err)
		})
}
