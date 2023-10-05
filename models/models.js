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

exports.fetchCommentsByArticleId = (articleId) => {
	return db
		.query(
			'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;',
			[articleId]
		)
		.then((result) => {
			const fetchedComments = result.rows
			if (fetchedComments.length === 0) {
				//resource does not exist
				return Promise.reject({
					//forces this into the .catch() in the controller
					status: 404,
					message: 'no comments found',
				})
			}
			return fetchedComments
		})
}
