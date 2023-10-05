const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')

beforeEach(() => {
	return seed(data)
})
afterAll(() => {
	return db.end()
})

//This test will cover every endpoint that doesn't exist
describe('path not found', () => {
	test('404 status code and error message if path not found', () => {
		return request(app)
			.get('/api/not-a-path')
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe('path not found')
			})
	})
})

describe('GET /api/articles/:article_id', () => {
	test('responds with 200 status code', () => {
		return request(app).get('/api/articles/1').expect(200)
	})
	test('GET:200 sends a single article to the client', () => {
		return request(app)
			.get('/api/articles/1')
			.then(({ body }) => {
				expect(body.article.title).toBe('Living in the shadow of a great man')
				expect(body.article.topic).toBe('mitch')
				expect(body.article.author).toBe('butter_bridge')
				expect(body.article.body).toBe('I find this existence challenging')
				expect(body.article.created_at).toBe('2020-07-09T20:11:00.000Z')
				expect(body.article.votes).toBe(100)
				expect(body.article.article_img_url).toBe(
					'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
				)
			})
	})
	test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
		return request(app)
			.get('/api/articles/999')
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe('article id does not exist')
			})
	})

	test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
		return request(app)
			.get('/api/articles/not-an-article')
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Bad request')
			})
	})
})

//to be placed later in the /api/articles/:article_id/comments describe block with GET
describe('POST /api/articles/:article_id/comments', () => {
	test('POST:201 inserts a new comment to the db and sends it back to the client', () => {
		const newComment = {
			username: 'icellusedkars',
			body: 'hello',
		}
		return request(app)
			.post('/api/articles/4/comments')
			.send(newComment)
			.expect(201)
			.then((response) => {
				expect(response.body.comment.body).toBe('hello')
				expect(response.body.comment.author).toBe('icellusedkars')
				expect(response.body.comment.article_id).toBe(4)
			})
	})
	test('POST:400 responds with an appropriate status and error message when provided with a malformed body', () => {
		return request(app)
			.post('/api/articles/4/comments')
			.send({ username: 'icellusedkars' })
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Bad request')
			})
	})
	test('POST:400 responds with an appropriate status and error message after failing schema validation e.g. author absence', () => {
		return request(app)
			.post('/api/articles/4/comments')
			.send({ username: 'chiara' })
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Bad request')
			})
	})

	test('POST: 404 sends an appropriate status and error message when given a valid but non-existent article id ', () => {
		return request(app)
			.post('/api/articles/1000/comments')
			.send({ username: 'icellusedkars', body: 'hello' })
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe('article id does not exist')
			})
	})

	test('POST: 400 sends an appropriate status and error message when given an invalid article id', () => {
		return request(app)
			.post('/api/articles/banana/comments')
			.send({ username: 'icellusedkars', body: 'hello' })
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Bad request')
			})
	})
})

// // 400 posting to invalid article id eg. /articles/10000/comments
//  404 posting to valid but non existent id eg. /articles/banana/comments
//  404 username isn't in the database
