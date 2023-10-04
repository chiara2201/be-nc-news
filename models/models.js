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

exports.updateArticle = (delta, article_id) => {
	return db
		.query(
			`
		UPDATE articles 
		SET votes = votes + $1
		WHERE article_id = $2
		RETURNING *
	`,
			[delta, article_id]
		)
		.then((result) => {
			return result.rows[0]
		})
}
