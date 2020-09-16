const controllerFile = (model, ucModel, plurModel) => {
	const content = `const ${ucModel} = require("../models/${ucModel}.js");

module.exports = {
	create: async (req, res) => {
		try {
			const ${model} = red.body.${model}

			const new${ucModel} = new ${ucModel}({
				// Keys
			});

			await new${ucModel}.save();

			res.status(201).json({ message: "${ucModel} has been created" });
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	},

	read: async (req, res) => {
		try {
			let ${plurModel} = await ${ucModel}.find();
			res.status(200).json({ ${plurModel} });
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	},

	update: async (req, res) => {
		try {
			if (id) {
				const ${model} = await ${ucModel}.findOne({ _id: id });

				${model}.title = title;

				await ${model}.save();

				res.json({ message: "${ucModel} has been updated" });
			} else {
				res.status(400).json({ error });
			}
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	},

	delete: async (req, res) => {
		let id = req.body.id;

		try {
			if (id) {
				const ${model} = await ${ucModel}.findOne({ _id: id });

				await ${model}.remove();

				res.json({ message: "${ucModel} has been removed" });
			} else {
				res.status(400).json({ error });
			}
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	},
};
`;
	return content;
};

module.exports = controllerFile;
