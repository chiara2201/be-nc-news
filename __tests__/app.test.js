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


		return request(app)
			.get('/api/articles')
			.expect(200)
			.then((response) => {
				return console.log(response.body.articles)
				expect(response.body.articles.length).toBe(data.articleData.length)
				response.body.articles.forEach((article) => {
					expect(typeof article.title).toBe('string')
					expect(typeof article.topic).toBe('string')
					expect(typeof article.author).toBe('string')
					expect(typeof article.body).toBe('string')
					expect(typeof article.created_at).toBe('string')
					expect(typeof article.votes).toBe('number')
					expect(typeof article.article_img_url).toBe('string')
				})
			})
	})

	test('GET:200 responds with an array of article objects sorted by date in descending order.', () => {
		return request(app)
			.get('/api/articles')
			.then((response) => {
				const { articles } = response.body

				const sortedArticles = [...articles].sort(
					// convert date string back into number (ms since epoch)
					(a1, a2) => Date.parse(a1.created_at) - Date.parse(a2.created_at)
				)

				console.log(sortedArticles)
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
