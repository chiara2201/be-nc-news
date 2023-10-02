const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
	return seed(data);
});
afterAll(() => {
	return db.end();
});

//This test will cover every endpoint that doesn't exist
describe("path not found", () => {
	test("404 status code and error message if path not found", () => {
		return request(app)
			.get("/api/not-a-path")
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe("path not found");
			});
	});
});

describe("/api/topics", () => {
	test("GET:200 responds with an array of topics", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then((response) => {
				expect(response.body.topics.length).toBe(3);
				response.body.topics.forEach((topic) => {
					expect(typeof topic.slug).toBe("string");
					expect(typeof topic.description).toBe("string");
				});
			});
	});
});
