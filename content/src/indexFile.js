const indexFile = (name) => {
	const content = `const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/${name}", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// The following comments are required for 'qb-mdl' to automatically update this file upon adding a model. Do not remove them !

// MODELS

// ROUTES

// USE ROUTES


app.get("/", (req, res) => {
	res.send("Main page reached");
});

app.listen(3000, () => {
	console.log("Server has started");
});
`;
	return content;
};

module.exports = indexFile;
