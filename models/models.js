const db = require('../db/connection')

exports.fetchTopics = () => {
	return db.query('SELECT * FROM topics;').then((result) => {
		return result.rows
	})
}

exports.fetchArticles = () => {
	const query =
		'SELECT * FROM articles JOIN comments ON articles.article_id = comments.article_id ORDER BY articles.created_at ;'
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
	//.catch((err) => console.log(err.message)) //postgres err
}
