const {
	getEndpoints,
	getTopics,
	getArticles,
	getArticleById,
	patchArticleById,
	getUsers,
	deleteCommentById,
	postComment,
	getCommentsByArticleId,
} = require('./controllers/controllers')

const {
	handlePSQLErrors,
	handleCustomErrors,
	handle500Errors,
} = require('./controllers/errors.controllers')

const express = require('express')
const app = express()
app.use(express.json()) //Brings in request body

app.get('/api', getEndpoints)

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/users', getUsers)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleById)

app.patch('/api/articles/:article_id', patchArticleById)

app.post('/api/articles/:article_id/comments', postComment)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.delete('/api/comments/:comment_id', deleteCommentById)

//For all requests that come in that haven't been dealt with in the chain (if we go to any other end point), send the client { message: "path not found" }
app.all('/*', (req, res) => {
	const data = { message: 'path not found' }
	res.status(404).send(data)
})

//Error handlilng middleware
app.use(handlePSQLErrors)
app.use(handleCustomErrors)
app.use(handle500Errors)

module.exports = app
