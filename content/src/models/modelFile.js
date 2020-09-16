const modelFile = (modelName) => {
	const content = `const mongoose = require("mongoose");

const ${modelName} = mongoose.model("${modelName}", {
});

module.exports = ${modelName};
`;
	return content;
};

module.exports = modelFile;
