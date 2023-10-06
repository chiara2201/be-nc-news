
const endpoints = require('../endpoints.json') //Passing require() with the path to a JSON fie will synchronously read and parse the data into a javascript object
const {
	fetchTopics,
	fetchArticles,
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


exports.postComment = (req, res, next) => {
	const newComment = req.body
  
exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params

	fetchArticleById(article_id)
		.then((article) => {

			return createComment(article_id, newComment)
		})
		.then((insertedComment) => {
			res.status(201).send({ comment: insertedComment })

			return fetchCommentsByArticleId(article_id)
		})
		.then((comments) => {
			res.status(200).send({ comments })

		})
		.catch((err) => {
			next(err)
		})
}
