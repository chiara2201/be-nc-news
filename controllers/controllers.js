const {
	fetchTopics,
	fetchArticleById,
	createComment,
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

exports.postComment = (req, res, next) => {
	const newComment = req.body
	const { article_id } = req.params

	fetchArticleById(article_id)
		.then((article) => {
			return createComment(article_id, newComment)
		})
		.then((insertedComment) => {
			res.status(201).send({ comment: insertedComment })
		})
		.catch((err) => {
			next(err)
		})
}
