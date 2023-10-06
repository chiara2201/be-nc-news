const app = require('../app')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const { CLIENT_RENEG_LIMIT } = require('tls')

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
			})
	})
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
					(a1, a2) => Date.parse(a2.created_at) - Date.parse(a1.created_at)
				)

				expect(articles).toEqual(sortedArticles)
			})
	})
})

describe('/api/articles/:article_id', () => {
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

	test('PATCH: 404 sends an appropriate status and error message when given a valid but non-existent article id', () => {
		const articleUpdate = {
			inc_votes: 2,
		}

		return request(app)
			.patch('/api/articles/1000')
			.send(articleUpdate)
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe('article id does not exist')
			})
	})

	test('PATCH: 400 sends an appropriate status and error message when given an invalid', () => {
		const articleUpdate = {
			inc_votes: 2,
		}

		return request(app)
			.patch('/api/articles/banana')
			.send(articleUpdate)
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Bad request')
			})
	})

	test('PATCH:400 responds with an appropriate status and error message when provided with a malformed body', () => {
		const articleUpdate = { inc_votes: 'banana' }

		return request(app)
			.patch('/api/articles/1')
			.send(articleUpdate)
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Bad request')
			})
	})

	// test('GET:200 responds with an article object with a comment_count property', () => {
	// 	return request(app)
	// 		.get('/api/articles/1')
	// 		.expect(200)
	// 		.then((response) => {
	// 			expect(response.body.topics.length).toBe(3)
	// 			response.body.topics.forEach((topic) => {
	// 				expect(typeof topic.slug).toBe('string')
	// 				expect(typeof topic.description).toBe('string')
	// 			})
	// 		})
	// })
})

// describe('/api/users', () => {
// 	test('GET:200 responds with an array of users', () => {
// 		return request(app)
// 			.get('/api/users')
// 			.expect(200)
// 			.then((res) => {
// 				const commentCount = res.body.article.comment_count
// 				expect(commentCount).toBe(11)
// 			})
// 	})
// })
describe('/api/comments/:comment_id', () => {
	test('DELETE:204 deletes the specified comment and sends no body back', () => {
		return request(app).delete('/api/comments/3').expect(204)
	})
	test('DELETE:404 responds with an appropriate status and error message when given a non-existent id', () => {
		return request(app)
			.delete('/api/comments/999')
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe('comment does not exist')
			})
	})
	test('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
		return request(app).delete('/api/comments/not-a-comment')
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
