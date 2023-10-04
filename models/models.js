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

exports.removeCommentById = (comment_id) => {
	return db
		.query(
			`
		DELETE FROM comments 
		WHERE comment_id = $1
		RETURNING *;
	`,
			[comment_id]
		)
		.then((result) => {
			if (result.rows.length === 0) {
				return Promise.reject({
					status: 404,
					message: 'comment does not exist',
				})
			} else return result.rows[0]
		})
}
