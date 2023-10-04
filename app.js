const {
	getTopics,
	getArticles,
	getArticleById,
} = require('./controllers/controllers')

const {
	handlePSQLErrors,
	handleCustomErrors,
	handle500Errors,
} = require('./controllers/errors.controllers')

const express = require('express')
const app = express()

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

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
