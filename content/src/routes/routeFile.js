const routeFile = (modelName) => {
	const content = `const express = require("express");
const router = express.Router();
const ${modelName}Controller = require("../controllers/${modelName}.js");

router.post("/${modelName}", ${modelName}Controller.create);

router.get("/${modelName}", ${modelName}Controller.read);

router.put("/${modelName}", ${modelName}Controller.update);

router.delete("/${modelName}", ${modelName}Controller.delete);

module.exports = router;
`;
	return content;
};

module.exports = routeFile;
