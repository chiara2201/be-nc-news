const endpoints = require('../endpoints.json') //Passing require() with the path to a JSON fie will synchronously read and parse the data into a javascript object
const {
	fetchTopics,
	fetchArticleById,
	fetchCommentsByArticleId,
} = require('../models/models')

exports.getEndpoints = (req, res) => {
	res.status(200).send({ endpoints })
}

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

//not sure if I should check if article_id is on the database before fetching comments
exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params

	fetchCommentsByArticleId(article_id)
		.then((comments) => {
			res.status(200).send({ comments })
		})
		.catch((err) => {
			next(err)
		})
}
