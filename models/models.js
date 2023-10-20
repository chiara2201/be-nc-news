const db = require('../db/connection')

exports.fetchTopics = () => {
	return db.query('SELECT * FROM topics;').then((result) => {
		return result.rows
	})
}

exports.fetchArticles = () => {
	const query = `
	SELECT 
		articles.author, 
		articles.title, 
		articles.article_id, 
		articles.topic, 
		articles.created_at,
		articles.votes, 
		articles.article_img_url,
		COUNT(comments.article_id) as comment_count 
	FROM articles 
	LEFT JOIN comments ON articles.article_id = comments.article_id 
	GROUP BY articles.article_id 
	ORDER BY articles.created_at DESC;`

	return db.query(query).then((result) => {
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

exports.fetchUsers = () => {
	return db.query('SELECT * FROM users;').then((result) => {
		return result.rows
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

exports.fetchCommentsByArticleId = (articleId) => {
	return db
		.query(
			'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;',
			[articleId]
		)
		.then((result) => {
			const fetchedComments = result.rows
			if (fetchedComments.length === 0) {
				// comments don't exist
				return Promise.reject({
					// forces this into the .catch() in the controller
					status: 404,
					message: 'no comments found',
				})
			}
			return fetchedComments
		})
}
