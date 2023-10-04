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

describe('/api/articles/:article_id', () => {
	test('PATCH:200 responds with updated article, with incremented votes property', () => {
		const articleUpdate = {
			inc_votes: 2,
		}
		return request(app)
			.patch('/api/articles/1')
			.send(articleUpdate)
			.expect(200)
			.then((response) => {
				const article = response.body.article

				expect(article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: '2020-07-09T20:11:00.000Z',
					votes: 102,
					article_img_url:
						'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
				})
			})
	})
	test('PATCH:400 responds with an error message when provided with a malformed request body', () => {
		const articleUpdate = {}

		return request(app)
			.patch('/api/articles/1')
			.send(articleUpdate)
			.expect(400)
			.then((response) => {
				const message = response.body.message

				expect(message).toBe('Bad request')
			})
	})
})
