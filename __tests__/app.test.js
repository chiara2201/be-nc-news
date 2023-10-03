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

describe("/api", () => {
	test("GET:200 responds with an object describing all the available endpoints on your API", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then((response) => {
				console.log(response.body.endpoints);
				Object.values(response.body.endpoints).forEach((endpoint) => {
					expect(typeof endpoint.description).toBe("string");
					expect(Array.isArray(endpoint.queries)).toBe(true);
					expect(Array.isArray(endpoint.exampleResponse)).toBe(false);
					expect(typeof endpoint.exampleResponse).toBe("object");
				});
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
