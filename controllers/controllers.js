const endpoints = require("../endpoints.json"); //Passing require() with the path to a JSON fie will synchronously read and parse the data into a javascript object
const { fetchTopics } = require("../models/models");

exports.getTopics = (req, res) => {
	fetchTopics().then((topics) => {
		res.status(200).send({ topics });
	});
};

exports.getEndpoints = (req, res) => {
	res.status(200).send({ endpoints });
};
