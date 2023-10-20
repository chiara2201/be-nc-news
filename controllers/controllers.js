const endpoints = require('../endpoints.json') //Passing require() with the path to a JSON fie will synchronously read and parse the data into a javascript object
const {
	fetchTopics,
	updateArticle,
	fetchArticles,
	fetchArticleById,
	fetchUsers,
	removeCommentById,
	fetchCommentsByArticleId,
	createComment,
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

exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params
	const delta = req.body.inc_votes

	fetchArticleById(article_id)
		.then((article) => {
			return updateArticle(delta, article_id)
		})
		.then((updatedArticle) => {
			res.status(200).send({ article: updatedArticle })
		})
		.catch((err) => {
			next(err)
		})
}

exports.getUsers = (req, res) => {
	fetchUsers().then((users) => {
		res.status(200).send({ users })
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

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params

	fetchArticleById(article_id)
		.then((article) => {
			return fetchCommentsByArticleId(article_id)
		})
		.then((comments) => {
			res.status(200).send({ comments })
		})
		.catch((err) => {
			next(err)
		})
}
