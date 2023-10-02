const { getTopics } = require("./controllers/controllers");

const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

//For all requests that come in that haven't been dealt with in the chain (if we go to any other end point), send the client { message: "path not found" }
app.all("/*", (req, res) => {
	const data = { message: "path not found" };
	res.status(404).send(data);
});

module.exports = app;
