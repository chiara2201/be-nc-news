const db = require('../db/connection')

exports.fetchTopics = () => {
	return db.query('SELECT * FROM topics;').then((result) => {
		return result.rows
	})
}

exports.fetchArticleById = (articleId) => {
	return db
		.query('SELECT * FROM articles WHERE article_id = $1;', [articleId])
		.then((result) => {
			const fetchedArticle = result.rows[0]
			if (!fetchedArticle) {
				return Promise.reject({
					//forces this into the .catch() in the controller
					status: 404,
					message: 'article id does not exist',
				})
			}
			return fetchedArticle
		})
}

exports.createComment = (article_id, newComment) => {
	return db
		.query(
			`INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *;`,
			[article_id, newComment.body, newComment.username]
		)
		.then((result) => {
			return result.rows[0]
		})
}
