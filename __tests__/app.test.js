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

describe('/api', () => {
	test('GET:200 responds with an object describing all the available endpoints on your API', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then((response) => {
				console.log(response.body.endpoints)
				Object.values(response.body.endpoints).forEach((endpoint) => {
					expect(typeof endpoint.description).toBe('string')
					expect(Array.isArray(endpoint.queries)).toBe(true)
					expect(Array.isArray(endpoint.exampleResponse)).toBe(false)
					expect(typeof endpoint.exampleResponse).toBe('object')
				})
			})
	})
})

describe('/api/topics', () => {
	test('GET:200 responds with an array of topics', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then((response) => {
				expect(response.body.topics.length).toBe(3)
				response.body.topics.forEach((topic) => {
					expect(typeof topic.slug).toBe('string')
					expect(typeof topic.description).toBe('string')
				})

describe('/api/articles', () => {
	test('responds with 200 status code', () => {
		return request(app).get('/api/articles/1').expect(200)
	})
	test('GET:200 responds with an array of correct article objects', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then((response) => {
				expect(response.body.articles.length).toBe(data.articleData.length)
				response.body.articles.forEach((article) => {
					expect(typeof article.article_id).toBe('number')
					expect(typeof article.title).toBe('string')
					expect(typeof article.topic).toBe('string')
					expect(typeof article.author).toBe('string')
					expect(typeof article.created_at).toBe('string')
					expect(typeof article.votes).toBe('number')
					expect(typeof article.article_img_url).toBe('string')
					expect(typeof article.comment_count).toBe('string') //need to convert it if we are expecting the result as number instead
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

describe('/api/articles/:article_id/comments', () => {
	test('GET:200 responds with an array of comments for the given article_id', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then((response) => {
				expect(response.body.comments.length).toBe(11)
				response.body.comments.forEach((comment) => {
					expect(typeof comment.comment_id).toBe('number')
					expect(typeof comment.votes).toBe('number')
					expect(typeof comment.created_at).toBe('string')
					expect(typeof comment.author).toBe('string')
					expect(typeof comment.body).toBe('string')
					expect(comment.article_id).toBe(1)
				})
			})
	})

	test('GET:200 responds with an array of article objects sorted by creation date in descending order', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.then((response) => {
				const { comments } = response.body

				const sortedComments = [...comments].sort(
					// convert date string back into number (ms since epoch)
					(a1, a2) => Date.parse(a2.created_at) - Date.parse(a1.created_at)
				)

				expect(comments).toEqual(sortedComments)
			})
	})

	test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
		return request(app)
			.get('/api/articles/999/comments')
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe('no comments found')
			})
	})
	test('GET:400 responds with an appropriate error message when given an invalid id', () => {
		return request(app)
			.get('/api/articles/not-an-id/comments')
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Bad request')
			})
	})
})
